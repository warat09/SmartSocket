import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import {Match} from "../entity/Match"
import {Node_Transaction} from "../entity/Transaction"
import { Assets } from '../entity/Asset';


const SendTransaction = async (req: Request, res: Response, next: NextFunction) => {
    let {Address,on_date,off_date,time_used,time_update} = req.body;
    const CheckMatchingRent = await AppDataSource.getRepository(Match).find({
        relations: {
            id_assets : true
        },
        where: {
            mac_address: Address,
            status_rent: "Rent",
        },
    });

   if(Object.values(CheckMatchingRent).length > 0){
        const Transaction = new Node_Transaction();
        Transaction.id_match = CheckMatchingRent[0].id_match;
        Transaction.time_used = time_used
        Transaction.time_used = time_update
        Transaction.on_date = on_date
        Transaction.off_date = off_date
        Transaction.status_transaction = 'Enable';
        
        const AddUser = AppDataSource.getRepository(Node_Transaction).create(Transaction)
        const results = await AppDataSource.getRepository(Node_Transaction).save(AddUser)
        return res.status(200).json({status:1,data:results,message: "Insert Success"});
    }
    else{
        return res.status(200).json({status:1,message: `Adress ${Address} not match`});
    }
};
const GetAllTransaction = async (req: Request, res: Response, next: NextFunction) => {
    const AllTransection = await AppDataSource.getRepository(Node_Transaction).createQueryBuilder('Transaction')
    .innerJoinAndSelect(Match, 'Match', 'Transaction.id_match = Match.id_match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets').getRawMany();
    console.log(AllTransection)
    return res.status(200).json(AllTransection)
};

export default {SendTransaction,GetAllTransaction};