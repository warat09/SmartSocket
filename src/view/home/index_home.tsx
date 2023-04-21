import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, Checktoken } from "../../services/apiservice";
import { Dashboards } from "../../model/model";
import UserMatch from "../user_match/index"
import Dashboard from "../dashboard/dashboard";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [role,setrole] = useState<string>("")

  useEffect(()=>{
    const item = localStorage.getItem("User");
    if(item && item !== "undefined"){
      const user = JSON.parse(item);
      Checktoken("/User/CheckToken",user.token).then((response) => {
        if(response.data.role === "admin"){
          navigate("/SmartSocket/app/admin/dashboard")
        }
        else{
          navigate("/app/personnel")
        }
      })
    }
    else{
      navigate("/login");
    }
  })

  return (
    <>
    </>
  );
};
export default Home;
