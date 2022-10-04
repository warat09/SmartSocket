import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';

const AddMACAddress = async (req: Request, res: Response, next: NextFunction) => {
    let {Address,LocalIP,time} = req.body
    console.log(req.body)
    let CheckMacAddress = `SELECT mac_address FROM nodes WHERE mac_address = "${Address}"`;
    let AddMacAddress = `INSERT INTO nodes (mac_address,ip_protocol) VALUES ("${Address}","${LocalIP}") `;
    let UpdateMacAddress = `UPDATE nodes SET ip_protocol= "${LocalIP}" WHERE mac_address = "${Address}";`
    Connect()
        .then((connection) => {
            Query(connection, CheckMacAddress)
            .then((results)=>{
                const result:any = Object.values(JSON.parse(JSON.stringify(results)));
                if(result.length === 0){
                    Query(connection,AddMacAddress)
                    .then(()=>{
                        res.status(200).json({status:1,message: "Insert Success"});
                    })
                }
                else{
                    Query(connection,UpdateMacAddress)
                    .then(()=>{
                        res.status(200).json({status:1,message: "Update Success"});
                    })
                }
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
        });
};

const getAllMacaddress= async (req: Request, res: Response, next: NextFunction) => {

    let query = `SELECT * FROM nodes`;

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
};


export default {AddMACAddress,getAllMacaddress};