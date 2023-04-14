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
            .where(`UserMa  tch.id_user = :id_user`, {id_user: Userdata[0].id_user})
            .getRawMany();
        const SumTransaction = await AppDataSource.getRepository(Node_Transaction).createQueryBuilder('Transaction')
            .select('Transaction.id_user_match')
            .addSelect('SUM(Transaction.time_used)','TotalTime')
            .innerJoinAndSelect(User_match,'UserMatch','UserMatch.id_user_match = Transaction.id_user_match')
            .groupBy('Transaction.id_user_match').getRawMany();
        console.log("RRRRRRRRRRRRRRRRR",RequestRent)
        console.log("ssssssssssssssssssss",SumTransaction)
            const cleandata = []
            RequestRent.map((v,i)=>{
                let obj = {}
                const findobj = SumTransaction.find(o => o.Transaction_id_user_match === v.UserMatch_id_user_match)
                if(findobj === undefined){
                    obj = {
                        UserMatch_id_user_match : v.UserMatch_id_user_match,
                        Asset_name_assets : v.Asset_name_assets,
                        UserMatch_room: v.UserMatch_room ,
                        UserMatch_floor: v.UserMatch_floor, 
                        UserMatch_description:v.UserMatch_description, 
                        UserMatch_datetime: v.UserMatch_datetime, 
                        UserMatch_status_user_match: v.UserMatch_status_user_match,
                        Match_id_match: v.Match_id_match,
                        Asset_expire_hour:v.Asset_expire_hour,
                        TotalTime:0
                    }
                }
                else{
                    obj = {
                        UserMatch_id_user_match : v.UserMatch_id_user_match,
                        Asset_name_assets : v.Asset_name_assets,
                        UserMatch_room: v.UserMatch_room ,
                        UserMatch_floor: v.UserMatch_floor, 
                        UserMatch_description:v.UserMatch_description, 
                        UserMatch_datetime: v.UserMatch_datetime, 
                        UserMatch_status_user_match: v.UserMatch_status_user_match,
                        Match_id_match: v.Match_id_match,
                        Asset_expire_hour:v.Asset_expire_hour,
                        Totaltime:findobj.TotalTime
                    }
                }
            cleandata.push(obj)    
            })
            return res.status(200).json(cleandata);
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
            .where(`UserMatch.status_user_match = :status OR UserMatch.status_user_match = :status_rent`, {status: "Wait for Approve",status_rent:"Wait for Approve Return"}).getRawMany();   
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