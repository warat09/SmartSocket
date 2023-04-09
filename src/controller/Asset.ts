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

    const CheckNameAsset = await AppDataSource.getRepository(Assets).find({
        where:{
            name_assets: name_assets,
            status_assets: "Active"
        }
    })
    if(Object.values(CheckNameAsset).length > 0){
        return res.status(200).json({status:1,data:CheckNameAsset,message: "This Asset Name already exists"});
    }else{
        const AddAsset = AppDataSource.getRepository(Assets).create(assets)
        const results = await AppDataSource.getRepository(Assets).save(AddAsset)
        return res.status(200).json({status:1,data:results,message: "Insert Asset Success"});
    }

    
};
const GetMatchAsset = async(req:Request,  res: Response, next: NextFunction) => {
    const SelectMatch = AppDataSource.getRepository(Match).createQueryBuilder('Match').select('id_assets').where(`Match.status_match = "Enable"`).getQuery();
    const SelectIdAsset = await AppDataSource.getRepository(Assets).createQueryBuilder('Assets').where(`Assets.status_assets = "Active" AND Assets.id_assets NOT IN (${SelectMatch})`).getRawMany();
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

const UpdateStatusAsset = async(req:Request,  res: Response, next: NextFunction) => {
    const CheckMatchAssets =  await AppDataSource.getRepository(Match).createQueryBuilder(`Match`)
    .where(`Match.id_assets = :id_assets AND Match.status_match = :status`,{id_assets:req.params.id,status:"Enable"}).getRawMany();
    console.log(CheckMatchAssets)
    if(Object.values(CheckMatchAssets).length > 0){
        return res.status(200).json({status:1,message: "Can't Delete this Asset has matching"});
    }
    await AppDataSource
    .createQueryBuilder()
    .update(Assets)
    .set({
        status_assets : "Deactive"
    })
    .where("id_assets = :id", { id: req.params.id }).execute()
    return res.status(200).json({status:1,message: "Delete Success"});
}

const GetAllAsset = async(req:Request,  res: Response, next: NextFunction) => {
    const cleandata = [];
    const AllAssets = await AppDataSource.getRepository(Assets).find({
        relations: {
            rfid_address:true
        },
        where:{
            status_assets:"Active"
        }
    })
    AllAssets.map((value)=>{
        const obj = {
            id_assets:value.id_assets,
            name_assets:value.name_assets,
            expire_hour:value.expire_hour,
            status_assets:value.status_assets,
            maintenance:value.maintenance,
            date_assets:value.date_assets,
            rfid_address:value.rfid_address.rfid_address
        }
        cleandata.push(obj)
    })
    res.json(cleandata)
};

export default {AddAsset,GetAllAsset,GetMatchAsset,UpdateAsset, UpdateStatusAsset};