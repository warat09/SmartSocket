import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {login,Checktoken} from "../../services/apiservice";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';

import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { UsersProps} from "../interfaces/User";

function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {/* {'Copyright © '} */}
        <Link color="inherit" href="https://mui.com/">
          {/* Your Website */}
        </Link>
        {/* {' '}
        {new Date().getFullYear()} */}
        {/* {'.'} */}
      </Typography>
    );
  }
const HomeLogin :React.FC = () =>{
    const theme = createTheme();
    const navigate = useNavigate();
    const [load,setLoad] = useState(false)
    const [inputs,setInputs] = useState({
        username:"",
        password:""
    });
    const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInputs(values => ({...values,[name]:value}))
    }

    const handleSubmit = async(event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoad(true)
        const target = event.target as typeof event.target & {
            username: { value: string };
            password: { value: string };
          };
          const username = target.username.value; // typechecks!
          const password = target.password.value; // typechecks!
          setTimeout(async()=>{
            const LoginStatus = await login("/Login",username,password);
            console.log(LoginStatus)
            if(LoginStatus.message === "Login Success"){
              const GetUser = await Checktoken("/User/CheckToken",LoginStatus.token);
              if(GetUser.status === "ok"){
                if(GetUser.data.role === "admin"){
                  navigate("/app/admin/dashboard")
                }
                else{
                  navigate("/app/personnel/borrow")
                }
              }

            }
            // if(LoginStatus.status === "error"){
            //   alert(LoginStatus.message);
            // }
            // login("/Login",username,password).then((results)=>{
            //   const login = JSON.parse(JSON.stringify(results))
            //   console.log(login)
            //   if(login.status === "ok"){
            //       // alert(login.message);
            //       const userData = {
            //           username:username,
            //           token:login.token
            //         };
            //       localStorage.setItem("User", JSON.stringify(userData));
            //       navigate('/');
            //   }
            //   else{
            //       alert(login.message);
            //   }
            // })
          }
          , 3000);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type","application/json");

        var raw = JSON.stringify({
            "username": inputs.username,
            "password": inputs.password
        })
    }
    return(
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={load}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                {/* <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link> */}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
    )
};
export default HomeLogin
