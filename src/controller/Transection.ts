import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import {Match} from "../entity/Match"
import {Node_Transection} from "../entity/Transection"

const SendTransection = async (req: Request, res: Response, next: NextFunction) => {
    let {Address,Status} = req.body;
    const CheckMatchingRent = await AppDataSource.getRepository(Match).find({
        where: {
            mac_address: Address,
            status: "rent",
        },
    });
};


export default {SendTransection};