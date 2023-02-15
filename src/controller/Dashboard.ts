import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { Assets } from '../entity/Asset';
import { Node } from '../entity/Node'
import { Match } from '../entity/Match'
import { User_match } from '../entity/Usermatch'
import { User } from '../entity/User';

const GetAllDashboard = async (req: Request, res: Response, next: NextFunction) => {
    const countasset = await AppDataSource.getRepository(Assets).createQueryBuilder('Asset').getCount();
    const countnode = await AppDataSource.getRepository(Node).createQueryBuilder('Node').getCount();
    const countmatch = await AppDataSource.getRepository(Match).createQueryBuilder('Match').getCount();
    const countmatchapprove = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').where('UserMatch.status_user_match = :status',{status:'Wait for Approve'}).getCount();
    const countmatchrent = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').where('UserMatch.status_user_match = :status',{status:'Rent'}).getCount();
    const countmatchnotrent = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').where('UserMatch.status_user_match = :status',{status:'Available'}).getCount();
    // const countmaintenance = await AppDataSource.getRepository(User_match).createQueryBuilder('UserMatch').where('UserMatch.status = notrent').getCount();
    const countuser = await AppDataSource.getRepository(User).createQueryBuilder('User').getCount();
    const topic = ["Assets","nodes","matching","Wait for approve","rent","not_rent","people"]
    const amount = [countasset,countnode,countmatch,countmatchapprove,countmatchrent,countmatchnotrent,countuser]
    const array = []
    topic.map((v:any,i:any)=>{
        const attribute = {
            topic:v,
            amount:amount[i]
        }
        array.push(attribute)
    })
    
    return res.status(200).json(array)
}


export default {GetAllDashboard};