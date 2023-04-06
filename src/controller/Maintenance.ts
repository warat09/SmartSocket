import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { Assets } from '../entity/Asset';
import {Match} from "../entity/Match"
import {Maintenance_Assets} from "../entity/Maintenance"

interface Maintenance{
    Match_id_match:number,
    Asset_name:string,
    Asset_expire_hour: number,
    Match_sum_used_time:number
    History:any
}
const GetAllMaintenance = async (req: Request, res: Response, next: NextFunction) => {
    const AllMatching = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets')
    // .innerJoinAndSelect(Maintenance_Assets, 'Maintenance', 'Asset.id_assets = Maintenance.id_assets')
    .where('Asset.maintenance = 1 AND Match.status_match = "Enable"')
    .getRawMany();
    const StatusMaintenance = await AppDataSource.getRepository(Maintenance_Assets)
    .createQueryBuilder('Maintenance').orderBy('Maintenance.id_maintenance', 'DESC')
    .getRawMany();
    
    let cleandata = []
    AllMatching.map((value,index)=>{
        const arr = []
        StatusMaintenance.find((o, i) => {
            if(o.Maintenance_id_assets === AllMatching[index].Match_id_assets){
                arr.push(StatusMaintenance[i])
            }
        });
        let obj:Maintenance = {
            Match_id_match: AllMatching[index].Match_id_match,
            Asset_name:AllMatching[index].Asset_name_assets,
            Asset_expire_hour: Number(AllMatching[index].Asset_expire_hour*(36*(10**5))),
            Match_sum_used_time:(AllMatching[index].Asset_expire_hour*(1000*60*60))-AllMatching[index].Match_sum_used_time,
            History:arr
        }
        cleandata.push(obj)
    })
    console.log(cleandata)
    res.json(cleandata)
};

const AddStatusMaintenance = async (req: Request, res: Response, next: NextFunction) => {
    const {status_maintenance,asset} = req.body
    let Date_maintenance = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' });
    const Maintenance = new Maintenance_Assets()
    if(status_maintenance === "Request Accepted"){
        await AppDataSource
        .createQueryBuilder()
        .update(Match)
        .set({
            status_rent : "Available"
        })
        .where("id_assets = :id_assets AND status_match = :status", { id_assets: asset,status: "Enable" }).execute()
    }
    if(status_maintenance === "Success Maintenance"){
        const CheckAssets = await AppDataSource.getRepository(Assets).find({
            where: {
                id_assets: asset,
                status_assets: "Active"
            },
        }
        )
        console.log(CheckAssets)
        if(Object.values(CheckAssets).length !== 0){
            await AppDataSource
            .createQueryBuilder()
            .update(Assets)
            .set({
                maintenance : false
            })
            .where("id_assets = :id_assets AND status_assets = :status", { id_assets: asset,status: "Active" }).execute()
            await AppDataSource.createQueryBuilder().update(Match).set({
                sum_used_time:0
            }).where("id_assets = :id_assets AND status_match = :status", { id_assets: asset,status: "Enable" }).execute()
        }
    }
    Maintenance.id_assets = asset;
    Maintenance.status_maintenance = status_maintenance;
    Maintenance.date_maintenance = new Date(Date_maintenance);
    const AddMaintenance = AppDataSource.getRepository(Maintenance_Assets).create(Maintenance)
    const results = await AppDataSource.getRepository(Maintenance_Assets).save(AddMaintenance)
    return res.status(200).json({status:1,data:results,message: "Update Status Success"});
}


export default {GetAllMaintenance, AddStatusMaintenance};