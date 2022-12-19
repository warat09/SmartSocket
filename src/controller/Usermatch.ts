import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { User_match } from '../entity/Usermatch';
import {Match} from '../entity/Match'
import {Assets} from '../entity/Asset'
import { User } from '../entity/User';
import  config from "../config/config";
import jwt from "jsonwebtoken";



const AddUsermatch = async (req: Request, res: Response, next: NextFunction) => {
    let {token,id_match,room,floor,description} = req.body;
    const usermatch = new User_match()
    jwt.verify(token, config.token,async (err: any, user: any)=>{
        if (err) {
            console.log("err");     
            return res.status(401).json({status:'error',message: "Token expired"});
        }
        else{
            usermatch.id_user = user.id;
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
    });
}
const GetRequestRent =async(req:Request, res:Response, next:NextFunction)=>{
    const RequestRent = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch')
            .innerJoinAndSelect(Match, 'Match', 'UserMatch.id_match = Match.id_match')
            .innerJoinAndSelect(Assets, 'Asset', 'Match.id_assets = Asset.id_assets')
            .where(`UserMatch.id_user = :id_user`, {id_user: req["user"].id}).getRawMany();   
            console.log(RequestRent)  
            return res.status(200).json(RequestRent);
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
    return res.status(200).json({status:1,data: AllUser});
}

const UpdateStatusApprove = async(req:Request,  res: Response, next: NextFunction) => {
    const RequestRent = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch')
    .innerJoinAndSelect(Match, 'Match', 'UserMatch.id_match = Match.id_match')
    .innerJoinAndSelect(User, 'User', 'User.id_user = UserMatch.id_user')
    .innerJoinAndSelect(Assets, 'Asset', 'Asset.id_assets = Match.id_assets')
    .where(`UserMatch.status_user_match = :status`, {status: "Wait for Approve"}).getRawMany();
    const array=Object.values(RequestRent)
    const id=Number(req.params.id)
    // const id=req.params.id
    const data=req.body.UserMatch_status_user_match
    // console.log(typeof(id))
    const user_match=new User_match()
    user_match.status_user_match=data
        console.log("test1")
        const CheckUserMatch = await AppDataSource.getRepository(User_match).findOne({
            where: {
                id_user_match: id,

            },
        })
            AppDataSource.getRepository(User_match).merge(CheckUserMatch, user_match )
            const results = await AppDataSource.getRepository(User_match).save(CheckUserMatch)
            console.log("test2")
            return res.status(200).json({status:1,data:results,message: "Update Success"});


    // const test=array.find(r => r.UserMatch_id_user_match===id)
    // if(test){
    //     const entity = await AppDataSource.manager.findOne(Entity, id)
    //     // const results = await AppDataSource.getRepository(User_match).save(CheckMacAddress)
    //     // return res.status(200).json({status:1,data:results,message: "Update Success"});
    // }
    // if(RequestRent.find(r=>r.UserMatch_id_user_match === req.params.id)){
    //     console.log(true)
    // }
}

export default {AddUsermatch,GetAllUsermatch,GetRequestRent,GetApprove,UpdateStatusApprove};