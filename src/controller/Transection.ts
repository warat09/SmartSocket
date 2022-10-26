import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import {Match} from "../entity/Match"
import {Node_Transection} from "../entity/Transection"

const SendTransection = async (req: Request, res: Response, next: NextFunction) => {
    let {Address,Status} = req.body;
    const CheckMatchingRent = await AppDataSource.getRepository(Match).find({
        relations: {
            id_assets : true
        },
        where: {
            mac_address: Address,
            status: "rent",
        },
    });
    if(Object.values(CheckMatchingRent).length > 0){
        const Transection = new Node_Transection();
        Transection.id_match = CheckMatchingRent[0].id_match;
        Transection.status_action = Status;
        // Transection.time_used
        // Transection.on_date
        // Transection.off_date
        // const AddUser = AppDataSource.getRepository(Node_Transection).create(Transection)
        // const results = await AppDataSource.getRepository(Node_Transection).save(AddUser)
        return res.status(200).json({status:1});
    }
};


export default {SendTransection};