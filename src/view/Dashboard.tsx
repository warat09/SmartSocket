import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, Checktoken } from "./../services/apiservice";
import { Dashboards } from "../model/model";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [ConDashboard, SetDashboard] = useState<Dashboards[]>([]);
  const ComponentDashboard = async (token: string) => {
    SetDashboard(await getDashboard(token));
    console.log(await getDashboard(token));
  };

  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      Checktoken(user.token).then((status) => {
        if (status === true) {
          ComponentDashboard(user.token);
        } else {
          localStorage.clear();
        }
      });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <br></br>
      <div>
        {/* <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Assets
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ConDashboard[0].asset}
                  </Typography>
              </CardContent>
            </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Node
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {ConDashboard[0].node}
                </Typography>
              </CardContent>
            </CardActionArea>
        </Card>
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  User
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {ConDashboard[0].user}
                </Typography>
              </CardContent>
            </CardActionArea>
        </Card> */}
      </div>
    </div>
  );
};
export default Dashboard;
