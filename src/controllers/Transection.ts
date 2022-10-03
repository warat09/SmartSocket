import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';

const SendTransection = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({status:1,message: "Insert Success"});
};



export default {SendTransection};