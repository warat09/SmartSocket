import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { Assets } from '../entity/Asset';
const AddAsset = async (req: Request, res: Response, next: NextFunction) => {
    let {name_assets,expire_hour} = req.body
    console.log(req.body)
    let Date_assets = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' });
    let HourtoMillisecond = (expire_hour * (60000 * 60));
   
    const assets = new Assets()
    assets.name_assets = name_assets;
    assets.date_assets = new Date(Date_assets);
    assets.expire_hour = new Date().getTime()+HourtoMillisecond;
    assets.maintenance = false;
    assets.status_assets = "active";

    const CheckNameAsset = await AppDataSource.getRepository(Assets).findOneBy({
        name_assets: name_assets,
    })
    if(CheckNameAsset === null){
        const AddAsset = AppDataSource.getRepository(Assets).create(assets)
        const results = await AppDataSource.getRepository(Assets).save(AddAsset)
        return res.status(200).json({status:1,data:results,message: "Insert Success"});
    }
    else{
        AppDataSource.getRepository(Assets).merge(CheckNameAsset, assets)
        const results = await AppDataSource.getRepository(Assets).save(CheckNameAsset)
        return res.status(200).json({status:1,data:results,message: "Update Success"});
    }
    
};
const GetAllAsset = async(req:Request,  res: Response, next: NextFunction) => {
    const AllAssets = await AppDataSource.getRepository(Assets).find()
    res.json(AllAssets)
};

export default {AddAsset,GetAllAsset};