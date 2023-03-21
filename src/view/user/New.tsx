import React, { useEffect, useState,forwardRef } from "react";
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
    Divider,
    Input
  } from "@mui/material";
  import { IMaskInput } from 'react-imask';
  import { Controller,useForm } from 'react-hook-form';

  interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
  }

  const TextMaskCustom = forwardRef<HTMLElement, CustomProps>(
    function TextMaskCustom(props, ref:any) {
      const { onChange, ...other } = props;
      return (
        <IMaskInput
          {...other}
          mask="0-0000-00000-00-0"
          definitions={{
            '#': /[1-9]/,
          }}
          inputRef={ref}
          onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
          overwrite
        />
      );
    },
  );
const NewUser: React.FC = () => {

    const navigate = useNavigate();
    //user
    const [token,setToken] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const { control, handleSubmit, watch } = useForm({
        reValidateMode: "onBlur"
      });

    const myHelper:any = {
        username:{
          required: "Username is Required"
        },
        password:{
          required: "Password is Required"
        },
        confirmpassword:{
          required: "ConfirmPassword is Required",
          validate: "Password Not Match"
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
        card:{
          required: "Id Card is Required",
          pattern: "Invalid Id Card"
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
        await register("/User/Register",token,data.name,data.surname,data.id_card,data.password,data.email,data.role,data.departure)
        navigate('/app/admin/user/list')
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
        <Container>
        <Stack spacing={3}>
            <Typography variant="h3" gutterBottom>
                Create a new user
            </Typography>
          <Box component="form" onSubmit={handleSubmit(handleOnSubmit)}>
          <Card>
            <CardContent sx={{pt:4}}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={2} pl={2} pr={2}>
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
                      name="id_card"
                      defaultValue=""
                      rules={{
                        required: true,
                        pattern: /([0-9]{1})-([0-9]{4})-([0-9]{5})-([0-9]{2})-([0-9]{1})/
                      }}
                      render={({ field, fieldState: { error } }) => (
                        
                        <TextField
                        {...field}
                          type="text"
                          fullWidth
                          label="ID Card"
                          InputProps={{
                            inputComponent: TextMaskCustom as any
                          }}
                          error={error !== undefined}
                          helperText={error ? myHelper.card[error.type] : ""}
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
                      name="con-password"
                      defaultValue=""
                      rules={{
                        required: true,
                        validate: (val: string) => {
                          if (watch('password') != val) {
                            return false;
                          }
                        }
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="password"
                          fullWidth
                          label="ConfirmPassword"
                          error={error !== undefined}
                          helperText={error ? myHelper.confirmpassword[error.type] : ""}
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
