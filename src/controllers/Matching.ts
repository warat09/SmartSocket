import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';

const MatchingAsset = async (req: Request, res: Response, next: NextFunction) => {
    let {Address,Name,Floor,Room,Status} = req.body
    console.log(Address,Name,Floor,Room,Status)
    res.status(200).json({status:1,message: "Insert Success"});
};



export default {MatchingAsset};