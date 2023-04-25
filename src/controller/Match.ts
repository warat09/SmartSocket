import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { Assets } from '../entity/Asset';
import {Match} from "../entity/Match"
import {User_match} from "../entity/Usermatch"
import { Maintenance_Assets } from '../entity/Maintenance';
import { User } from '../entity/User';

const MatchingAsset = async (req: Request, res: Response, next: NextFunction) => {
    let {mac_address,id_assets,} = req.body
    let Datetime = new Date(new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' }));
    const CheckMatch = await AppDataSource.getRepository(Match).find({
        where: {
            mac_address: mac_address,
            id_assets: id_assets,
            status_match:"Enable"
        },
    });
    if(Object.values(CheckMatch).length === 0){
        const match = new Match()
        match.id_assets = id_assets;
        match.mac_address = mac_address;
        match.status_match = "Enable";
        match.sum_used_time = 0
        match.active_datetime = Datetime;
        match.room = "-";
        match.floor = "-";
        match.status_rent = "Available";
        const AddMatch = AppDataSource.getRepository(Match).create(match)
        const results = await AppDataSource.getRepository(Match).save(AddMatch)
        return res.status(200).json({status:1,data:results,message: "Insert Success"});
    }
    else{
        res.status(200).json({status:1,message: `Have ${mac_address}`});
    }
};

const GetRentMatch = async (req: Request, res: Response, next: NextFunction) => {
    // const SelectUserMatch = AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').select('id_match').getQuery();
    // const SelectIdMatch = AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').select('id_match').where(`UserMatch.status_user_match IN ("Wait for Approve","Approve")`).getQuery();
    // const SelectDistanceRent = AppDataSource.getRepository(Match).createQueryBuilder('Match').select('mac_address').distinct(true).where('Match.status_rent = :status', {status:"Rent"}).getQuery();
    const GetRentMatch = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets')
    .where(`Asset.maintenance = 0 AND Match.status_rent != :status_rent AND Match.status_match = :status_match`, {status_rent: "Rent",status_match:"Enable"}).getRawMany();
    res.json(GetRentMatch)
};

const GetAssetMaintenance = async (req: Request, res: Response, next: NextFunction) => {
    const SelectMaintenance = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets').where(`Asset.maintenance = :status_maintenanace`,{status_maintenanace:1}).getRawMany();
    res.json(SelectMaintenance)     
}

const UpdateStatusMatching = async (req: Request, res: Response, next: NextFunction) => {
    const SelectStatusRent =  await AppDataSource.getRepository(User_match).createQueryBuilder('Usermatch')
    .where(`Usermatch.id_match = :id AND Usermatch.status_user_match = :status`,{id: req.params.id,status: "Wait for Approve"}).getRawMany();
    const CheckAssetMaintenance = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets')
    .where(`Match.id_match = :id AND Asset.maintenance = :maintenance`,{id: req.params.id,maintenance: 1}).getRawMany();
    if(Object.values(CheckAssetMaintenance).length > 0){
        return res.status(200).json({status:1,message: "Can't Delete Asset is maintenancing"});            
    }
    if(Object.values(SelectStatusRent).length > 0){
        await AppDataSource
        .createQueryBuilder()
        .update(User_match)
        .set({
            status_user_match : "Reject"
        })
        .where("id_match = :id", { id: req.params.id }).execute()
    }
    await AppDataSource
    .createQueryBuilder()
    .update(Match)
    .set({
        status_match : "Disable"
    })
    .where("id_match = :id", { id: req.params.id }).execute()
    return res.status(200).json({status:1,message: "Delete Success"});            
}

const UpdateMatching = async (req: Request, res: Response, next: NextFunction) => {
    const {node} = req.body;
    await AppDataSource
            .createQueryBuilder()
            .update(Match)
            .set({
                mac_address : node
            })
            .where("id_match = :id", { id: req.params.id }).execute()
    return res.status(200).json({status:1,message: "Update Success"});
}

const GetAllMatching = async (req: Request, res: Response, next: NextFunction) => {
    const AllMatching = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets')
    .where(`Match.status_match = :status`, {status:"Enable"}).getRawMany();
    
    console.log("AllMatching",AllMatching)
    const FilterMatch = []
    const Id_Match = []
    const cleandata = []
    AllMatching.map(async(v,i)=>{
        const Match = AllMatching[i]
        const attribute = {
            Match_id_match:Match.Match_id_match,
            Asset_name_assets:Match.Asset_name_assets,
            Match_mac_address:Match.Match_mac_address,
            Match_status_match:Match.Match_status_match,
            Match_status_rent:Match.Match_status_rent,
            Match_sum_used_time:(Match.Asset_expire_hour*(1000*60*60))-Match.Match_sum_used_time,
            Match_active_datetime:Match.Match_active_datetime,
            Match_room:Match.Match_room,
            Match_floor:Match.Match_floor,
            Asset_maintenance:Match.Asset_maintenance
        }
        Id_Match.push(Match.Match_id_match);
        FilterMatch.push(attribute);
        if((Match.Asset_expire_hour*(1000*60*60))-Match.Match_sum_used_time < 0){
            const a = await AppDataSource.getRepository(Assets).createQueryBuilder('Asset').where('Asset.maintenance = 0 AND Asset.id_assets = :id',{id:Match.Asset_id_assets}).getRawMany();
            console.log(Object.values(a).length)
            if(Object.values(a).length > 0){
            const UpdateStatusMaintenance = await AppDataSource
            .createQueryBuilder()
            .update(Assets)
            .set({
                maintenance: () => `1`
            })
            .where("id_assets = :id", { id:  Match.Asset_id_assets}).execute()
                if(UpdateStatusMaintenance){
                    let Date_maintenance = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' });
                    const Maintenance = new Maintenance_Assets();
                    Maintenance.id_assets = Match.Asset_id_assets;
                    Maintenance.date_maintenance = new Date(Date_maintenance);
                    Maintenance.status_maintenance = "Request Accepted"
                    const AddMaintenance = AppDataSource.getRepository(Maintenance_Assets).create(Maintenance)
                    await AppDataSource.getRepository(Maintenance_Assets).save(AddMaintenance)   
                }
            }
        }
    })
    const CheckUserRent = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch')
    .innerJoinAndSelect(User, 'User', 'User.id_user = UserMatch.id_user')
    .where(`UserMatch.id_match IN (:id_match) AND (UserMatch.status_user_match = :status OR UserMatch.status_user_match = :status2)`, {id_match:Id_Match,status:"Approve",status2:"Wait for Approve Return"}).getRawMany();
    
    FilterMatch.map((v,i)=>{
        let obj = {}
        const findobj = CheckUserRent.find(o => o.UserMatch_id_match === v.Match_id_match)
        if(findobj === undefined){
            obj = {
                Match_id_match:v.Match_id_match,
                Asset_name_assets:v.Asset_name_assets,
                Match_mac_address:v.Match_mac_address,
                Match_status_match:v.Match_status_match,
                Match_status_rent:v.Match_status_rent,
                Match_sum_used_time:v.Match_sum_used_time,
                Match_active_datetime:v.Match_active_datetime,
                Match_room:v.Match_room,
                Match_floor:v.Match_floor,
                Asset_maintenance:v.Asset_maintenance,
                User_rent:""
            }
        }
        else{
            obj = {
                Match_id_match:v.Match_id_match,
                Asset_name_assets:v.Asset_name_assets,
                Match_mac_address:v.Match_mac_address,
                Match_status_match:v.Match_status_match,
                Match_status_rent:v.Match_status_rent,
                Match_sum_used_time:v.Match_sum_used_time,
                Match_active_datetime:v.Match_active_datetime,
                Match_room:v.Match_room,
                Match_floor:v.Match_floor,
                Asset_maintenance:v.Asset_maintenance,
                User_rent:findobj.User_name+" "+findobj.User_surname
            }
        }
    cleandata.push(obj)    
    })
    console.log("cleandata",CheckUserRent)

    res.json(cleandata)
};


export default {MatchingAsset,GetRentMatch,GetAssetMaintenance,GetAllMatching,UpdateMatching, UpdateStatusMatching};