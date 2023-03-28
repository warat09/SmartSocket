import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { Assets } from '../entity/Asset';
import {Match} from "../entity/Match"
import {Maintenance_Assets} from "../entity/Maintenance"

interface Maintenance{
    Match_id_match:number,
    Asset_name:string,
    Asset_expire_hour: number,
    Match_remain_time:number
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
    let checkstatus = ["success maintenance","maintenancing","request accepted","waiting for delivery"]
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
            Match_remain_time:Number(AllMatching[index].Match_remain_time),
            History:arr
        }
        cleandata.push(obj)
    })
    res.json(cleandata)
};


export default {GetAllMaintenance};