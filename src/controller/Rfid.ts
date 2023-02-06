import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import {Rfid} from "../entity/Rfid"

const AddAddressRfid = async (req: Request, res: Response, next: NextFunction) => {
    let {RfidAddress} = req.body
    // var new_txt = RfidAddress.replace(/ |_/g, ':');
    console.log(RfidAddress)
    let Date_rfid = new Date(new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' }));
    const rfid = new Rfid()
    rfid.rfid_address = RfidAddress
    rfid.date_rfid = Date_rfid;
    rfid.status_rfid = "Enable"

    const CheckRfidAddress = await AppDataSource.getRepository(Rfid).findOneBy({
        rfid_address: RfidAddress,
    })
    if(CheckRfidAddress === null){
        const AddRfidAddress = AppDataSource.getRepository(Rfid).create(rfid)
        const results = await AppDataSource.getRepository(Rfid).save(AddRfidAddress)
        return res.status(200).json({status:1,data:results,message: `Insert Rfid ${RfidAddress} Success`});
    }
    else{
        return res.status(200).json({status:1,message: `Have Rfid ${RfidAddress}`});
    }
};

export default {AddAddressRfid};