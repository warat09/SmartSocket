import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { User } from '../entity/User';
import  config from "../config/config";
import jwt from "jsonwebtoken";
import bycript from 'bcrypt'

interface UserResponse extends Request {
    userData?: object;
}

const CheckToken = async (req: UserResponse, res: Response, next: NextFunction) => {
    return res.status(200).json({status:'ok',data:req.userData});
    // console.log(token)
    // jwt.verify(token, config.token,async (err: any, user: any)=>{
    //     if (err) {
    //         console.log("err");     
    //         return res.status(401).json({status:'error',message: "Token expired"});
    //     }
    //     else{
    //         const CheckUser = await AppDataSource.getRepository(User).find({
    //             where: {
    //                 id_user: user.id,
    //                 status_user:'Active'
    //             },
    //           });
    //         return res.status(200).json({status:'ok',data:CheckUser,message: "Token not expired"});
    //     }
    // });
}
const AddUser = async (req: Request, res: Response, next: NextFunction) => {
    let {name,surname,username,password,email,role,departure,status} = req.body;
    bycript.hash(password,10,async(error:any,hashpassword:string)=>{
        if(error){
            res.status(500).json({status:'error',message: "Getting error during the connection"})
            return;
        }
        else{
            const user = new User();
            user.name = name;
            user.surname = surname;
            user.username = username;
            user.password = hashpassword;
            user.email = email;
            user.role = role;
            user.departure = departure;
            user.status_user = 'Active';
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
    })
}
const GetAllUser = async(req:Request,  res: Response, next: NextFunction) => {
    const AllUser = await AppDataSource.getRepository(User).find()
    const FilterUser = []
    for(let i = 0; i < AllUser.length;i++){
        const UserData = AllUser[i]
        const attribute = {
            id_user:UserData.id_user,
            fullname:UserData.name+" "+UserData.surname,
            username:UserData.username,
            email:UserData.email,
            role:UserData.role,
            departure:UserData.departure,
            status_user:UserData.status_user
        }
        FilterUser.push(attribute);
    }
    return res.status(200).json(FilterUser)
}


export default {AddUser,GetAllUser,CheckToken};