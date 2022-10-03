import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';

const AddAsset = async (req: Request, res: Response, next: NextFunction) => {
    let {Name,Timelimit,TimeRemain,Maintainent} = req.body
    console.log(Name,Timelimit,TimeRemain,Maintainent)
    res.status(200).json({status:1,message: "Insert Success"});
};



export default {AddAsset};