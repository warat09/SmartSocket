import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import {Node} from "../entity/Node"
import { Match } from '../entity/Match';

const AddMACAddress = async (req: Request, res: Response, next: NextFunction) => {
    let {Address,LocalIP} = req.body
    let Date_node = new Date(new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' }));
    const node = new Node()
    node.mac_address = Address
    node.ip = LocalIP
    node.date_node = Date_node;
    node.status_node = "enable"

    const CheckMacAddress = await AppDataSource.getRepository(Node).findOneBy({
        mac_address: Address,
    })
    if(CheckMacAddress === null){
        const AddMacAddress = AppDataSource.getRepository(Node).create(node)
        const results = await AppDataSource.getRepository(Node).save(AddMacAddress)
        return res.status(200).json({status:1,data:results,message: "Insert Success"});
    }
    else{
        AppDataSource.getRepository(Node).merge(CheckMacAddress, node)
        const results = await AppDataSource.getRepository(Node).save(CheckMacAddress)
        return res.status(200).json({status:1,data:results,message: "Update Success"});
    }
};

const SelectMacAddressAsset = async (req: Request, res: Response, next: NextFunction) => {
    let {id_assets} = req.body
    if(id_assets !== ''){
        console.log(id_assets)
        const MatchAsset = await AppDataSource.getRepository(Match).createQueryBuilder()
        .select("mac_address").where(`id_assets = ${id_assets}`).getQuery();
    
        const AllMacAddress = await AppDataSource.getRepository(Node).createQueryBuilder()
        .where("mac_address NOT IN (" + MatchAsset+ ")");
        // .where("node.mac_address NOT IN (:...mac_address)", { mac_address: ["12:13:14:15"] })
        // .where("node.mac_address NOT IN (SELECT mac_address FROM `match` m WHERE m.id_assets = "+id_assets+")");
        const results = await AllMacAddress.getRawMany();
        res.json(results);
    }
}

const GetAllMacAddress = async (req: Request, res: Response, next: NextFunction) => {
    const AllMacAddress = await AppDataSource.getRepository(Node).find()
    res.json(AllMacAddress)
}

export default {AddMACAddress,GetAllMacAddress,SelectMacAddressAsset};