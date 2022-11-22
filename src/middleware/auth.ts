import { NextFunction, Request, Response } from 'express';
import  config from "../config/config";
import jwt from "jsonwebtoken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization'];
        const bearer = token.split(' ');
        const bearertoken = bearer[1]
        if(typeof bearertoken !== 'undefined'){
            jwt.verify(bearertoken, config.token,async (err: any, user: any)=>{
                if (err) {
                    console.log("err");     
                    return res.status(401).json({status:'error',message: "Token expired"});
                }
                else{
                    req["user"] = user // ERROR: Property 'user' does not exist on type 'Request'
                    return next()
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