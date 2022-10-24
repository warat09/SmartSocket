import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';

const SendTransection = async (req: Request, res: Response, next: NextFunction) => {
    let {Address,Status} = req.body;
    let CheckMatchingRent = `SELECT id_match,id_assets FROM matching WHERE mac_address = "${Address}" AND status = "rent"`;
    console.log(Address,Status)
    const date = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' });
    Connect()
        .then(async(connection) => {
            await Query(connection, CheckMatchingRent )
            .then(async(results)=>{
                const result:any = JSON.parse(JSON.stringify(results));
                if(Object.values(result).length > 0){
                    let AddTransection = `INSERT INTO node_transaction(mac_address,id_assets,status_action) VALUES ("${Address}","${result[0].id_assets}","${Status}") `;
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

const SendTest =async (req: Request, res: Response, next: NextFunction)=>{
    console.log(req.body)
}



export default {SendTransection,SendTest};