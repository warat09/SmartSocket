import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { Assets } from '../entity/Asset';
import { Node } from '../entity/Node'
import { Match } from '../entity/Match'
import { User_match } from '../entity/Usermatch'
import { User } from '../entity/User';
import { Maintenance_Assets } from '../entity/Maintenance';

const GetAllDashboard = async (req: Request, res: Response, next: NextFunction) => {
    const countasset = await AppDataSource.getRepository(Assets).createQueryBuilder('Asset').getCount();
    const countnode = await AppDataSource.getRepository(Node).createQueryBuilder('Node').getCount();
    const countmatch = await AppDataSource.getRepository(Match).createQueryBuilder('Match').getCount();
    const countmatchapprove = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').where('UserMatch.status_user_match = :status',{status:'Wait for Approve'}).getCount();
    const countapprove = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').where('UserMatch.status_user_match = :status',{status:'Approve'}).getCount();
    const countmatchrent = await AppDataSource.getRepository(Match).createQueryBuilder('Match').where('Match.status_rent = :status',{status:'Rent'}).getCount();
    const countmatchnotrent = await AppDataSource.getRepository(Match).createQueryBuilder('Match').where('Match.status_rent = :status',{status:'Available'}).getCount();
    // const countmaintenance = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').where('UserMatch.status = notrent').getCount();
    const countuser = await AppDataSource.getRepository(User).createQueryBuilder('User').where({status_user	: "Active"}).getCount();
    const topic = ["Assets","Sockets","Matching","Wait for approve","Approve","rent","not_rent","people"]
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
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets').getRawMany();
    const maintenance = await AppDataSource.getRepository(Assets).find()
    const donut = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch')
    .innerJoinAndSelect(Match, 'Match', 'UserMatch.id_match = Match.id_match')
    .innerJoinAndSelect(User, 'User', 'User.id_user = UserMatch.id_user')
    .select(['departure','COUNT(departure) AS total'])
    .where(`Match.status_rent = :status_rent`, {status_rent: "Rent"})
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
    // if(mountmaintenancing){
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
                name:'maintenance',
                data:chartmaintenancing
            },
            {
                name:'success maintenance',
                data:chartsuccessmaintenance
            }
        ]
    
    return res.status(200).json({countall:array,remainingtime:remaining_time,maintenance:maintenance,totaldeparturerent:donut,totalchart:chart})
}


export default {GetAllDashboard};