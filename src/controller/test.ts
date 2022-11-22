import { NextFunction, Request, Response } from 'express';

const GetTest = async(req:Request,  res: Response, next: NextFunction) => {
    console.log(req["user"])
    return res.status(200).json({status:1,data: "yes"});
}

export default {GetTest};