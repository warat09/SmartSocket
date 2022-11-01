import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import {Node} from "../entity/Node"

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

const GetAllMacAddress = async (req: Request, res: Response, next: NextFunction) => {
    const AllMacAddress = await AppDataSource.getRepository(Node).find()
    res.json(AllMacAddress)
}

export default {AddMACAddress,GetAllMacAddress};