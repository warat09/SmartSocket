import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';

const SendTransection = async (req: Request, res: Response, next: NextFunction) => {
    let {Address,Status} = req.body;
    let CheckMatchingRent = `SELECT id_matching FROM matching WHERE mac_address = "${Address}" AND status = "rent"`;
    console.log(Address,Status)
    const date = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' });
    Connect()
        .then(async(connection) => {
            await Query(connection, CheckMatchingRent )
            .then(async(results)=>{
                const result:any = JSON.parse(JSON.stringify(results));
                if(Object.values(result).length > 0){
                    let AddTransection = `INSERT INTO transection(id_matching,status,date_time) VALUES ("${result[0].id_matching}","${Status}","${date}") `;
                    await Query(connection,AddTransection)
                    .then(async()=>{
                        res.status(200).json({status:1,message: "Insert Success"});
                    })
                }
                else{
                    res.status(200).json({status:1,message: `Have ${Address}`});
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



export default {SendTransection};