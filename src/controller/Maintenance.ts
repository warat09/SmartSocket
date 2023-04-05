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
    .where('Asset.maintenance = 1')
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
    if(status_maintenance === "Success Maintenance"){
        const CheckAssets = await AppDataSource.getRepository(Assets).findOneBy({
            id_assets: asset
        })
        if(Object.values(CheckAssets).length !== 0){
            const Asset = new Assets();
            Asset.maintenance = false;
            AppDataSource.getRepository(Assets).merge(CheckAssets, Asset)
            const results = await AppDataSource.getRepository(Assets).save(CheckAssets)
            if(Object.values(results).length !== 0){
                const CheckMatchAssets = await AppDataSource.getRepository(Match).findOneBy({
                    id_assets: asset
                })
                if(Object.values(CheckMatchAssets).length !== 0){
                    const MatchAsset = new Match();
                    MatchAsset.sum_used_time = 0;
                     AppDataSource.getRepository(Match).merge(CheckMatchAssets, MatchAsset)
                     await AppDataSource.getRepository(Match).save(CheckMatchAssets)
                }
            }
            // return res.status(200).json({status:1,data:results,message: "Update Success"});
        }
        // const Updatemaintenance = await AppDataSource
        //     .createQueryBuilder()
        //     .update(Assets)
        //     .set({
        //         maintenance : 0
        //     })
        //     .where("id_assets = :id", { id: asset }).execute()
    }
    Maintenance.id_assets = asset;
    Maintenance.status_maintenance = status_maintenance;
    Maintenance.date_maintenance = new Date(Date_maintenance);
    const AddMaintenance = AppDataSource.getRepository(Maintenance_Assets).create(Maintenance)
    const results = await AppDataSource.getRepository(Maintenance_Assets).save(AddMaintenance)
    return res.status(200).json({status:1,data:results,message: "Update Status Success"});
}


export default {GetAllMaintenance, AddStatusMaintenance};