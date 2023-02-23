import { NextFunction, Request, Response } from 'express';
interface UserResponse extends Request {
    userData?: object;
}
export const verifyRoles = (...allowedRoles:any) =>{
    return (req:UserResponse,res:Response,next:NextFunction) =>{
        // if(!req["role"]) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.userData);
        
        for (const [key, value] of Object.entries(req.userData)) {
            if(key === "role"){
                var result =rolesArray.includes(value) ;
            }
            // console.log(`${key}: ${value}`);
        }
        if(!result) return res.sendStatus(401)
        // const result = req["role"].map(role=> rolesArray.includes(role)).find(val=>val ===true);
        // const result = req.userData.map(role=> console.log(role))

        // if(!result) return res.sendStatus(401);
        next();
    }

}