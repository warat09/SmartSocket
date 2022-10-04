import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';

const MatchingAsset = async (req: Request, res: Response, next: NextFunction) => {
    let {Address,id_assets,Floor,Room,Status} = req.body
    console.log(req.body)
    let CheckMatching = `SELECT mac_address FROM matching WHERE mac_address = "${Address}" `;
    let AddMatching = `INSERT INTO matching(mac_address,id_assets,floor,room,status) VALUES ("${Address}","${id_assets}","${Floor}","${Room}","${Status}") `;
    Connect()
        .then((connection) => {
            Query(connection, CheckMatching )
            .then((results)=>{
                const result:any = Object.values(JSON.parse(JSON.stringify(results)));
                if(result.length === 0){
                    Query(connection,AddMatching)
                    .then(()=>{
                        res.status(200).json({status:1,message: "Insert Success"});
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


const getAllMatching= async (req: Request, res: Response, next: NextFunction) => {

    let query = `SELECT * FROM matching`;

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

export default {MatchingAsset,getAllMatching};