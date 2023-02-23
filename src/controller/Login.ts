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
export default { LoginUser };