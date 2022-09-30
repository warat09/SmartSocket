import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';
import IMac from '../models/MAC'

const AddMACAddress = async (req: Request, res: Response, next: NextFunction) => {
    let {Address} = req.body
    console.log(Address)
    res.status(200).json({status: "Ok"});

    let query = `INSERT INTO macaddress (MAC_ADDRESS) VALUES ("${Address}")`;

    Connect()
        .then((connection) => {
            Query(connection, query)
            .then((result)=>{
                return res.status(200).json({
                    result
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
        });
};


export default {AddMACAddress};