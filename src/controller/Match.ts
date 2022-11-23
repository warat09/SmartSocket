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
    match.remain_time = InputRemainTime.expire_hour//ดึง asset expire_hour no apiinput
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
    const SelectUserMatch = AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').select('id_match').getQuery();
    const GetRentMatch = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets')
    .where(`Match.status_rent = :status_rent AND Match.status_match = :status AND Match.id_match NOT IN (${SelectUserMatch})`, {status_rent: "Available",status:"Enable"}).getRawMany();
    res.json(GetRentMatch)
};

const GetAllMatching = async (req: Request, res: Response, next: NextFunction) => {
    const AllMatching = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets').getRawMany();
    res.json(AllMatching)
};


export default {MatchingAsset,GetRentMatch,GetAllMatching};