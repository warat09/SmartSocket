import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { User } from '../entity/User';

const AddUser = async (req: Request, res: Response, next: NextFunction) => {
    let {name,surname,username,password,email,role,departure,status} = req.body;
    const user = new User();
    user.name = name;
    user.surname = surname;
    user.username = username;
    user.password = password;
    user.email = email;
    user.role = role;
    user.departure = departure;
    user.status = status;

    const CheckUser = await AppDataSource.getRepository(User).find({
        where: [
            { username: username },
            { email: email }
        ]
      });
    if(Object.values(CheckUser).length === 0){
        const AddUser = AppDataSource.getRepository(User).create(user)
        const results = await AppDataSource.getRepository(User).save(AddUser)
        return res.status(200).json({status:1,data:results,message: "Insert Success"});
    }
    else{
        return res.status(200).json({status:1,message: "Have user"});
    }
    
    
}
const GetAllUser = async(req:Request,  res: Response, next: NextFunction) => {
    const AllUser = await AppDataSource.getRepository(User).find()
    res.json(AllUser)
}


export default {AddUser,GetAllUser};