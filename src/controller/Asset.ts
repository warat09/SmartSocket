import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { Assets } from '../entity/Asset';
import { Match } from '../entity/Match';
const AddAsset = async (req: Request, res: Response, next: NextFunction) => {
    let {name_assets , rfid_address , expire_hour} = req.body
    console.log(name_assets , rfid_address , expire_hour)
    let Date_assets = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' });
   
    const assets = new Assets()
    assets.name_assets = name_assets;
    assets.rfid_address = rfid_address;
    assets.date_assets = new Date(Date_assets);
    assets.expire_hour = expire_hour;
    assets.maintenance = false;
    assets.status_assets = "Active";

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
const GetMatchAsset = async(req:Request,  res: Response, next: NextFunction) => {
    const SelectMatch = AppDataSource.getRepository(Match).createQueryBuilder('Match').select('id_assets').getQuery();
    const SelectIdAsset = await AppDataSource.getRepository(Assets).createQueryBuilder('Assets').where(`Assets.id_assets NOT IN (${SelectMatch})`).getRawMany();
    res.json(SelectIdAsset)
}
const UpdateAsset = async(req:Request,  res: Response, next: NextFunction) => {
    const  {asset_name,rfid_address,expire_hour} = req.body;
    const CheckAssets = await AppDataSource.getRepository(Assets).createQueryBuilder('Assets')
    .where(` Assets.rfid_address != :oldrfid AND (Assets.name_assets = :assets OR Assets.rfid_address  = :rfid)`, {assets:asset_name,rfid:rfid_address,oldrfid:req.params.id}).getRawMany();
    if(Object.values(CheckAssets).length === 0){
        await AppDataSource
            .createQueryBuilder()
            .update(Assets)
            .set({
                name_assets : asset_name,
                expire_hour : Number(expire_hour),
                rfid_address : rfid_address,
            })
            .where("rfid_address = :id", { id: req.params.id }).execute()
            return res.status(200).json({status:1,message: "Update Success"});
    }
    else{
        console.log("Assets Name or Rfid already exists")
        return res.status(200).json({status:0,message: "Assets Name or Rfid already exists"});
    }
    
}
const GetAllAsset = async(req:Request,  res: Response, next: NextFunction) => {
    const AllAssets = await AppDataSource.getRepository(Assets).find({
        relations: {
            rfid_address:true
        }
    })
    res.json(AllAssets)
};

export default {AddAsset,GetAllAsset,GetMatchAsset,UpdateAsset};