import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';

const AddUser = async (req: Request, res: Response, next: NextFunction) => {
    let {name,surname,username,password,email,role,departure} = req.body;
    let CheckUsername = `SELECT username FROM users WHERE username = "${username}" OR email = "${email}"`;
    let AddUser = `INSERT INTO users (name,surname,username,password,email,role,departure,status_user) VALUES ("${name}","${surname}","${username}","${password}","${email}","${role}",${departure},"enable") `;
    console.log(req.body)
    // Connect()
    //     .then((connection) => {
    //         Query(connection, CheckUsername)
    //         .then((results)=>{
    //             const result:any = Object.values(JSON.parse(JSON.stringify(results)));
    //             if(result.length === 0){
    //                 Query(connection,AddMacAddress)
    //                 .then(()=>{
    //                     res.status(200).json({status:1,message: "Insert Success"});
    //                 })
    //             }
    //             else{
    //                 Query(connection,UpdateMacAddress)
    //                 .then(()=>{
    //                     res.status(200).json({status:1,message: "Update Success"});
    //                 })
    //             }
    //         })
    //         .catch((error) => {
    //             return res.status(200).json({
    //                 message: error.message,
    //                 error
    //             });
    //         })
    //         .finally(() => {
    //             connection.end();
    //         });
    //     });
}
const GetAllUser = async(req:Request,  res: Response, next: NextFunction) => {
    let query = `SELECT * FROM users`;

    Connect()
    .then((connection) => {
        Query(connection, query)
            .then((results:any) => {
                const result:any = Object.values(JSON.parse(JSON.stringify(results)));
                console.log(result.length)
                return res.status(200).json({
                    results
                });
            })
            .catch((error) => {
                return res.status(200).json({
                    message: error.message,
                    error
                });
            })
            .finally(() => {
                connection.end();
            });
    })
    .catch((error) => {
        return res.status(200).json({
            message: error.message,
            error
        });
    });
}


export default {AddUser,GetAllUser};