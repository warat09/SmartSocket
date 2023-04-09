import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { User_match } from '../entity/Usermatch';
import {Match} from '../entity/Match'
import {Assets} from '../entity/Asset'
import { User } from '../entity/User';
import {Node_Transaction} from '../entity/Transaction';

const AddUsermatch = async (req: Request, res: Response, next: NextFunction) => {
    let {id_match,room,floor,description} = req.body;
    let {name, surname, email, role, departure} = req["userData"];
    const Userdata = await AppDataSource.getRepository(User).find({
        where: {
            name: name,
            surname: surname,
            email:email,
            role:role,
            departure:departure
        },
    });
    if(Object.values(Userdata).length > 0){
        let id_user:any = Userdata[0].id_user;
        const usermatch = new User_match()
        usermatch.id_user = id_user;
        usermatch.id_match = id_match;
        usermatch.room = room;
        usermatch.floor = floor;
        usermatch.description = description;
        usermatch.status_user_match = "Wait for Approve";
        usermatch.datetime = new Date(new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' }));
        const AddUsermatch = AppDataSource.getRepository(User_match).create(usermatch)
        const results = await AppDataSource.getRepository(User_match).save(AddUsermatch)
        return res.status(200).json({status:1,data:results,message: "Insert Success"});
    }
    else{
        return res.status(404).json({status:0,message: "This User Not Found"});
    }
}
const GetRequestRent =async(req:Request, res:Response, next:NextFunction)=>{
    let {name, surname, email, role, departure} = req["userData"];
    const Userdata = await AppDataSource.getRepository(User).find({
        where: {
            name: name,
            surname: surname,
            email:email,
            role:role,
            departure:departure,
            status_user:"Active"
        },
    });
    if(Object.values(Userdata).length > 0){
        console.log(Object.values(Userdata).length)
        const RequestRent = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch')
            .innerJoinAndSelect(Match, 'Match', 'UserMatch.id_match = Match.id_match')
            .innerJoinAndSelect(Assets, 'Asset', 'Match.id_assets = Asset.id_assets')
            .where(`UserMatch.id_user = :id_user`, {id_user: Userdata[0].id_user})
            .getRawMany();
            // const cleandata = []
            // RequestRent.map(async(v,i)=>{
            //     const TotalSum = await AppDataSource.getRepository(Node_Transaction).createQueryBuilder('Transaction').select('SUM(Transaction.time_used) AS totaltime')
            //     .where(`Transaction.id_user_match  = :id_user_match`, {id_user_match: 1}).getRawMany();
            //     const obj = {
            //         Total:TotalSum
            //     }
            //     cleandata.push(obj)
            // })
            // console.log(cleandata)
            return res.status(200).json(RequestRent);
    }
    else{
        return res.status(404).json({status:0,message: "This User Not Found"});
    }
}
const GetApprove =async(req:Request, res:Response, next:NextFunction)=>{
    const RequestRent = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch')
            .innerJoinAndSelect(Match, 'Match', 'UserMatch.id_match = Match.id_match')
            .innerJoinAndSelect(User, 'User', 'User.id_user = UserMatch.id_user')
            .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets')
            .where(`UserMatch.status_user_match = :status`, {status: "Wait for Approve"}).getRawMany();   
            console.log("checkApprove:",RequestRent)    
            return res.status(200).json(RequestRent);
}
const GetAllUsermatch = async(req:Request,  res: Response, next: NextFunction) => {
    const AllUser = await AppDataSource.getRepository(User_match).find({
        relations: {
            id_user : true,
            id_match:true
        }
    })
    console.log(AllUser)
    return res.status(200).json({status:1,data: AllUser});
}

const UpdateStatusApprove = async(req:Request,  res: Response, next: NextFunction) => {
    // const RequestRent = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch')
    // .innerJoinAndSelect(Match, 'Match', 'UserMatch.id_match = Match.id_match')
    // .innerJoinAndSelect(User, 'User', 'User.id_user = UserMatch.id_user')
    // .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets')
    // .where(`UserMatch.status_user_match = :status`, {status: "Wait for Approve"}).getRawMany();
    // const array=Object.values(RequestRent)
        const id=Number(req.params.id)
        const status_approve=req.body.UserMatch_status_user_match
        const CheckUserMatch = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch')
        .where(`UserMatch.id_user_match = ${id}`).andWhere(`UserMatch.status_user_match = :status`,{status:"Wait for Approve"}).getRawOne();
        if(Object.values(CheckUserMatch).length !== 0){
            console.log(CheckUserMatch.UserMatch_id_match)
            // AppDataSource.getRepository(User_match).merge(CheckUserMatch, user_match )
            // const results = await AppDataSource.getRepository(User_match).save(CheckUserMatch)
            const UpdateStatusUserMatch = await AppDataSource
            .createQueryBuilder()
            .update(User_match)
            .set({
                status_user_match: status_approve
            })
            .where("id_user_match = :id", { id: CheckUserMatch.UserMatch_id_user_match }).execute()
            if(UpdateStatusUserMatch){
                const CheckIdMatch = await AppDataSource.getRepository(Match).findOne({
                    where: {
                        id_match: CheckUserMatch.UserMatch_id_match
                    },
                })
                if(Object.values(CheckIdMatch).length !== 0){
                    if(status_approve === "Approve"){
                        const match=new Match();
                        match.status_rent = "Rent";
                        AppDataSource.getRepository(Match).merge(CheckIdMatch, match )
                        await AppDataSource.getRepository(Match).save(CheckIdMatch)
                    }
                    return res.status(200).json({status:1,message:`${status_approve} Success`});
                }
            }
        }

}

const UpdateUsermatch = async(req:Request,  res: Response, next: NextFunction) => {
    let {room,floor,description} = req.body;
    await AppDataSource
    .createQueryBuilder()
    .update(User_match)
    .set({
        room : room,
        floor : floor,
        description : description,
    })
    .where("id_user_match = :id", { id: req.params.id }).execute()
    return res.status(200).json({status:1,message: "Update Success"});        
}

const ReturnAssets = async(req:Request,res: Response, next: NextFunction) => {
    await AppDataSource
    .createQueryBuilder()
    .update(Match)
    .set({
        status_rent : "Available"
    })
    .where("id_match = :id", { id: req.body.id_match }).execute().finally(async()=>{
        AppDataSource
        .createQueryBuilder()
        .update(User_match)
        .set({
            status_user_match : "Return"
        })
        .where("id_user_match = :id", { id: req.params.id }).execute()
    })
    return res.status(200).json({status:1,message:"Return Asset Success"})
}

export default {AddUsermatch,GetAllUsermatch,GetRequestRent,GetApprove,UpdateStatusApprove,UpdateUsermatch,ReturnAssets};