import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { Assets } from '../entity/Asset';
import { Node } from '../entity/Node'
import { Match } from '../entity/Match'
import { User_match } from '../entity/Usermatch'
import { User } from '../entity/User';
import { Maintenance_Assets } from '../entity/Maintenance';

const GetAllDashboard = async (req: Request, res: Response, next: NextFunction) => {
    const countasset = await AppDataSource.getRepository(Assets).createQueryBuilder('Asset').where(`Asset.status_assets = "Active"`).getCount();
    const countnode = await AppDataSource.getRepository(Node).createQueryBuilder('Node').where(`Node.status_node = "Enable"`).getCount();
    const countmatch = await AppDataSource.getRepository(Match).createQueryBuilder('Match').where(`Match.status_match = "Enable"`).getCount();
    const countmatchapprove = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').where('UserMatch.status_user_match = :status OR UserMatch.status_user_match = :status_return',{status:'Wait for Approve',status_return:'Wait for Approve Return'}).getCount();
    const countapprove = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').where('UserMatch.status_user_match = :status',{status:'Approve'}).getCount();
    const countmatchrent = await AppDataSource.getRepository(Match).createQueryBuilder('Match').where('Match.status_rent = :status AND Match.status_match = :status_match',{status:'Rent',status_match:'Enable'}).getCount();
    const countmatchnotrent = await AppDataSource.getRepository(Match).createQueryBuilder('Match').where('Match.status_rent = :status AND Match.status_match = :status_match',{status:'Available',status_match:'Enable'}).getCount();
    const countuser = await AppDataSource.getRepository(User).createQueryBuilder('User').where({status_user	: "Active"}).getCount();
    const topic = ["อุปกรณ์","เต้าเสียบ","จับคู่อุปกรณ์","รอการอนุมัติ","อนุมัติ","อุปกรณ์ที่ถูกยืม","อุปกรณ์ที่ยังไม่ถูกยืม","จำนวนผู้ใช้"]
    const amount = [countasset,countnode,countmatch,countmatchapprove,countapprove,countmatchrent,countmatchnotrent,countuser]
    const icon = ["ri:plug-2-line","mdi:plug-socket-au","ph:plugs-bold","material-symbols:nest-clock-farsight-analog-outline-rounded","line-md:circle-to-confirm-circle-transition","fa6-solid:plug-circle-bolt","fa6-solid:plug-circle-plus","mdi:user-group-outline"]
    const array = []
    topic.map((v:any,i:any)=>{
        const attribute = {
            topic:v,
            amount:amount[i],
            icon:icon[i]
        }
        array.push(attribute)
    })
    const remaining_time = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets').where('Match.status_match = :status',{status:"Enable"}).getRawMany();
    const maintenance = await AppDataSource.getRepository(Assets).find({
        where:{
            status_assets:"Active"
        }
    })
    const donut = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch')
    .innerJoinAndSelect(Match, 'Match', 'UserMatch.id_match = Match.id_match')
    .innerJoinAndSelect(User, 'User', 'User.id_user = UserMatch.id_user')
    .select(['departure','COUNT(departure) AS total'])
    .where(`Match.status_rent = :status_rent AND Usermatch.status_user_match = :status_user_match`, {status_rent: "Rent",status_user_match:"Approve"})
    .groupBy('departure').getRawMany();

    const mountmaintenancing = await AppDataSource.getRepository(Maintenance_Assets).createQueryBuilder('Maintenance')
    .select([' MONTH(Maintenance.date_maintenance) AS Month','COUNT(MONTH(Maintenance.date_maintenance)) AS Total'])
    .where(`Maintenance.status_maintenance = :status_maintenance`, {status_maintenance: "maintenancing"})
    .groupBy('MONTH(Maintenance.date_maintenance)').getRawMany();

    const mountsuccess= await AppDataSource.getRepository(Maintenance_Assets).createQueryBuilder('Maintenance')
    .select([' MONTH(Maintenance.date_maintenance) AS Month','COUNT(MONTH(Maintenance.date_maintenance)) AS Total'])
    .where(`Maintenance.status_maintenance = :status_maintenance`, {status_maintenance: "success maintenance"})
    .groupBy('MONTH(Maintenance.date_maintenance)').getRawMany();
    console.log(mountmaintenancing.length)
        let chartmaintenancing = [0,0,0,0,0,0,0,0,0,0,0,0]
        let chartsuccessmaintenance = [0,0,0,0,0,0,0,0,0,0,0,0]
        for(let i = 1 ;i <= mountmaintenancing.length;i++){
            chartmaintenancing[mountmaintenancing[i-1].Month-1] = Number(mountmaintenancing[i-1].Total)
        }
        for(let i = 1 ;i <= mountsuccess.length;i++){
            chartsuccessmaintenance[mountsuccess[i-1].Month-1] = Number(mountsuccess[i-1].Total)
        }
        let chart = [
            {
                name:'ส่งบำรุงรักษา',
                data:chartmaintenancing
            },
            {
                name:'บำรุงรักษาเสร็จสิ้น',
                data:chartsuccessmaintenance
            }
        ]
    
    const AllMatching = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets')
    .where(`Match.status_match = :status`, {status:"Enable"}).getRawMany();
    const FilterMatch = []
    AllMatching.map(async(v,i)=>{
        const Match = AllMatching[i]
        if((Match.Asset_expire_hour*(1000*60*60))-Match.Match_sum_used_time <= 604800000){
            const attribute = {
                Asset_name_assets:Match.Asset_name_assets,
                Match_mac_address:Match.Match_mac_address,
                Match_status_rent:Match.Match_status_rent,
                Match_sum_used_time:(Match.Asset_expire_hour*(1000*60*60))-Match.Match_sum_used_time,
            }
            FilterMatch.push(attribute);
        }
    })
    return res.status(200).json({countall:array,remainingtime:FilterMatch,maintenance:maintenance,totaldeparturerent:donut,totalchart:chart})
}


export default {GetAllDashboard};