import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, Checktoken } from "../../services/apiservice";
import { Dashboards } from "../../model/model";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Container
} from "@mui/material";

const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [ConDashboard, SetDashboard] = useState<Dashboards[]>([]);
  const [role,setrole] = useState<string>("")
  const ComponentDashboard = async (token: string) => {
    SetDashboard(await getDashboard(token));
    console.log(await getDashboard(token));
  };

  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      Checktoken(user.token).then((response) => {
        if (response.status === "ok") {
          setrole(response.data[0].role)
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
    <Container>
      <br />
      <h1>Dashboard</h1>
      <hr />
      <br></br>
      <div>
        <Grid container spacing={2}>
        {ConDashboard.map((row: any, i: any) => (
            <Grid item xs={4}>
              <Card>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {row.topic}
                    </Typography>
                    <Typography variant="h4" color="text.secondary">
                      {row.amount}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            ))}
        </Grid>
      </div>
    </Container>
  );
};
export default HomeDashboard;
