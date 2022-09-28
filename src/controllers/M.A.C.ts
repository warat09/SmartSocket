import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';
import IMac from '../models/MAC'

const AddMACAddress = async (req: Request, res: Response, next: NextFunction) => {
    let {Address} = req.body
    console.log(Address)
    res.status(200).json({status: "Ok"});

    // let query = `INSERT INTO books (author, title) VALUES ("${author}", "${title}")`;

    // Connect()
    //     .then((connection) => {
    //         Query(connection, query)
    //     });
};


export default {AddMACAddress};