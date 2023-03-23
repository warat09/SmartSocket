import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import {Match} from "../entity/Match"
import {Node_Transaction} from "../entity/Transaction"
import { User_match } from '../entity/Usermatch';
import { Assets } from '../entity/Asset';


const SendTransaction = async (req: Request, res: Response, next: NextFunction) => {
    let {Address,RfidAddress,on_date,off_date,time_used} = req.body;
    console.log(Address+"|"+RfidAddress+"|"+on_date+"|"+off_date+"|"+time_used)
    const CheckMatchingRent = await AppDataSource.getRepository(Match).createQueryBuilder('Match')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets')
    .where(`Asset.rfid_address = :rfid AND Match.mac_address = :address`, {rfid: RfidAddress,address:Address}).getRawMany();
    console.log(CheckMatchingRent[0].Match_id_match)

   if(Object.values(CheckMatchingRent).length > 0){
        const Transaction = new Node_Transaction();
        Transaction.id_match = CheckMatchingRent[0].Match_id_match;
        Transaction.time_used = time_used
        Transaction.on_date = on_date
        Transaction.off_date = off_date
        Transaction.status_transaction = 'Enable';
        
        const AddUser = AppDataSource.getRepository(Node_Transaction).create(Transaction)
        const results = await AppDataSource.getRepository(Node_Transaction).save(AddUser)
        if(results){
            const CheckUserMatchApprove = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch')
            .where(`UserMatch.id_match = ${CheckMatchingRent[0].Match_id_match}`).andWhere(`UserMatch.status_user_match = :status`,{status:"Approve"}).getRawOne();
            const UpdateTimeUserMatch = await AppDataSource
            .createQueryBuilder()
            .update(User_match)
            .set({
                sum_used_time: Number(CheckUserMatchApprove.UserMatch_sum_used_time)+Number(time_used)
            })
            .where("id_match = :id", { id: CheckMatchingRent[0].Match_id_match }).execute()
            if(UpdateTimeUserMatch){
                const UpdateTimeRemainMatch= AppDataSource
                .createQueryBuilder()
                .update(Match)
                .set({
                    remain_time: () => `remain_time - ${Number(time_used)}`
                })
                .where("id_match = :id", { id: CheckMatchingRent[0].Match_id_match }).execute()
                return res.status(200).json({status:1,data:UpdateTimeRemainMatch,message: "Insert Success"});
            }
        }
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