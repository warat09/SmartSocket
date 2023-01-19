import { Helmet } from 'react-helmet-async';
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
  Container,
  Paper,
  Divider
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));
const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

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
    <>
      <Helmet>
        <title> Dashboard | SmartSocket </title>
      </Helmet>
      <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3,mt:2 }}>
          Dashboard
      </Typography>
      {/* <Grid container spacing={2}>
      {[lightTheme, darkTheme].map((theme, index) => (
        <Grid item xs={6} key={index}>
          <ThemeProvider theme={theme}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'red',
                display: 'grid',
                gridTemplateColumns: { md: '1fr 1fr' },
                gap: 2,
                borderRadius:'10px'
              }}
            >
              {[0, 1, 2, 3, 4, 6, 8, 12, 16, 24].map((elevation) => (
                <Item key={elevation} elevation={elevation}>
                  {`elevation=${elevation}`}
                </Item>
              ))}
            </Box>
          </ThemeProvider>
        </Grid>
      ))}
    </Grid> */}
      {/* {/* <Paper style={{ borderRadius: "10px" }}>
      <Typography variant="h6">This is my typography</Typography>

      </Paper> */}
      {/* <br /> */}
        <Divider sx={{borderBottomWidth: 3,mb:2,borderColor:"black",borderRadius:1}}/>
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
     </Container>
    </>
    
  );
};
export default HomeDashboard;
