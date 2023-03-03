import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { register } from "../../services/apiservice";
import { useNavigate } from "react-router-dom";
import {
    Typography,
    Container,
    MenuItem,
    Box,
    FormControl,
    InputLabel,
    Select,
    TextField,
    Stack,
    Button,
    FormHelperText,
    Card,
    CardHeader,
    CardContent,
    Unstable_Grid2 as Grid,
    CardActions,
    Divider
  } from "@mui/material";
import { Controller,useForm } from 'react-hook-form';


const NewUser: React.FC = () => {

    const navigate = useNavigate();
    //user
    const [token,setToken] = useState<string>("")
    const { control, handleSubmit } = useForm({
        reValidateMode: "onBlur"
      });

    const myHelper:any = {
        username:{
          required: "User Name is Required"
        },
        password:{
          required: "Password is Required"
        },
        name:{
          required: "Name is Required"
        },
        surname:{
          required: "Surname is Required"
        },
        email:{
          required: "Email is Required",
          pattern: "Invalid Email Address"
        },
        role:{
          required: "Role is Required"
        },
        departure:{
            required: "Departure is Required"
        }
      };
      const handleOnSubmit=async(data:any)=>{
        console.log(data)
        await register("/User/Register",token,data.name,data.surname,data.username,data.password,data.email,data.role,data.departure)
        // navigate('/app/user/list')
      }
  
    // const handleSubmit=async()=>{
    //   console.log(await register(name,surname,username,password,email,role,departure))
    // }
    useEffect(() => {
      const item = localStorage.getItem("User");
      if (item && item !== "undefined") {
        const user = JSON.parse(item);
        setToken(user.token)
      }
      else{
        navigate('/login')
      }
    },[]);
    return(
     <>
        <Helmet>
          <title> User: New | SmartSocket </title>
        </Helmet>
        <Container>
        <Stack spacing={3}>
            <Typography variant="h3" gutterBottom>
                Create a new user
            </Typography>
          <Box component="form" onSubmit={handleSubmit(handleOnSubmit)}>
          <Card>
            <CardHeader
              subheader="The information can be edited"
              title="Profile"
            />
            <CardContent sx={{pt:2}}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={2} pl={2} pr={2}>
                  <Grid
                    xs={12}
                    md={6}
                  >
                     <Controller
                      control={control}
                      name="username"
                      defaultValue=""
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                        {...field}
                        label="UserName"
                        fullWidth
                        type="text"
                        error={error !== undefined}
                        helperText={error ? myHelper.username[error.type] : ""}
                      />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="password"
                      defaultValue=""
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="password"
                          fullWidth
                          label="Password"
                          error={error !== undefined}
                          helperText={error ? myHelper.password[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="name"
                      defaultValue=""
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Name"
                          error={error !== undefined}
                          helperText={error ? myHelper.name[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                     <Controller
                      control={control}
                      name="surname"
                      defaultValue=""
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Surname"
                          error={error !== undefined}
                          helperText={error ? myHelper.surname[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="email"
                      defaultValue=""
                      rules={{
                        required: true,
                        pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Email"
                          error={error !== undefined}
                          helperText={error ? myHelper.email[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="role"
                      defaultValue=""
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Role"
                          error={error !== undefined}
                          helperText={error ? myHelper.role[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="departure"
                      defaultValue=""
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Departure"
                          error={error !== undefined}
                          helperText={error ? myHelper.departure[error.type] : ""}
                        />
                      )}
                    />  
                  </Grid>
                </Grid>   
              </Box> 
            </CardContent>
            <Divider />
            <CardActions>
               <Button fullWidth variant="text" type="submit">
                Create a new user
                </Button>
             </CardActions>
            </Card>
            </Box>
          </Stack>
        </Container>
    </>
    );
}
export default NewUser;
