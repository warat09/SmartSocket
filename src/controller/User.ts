import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from "../data-source"
import { User } from '../entity/User';
import bycript from 'bcrypt'

const CheckToken = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({status:'ok',data:req["userData"]});
}
const AddUser = async (req: Request, res: Response, next: NextFunction) => {
    let {name,surname,password,email,role,departure,id_card} = req.body;
    bycript.hash(password,10,async(error:any,hashpassword:string)=>{
        if(error){
            res.status(500).json({status:'error',message: "Getting error during the connection"})
            return;
        }
        else{
            const user = new User();
            user.name = name;
            user.surname = surname;
            user.password = hashpassword;
            user.email = email;
            user.id_card = id_card;
            user.role = role;
            user.departure = departure;
            user.status_user = 'Active';
            const CheckUser = await AppDataSource.getRepository(User).find({
                where: [
                    { id_card: id_card },
                    { email: email }
                ]
              });
            if(Object.values(CheckUser).length === 0){
                const AddUser = AppDataSource.getRepository(User).create(user)
                const results = await AppDataSource.getRepository(User).save(AddUser)
                return res.status(200).json({status:1,data:results,message: "Insert Success"});
            }
            else{
                return res.status(200).json({status:1,message: "Have user"});
            }
        }
    })
}
const UpdateUser = async(req:Request,  res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const  {name,surname,email,role,departure,id_card} = req.body;
    const Checkpk = await AppDataSource.getRepository(User).createQueryBuilder('User')
    .where(`User.id_user != ${id} AND (User.email = :email OR User.id_card = :id_card) AND User.status_user = :status`, {email:email,id_card:id_card,status:"Active"}).getRawMany();
    console.log(Checkpk)
    if(Object.values(Checkpk).length === 0){
        const CheckUser = await AppDataSource.getRepository(User).find({
            where: {
                id_user: id,
                status_user:'Active'
            },
        });
        if(Object.values(CheckUser).length !== 0){
            await AppDataSource
                .createQueryBuilder()
                .update(User)
                .set({
                    name : name,
                    surname : surname,
                    email : email,
                    id_card : id_card,
                    role : role,
                    departure : departure
                })
                .where("id_user = :id", { id: id }).execute()
                return res.status(200).json({status:1,message: "Update Success"});
        }
        else{
            return res.status(404).json({status:0,message: "User not found"});
        }
        
    }else{
        return res.status(200).json({status:0,message: "email or id card already exists"});
    }    
}
const UpdateStatusUser = async(req:Request,  res: Response, next: NextFunction) => {
    const id = Number(req.params.id)
    const CheckUser = await AppDataSource.getRepository(User).find({
        where: {
            id_user: id,
            status_user:'Active'
        },
      });
    if(Object.values(CheckUser).length !== 0){
        await AppDataSource
            .createQueryBuilder()
            .update(User)
            .set({
                status_user : "Deactive"
            })
            .where("id_user = :id", { id: id }).execute()
            return res.status(200).json({status:1,message: "Delete Success"});
    }
}
const GetAllUser = async(req:Request,  res: Response, next: NextFunction) => {
    const AllUser = await AppDataSource.getRepository(User).find({
        where:[
            {status_user : "Active"}
        ]
    })
    const FilterUser = []
    for(let i = 0; i < AllUser.length;i++){
        const UserData = AllUser[i]
        const attribute = {
            id_user:UserData.id_user,
            fullname:UserData.name+" "+UserData.surname,
            email:UserData.email,
            id_card:UserData.id_card,
            role:UserData.role,
            departure:UserData.departure,
            status_user:UserData.status_user
        }
        FilterUser.push(attribute);
    }
    return res.status(200).json(FilterUser)
}

const GetAllUserbyId = async(req:Request,  res: Response, next: NextFunction) => {
    const id:number = Number(req.params.id)
    const AllUser = await AppDataSource.getRepository(User).find({
        where: [
            { id_user: id }
        ]
    })
    return res.status(200).json(AllUser);
}

export default {AddUser,GetAllUser,GetAllUserbyId,UpdateUser,UpdateStatusUser,CheckToken};