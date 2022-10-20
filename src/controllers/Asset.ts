import { NextFunction, Request, Response } from 'express';
import { Connect, Query } from '../config/mysql';

const AddAsset = async (req: Request, res: Response, next: NextFunction) => {
    let {name_assets,expire_hour,remain_time} = req.body
    let Date_assets = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' });
    let CheckAssets = `SELECT name_assets FROM assets WHERE name_assets = "${name_assets}"`;
    let AddAssets = `INSERT INTO assets(name_assets,date_assets,expire_hour,remain_time,maitanent,status_assets) VALUES ("${name_assets}","${Date_assets}","${expire_hour}","${remain_time}","0","enable") `;
    Connect()
        .then((connection) => {
            Query(connection, CheckAssets)
            .then((results)=>{
                const result:any = Object.values(JSON.parse(JSON.stringify(results)));
                if(result.length === 0){
                    Query(connection,AddAssets)
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


const GetAllAsset = async (req: Request, res: Response, next: NextFunction) => {
    let query = `SELECT * FROM assets`;

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



export default {AddAsset,GetAllAsset};