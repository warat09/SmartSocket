import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { Assets } from '../entity/Asset';
import {Match} from "../entity/Match"
import {User_match} from "../entity/Usermatch"

const MatchingAsset = async (req: Request, res: Response, next: NextFunction) => {
    let {mac_address,id_assets,room,floor} = req.body
    let Datetime = new Date(new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' }));
    console.log(id_assets)
    // const MatchAsset = await AppDataSource.getRepository(Match).createQueryBuilder()
    // .select("mac_address").where(`id_assets = ${id_assets}`).getQuery();

    const InputRemainTime= await AppDataSource
    .getRepository(Assets)
    .createQueryBuilder()
    .select("expire_hour")
    .where(`id_assets=${id_assets}`)
    .getRawOne()

    const match = new Match()
    match.id_assets = id_assets;
    match.mac_address = mac_address;
    match.status_match = "Enable";
    // match.remain_time = InputRemainTime.expire_hour*(1000*60*60)//ดึง asset expire_hour no apiinput
    match.sum_used_time = 0
    match.active_datetime = Datetime;
    match.room = room;
    match.floor = floor;
    match.status_rent = "Available";

    const CheckMatch = await AppDataSource.getRepository(Match).find({
        where: {
            mac_address: mac_address,
            id_assets: id_assets,
        },
    });
    if(Object.values(CheckMatch).length === 0){
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
    const SelectIdMatch = AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').select('id_match').where(`UserMatch.status_user_match IN ("Wait for Approve","Approve")`).getQuery();
    // const SelectDistanceRent = AppDataSource.getRepository(Match).createQueryBuilder('Match').select('mac_address').distinct(true).where('Match.status_rent = :status', {status:"Rent"}).getQuery();
    const GetRentMatch = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets')
    .where(`Match.status_rent = :status_rent AND Match.status_match = :status AND Match.id_match NOT IN (${SelectIdMatch})`, {status_rent: "Available",status:"Enable"}).getRawMany();
    res.json(GetRentMatch)
};

const GetAssetMaintenance = async (req: Request, res: Response, next: NextFunction) => {
    const SelectMaintenance = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets').where(`Asset.maintenance = :status_maintenanace`,{status_maintenanace:1}).getRawMany();
    console.log(SelectMaintenance)
    res.json(SelectMaintenance)     
}

const GetAllMatching = async (req: Request, res: Response, next: NextFunction) => {
    const AllMatching = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets').getRawMany();
    const FilterMatch = []
    AllMatching.map((v,i)=>{
        // console.log("value",v[i].Match_id_match)
        const Match = AllMatching[i]
        const attribute = {
            Asset_name_assets:Match.Asset_name_assets,
            Match_mac_address:Match.Match_mac_address,
            Match_status_match:Match.Match_status_match,
            Match_sum_used_time:(Match.Asset_expire_hour*(1000*60*60))-Match.Match_sum_used_time,
            Match_active_datetime:Match.Match_active_datetime,
            Match_room:Match.Match_room,
            Match_floor:Match.Match_floor
        }
        console.log(attribute)
        FilterMatch.push(attribute);
    })
    res.json(FilterMatch)
};


export default {MatchingAsset,GetRentMatch,GetAssetMaintenance,GetAllMatching};