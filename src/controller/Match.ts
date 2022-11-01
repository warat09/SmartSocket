import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import {Match} from "../entity/Match"

const MatchingAsset = async (req: Request, res: Response, next: NextFunction) => {
    let {Address,id_assets,status,remain_time,Room,floor} = req.body
    let Datetime = new Date(new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' }));
    const match = new Match()
    match.id_assets = id_assets;
    match.mac_address = Address;
    match.status = status;
    match.remain_time = remain_time;//ดึงasset expire_hour noapiinput
    match.active_datetime = Datetime;
    match.room = Room;
    match.floor = floor;

    const CheckMatch = await AppDataSource.getRepository(Match).find({
        where: {
            mac_address: Address,
            id_assets: id_assets,
        },
    });
    if(Object.values(CheckMatch).length === 0){
        const AddMatch = AppDataSource.getRepository(Match).create(match)
        const results = await AppDataSource.getRepository(Match).save(AddMatch)
        return res.status(200).json({status:1,data:results,message: "Insert Success"});
    }
    else{
        res.status(200).json({status:1,message: `Have ${Address}`});
    }
};

const GetAllMatching = async (req: Request, res: Response, next: NextFunction) => {
    const AllMatching = await AppDataSource.getRepository(Match).find({
        relations: {
            id_assets : true
        },
    })
    res.json(AllMatching)
};


export default {MatchingAsset,GetAllMatching};