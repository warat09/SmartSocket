import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {getDashboard,Checktoken} from "./../services/apiservice";
import { Dashboards } from "../model/model";



const Dashboard :React.FC = () =>{
    const navigate = useNavigate();
    const [ConDashboard,SetDashboard] = useState<Dashboards[]>([]);
    const ComponentDashboard= async (token:string) => {
      SetDashboard(await getDashboard(token))
      console.log(await getDashboard(token))
    }
    
    useEffect(() => {
        const item = localStorage.getItem("User");
          if (item && item !== "undefined") {
            const user = JSON.parse(item);
            Checktoken(user.token).then((status)=>{
              if(status === true){
                ComponentDashboard(user.token);
              }else{
                localStorage.clear()
              }
            })
          }
          else{
            navigate('/login')
          }
      }, []);
    return(
        <div>
            <h1>Dashboard</h1>
        </div>
    )
};
export default Dashboard
