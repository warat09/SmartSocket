import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { User } from '../entity/User';
import  config from "../config/config";
import jwt from "jsonwebtoken";
import bycript from 'bcrypt'

const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    let {username,password} = req.body;
    const CheckUser = await AppDataSource.getRepository(User).find({
        where: {
            username: username,
            status_user:'Active'
        },
      });
      if(Object.values(CheckUser).length === 0){
        return res.status(401).json({status:'error',message: "Login Failed"});
      }
      else{
        bycript.compare(password,CheckUser[0].password).then((result) => {
            if (result) {
                const token = jwt.sign(
                    { 
                        id:CheckUser[0].id_user,
                        username: username
                    },
                    config.token,
                    { expiresIn: "30d" }
                );
                return res.status(200).json({status:'ok',token:token,message: "Login Success"});
            //   res.json({ message: "Login Success!!", Token: token });
            } else {
                return res.status(403).json({status:'error',message: "Password not correct" });
            }
          });
        // const sendtoken = jwt.sign(
        //     {
        //       username: username,
        //       email: password,
        //     },
        //     config.token,
        //     {
        //       expiresIn: "5m",
        //     }
        //   );
      }
}
const CheckToken = async (req: Request, res: Response, next: NextFunction) => {
    let {token} = req.body;
    console.log(token)
    jwt.verify(token, config.token,async (err: any, user: any)=>{
        if (err) {
            console.log("err");     
            return res.status(401).json({status:'error',message: "Token expired"});
        }
        else{
            console.log("noterr");
            return res.status(200).json({status:'ok',message: "Token not expired"});
        }
    });
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
    res.json(AllUser)
}


export default {AddUser,GetAllUser,LoginUser,CheckToken};