import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { User_match } from '../entity/Usermatch';

const AddUsermatch = async (req: Request, res: Response, next: NextFunction) => {
    let {id_user,id_match,room,floor,description,status,sum_used_time} = req.body;
    const usermatch = new User_match();
    usermatch.id_user = id_user;
    usermatch.id_match = id_match;
    usermatch.room = room;
    usermatch.floor = floor;
    usermatch.description = description;
    usermatch.status = status;
    usermatch.sum_used_time = sum_used_time;
    const CheckMatchingAsset = await AppDataSource.getRepository(User_match).find({
        relations: {
            id_user : true,
            id_match:true
        },
        where: {
            id_user: id_user,
            id_match: id_match,
        },
    });
    if(Object.values(CheckMatchingAsset).length === 0) {
        const AddUsermatch = AppDataSource.getRepository(User_match).create(usermatch)
        const results = await AppDataSource.getRepository(User_match).save(AddUsermatch)
        return res.status(200).json({status:1,data:results,message: "Insert Success"});
    }
    else{
        return res.status(200).json({status:1,message: "Have Usermatch"});
    }
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

export default {AddUsermatch,GetAllUsermatch};