import { NextFunction, Request, Response } from 'express';
import  config from "../config/config";
import jwt from "jsonwebtoken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization'];
        const bearer = token.split(' ');
        const bearertoken = bearer[1]
        if(typeof bearertoken !== 'undefined'){
            jwt.verify(bearertoken, config.token,async (err: any, decoded: any)=>{
                if (err) {
                    console.log("err");     
                    return res.status(401).json({status:'error',message: "Token expired"});
                }
                else{
                    if(err){
                        return res.sendStatus(403) //invalid token
                    }
                    // req.roles = decoded.role
                    // req.role = 'tenant-X'

                    // req.userData = { name: decoded.name, surname: decoded.surname, email: decoded.email, role:decoded.role, departure:decoded.departure};
                    req["userData"] = { name: decoded.name, surname: decoded.surname, email: decoded.email, role:decoded.role, departure:decoded.departure }
                    // req["user"] = user;
                    next()
                }
            });
        }
        else{
            res.status(403);
        }
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}