import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, Checktoken } from "../../services/apiservice";
import { Dashboards } from "../../model/model";
import UserMatch from "../user_match/index"
import Dashboard from "../dashboard/dashboard";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [role,setrole] = useState<string>("")

  // useEffect(() => {
  //   const item = localStorage.getItem("User");
  //   if (item && item !== "undefined") {
  //     const user = JSON.parse(item);
  //     Checktoken(user.token).then((response) => {
  //       if (response.status === "ok") {
  //         setrole(response.data[0].role)
  //       } else {
  //         localStorage.clear();
  //       }
  //     });
  //   } else {
  //     navigate("/login");
  //   }
  // }, []);

  return (
    <>
      {role === "admin" && <Dashboard/>}
      {role === "user" && <UserMatch/>}
    </>
  );
};
export default Home;
