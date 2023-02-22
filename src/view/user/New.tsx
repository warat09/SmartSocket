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
    FormHelperText
  } from "@mui/material";
import { Controller,useForm } from 'react-hook-form';


const NewUser: React.FC = () => {

    const navigate = useNavigate();
    //user
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
        await register(data.name,data.surname,data.username,data.password,data.email,data.role,data.departure)
        navigate('/app/user/list')
      }
  
    // const handleSubmit=async()=>{
    //   console.log(await register(name,surname,username,password,email,role,departure))
    // }
    return(
     <>
        <Helmet>
          <title> User: New | SmartSocket </title>
        </Helmet>
        <Container>
         <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5,mt:2 }}>
            <Typography variant="h4" gutterBottom>
                Create a new user
            </Typography>
         </Stack>
         <Box sx={{ minWidth: 120 }} component="form" onSubmit={handleSubmit(handleOnSubmit)}>
          <Stack spacing={3} mb={3}>
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
                type="text"
                error={error !== undefined}
                helperText={error ? myHelper.username[error.type] : ""}
              />
              )}
            />

          {/* <Controller
              control={control}
              name="rfid"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl error={error !== undefined} fullWidth>
                <InputLabel id="demo-simple-select-label">Rfid</InputLabel>
                  <Select 
                  {...field}
                  fullWidth
                  labelId="demo-simple-select-label"
                  label="Rfid"
                  error={error !== undefined}
                   >
                    <MenuItem
                      value=""
                    >
                      <em>None</em>
                    </MenuItem>
                {RfidAssets.map((inputnode) => {
                  return (
                    <MenuItem
                      value={inputnode.Rfid_rfid_address}
                      key={inputnode.Rfid_rfid_address}
                    >
                      {inputnode.Rfid_rfid_address}
                    </MenuItem>
                  );
                })}
                   </Select>
                <FormHelperText>{error ? myHelper.rfid[error.type] : ""}</FormHelperText>
                </FormControl>
              )}
            /> */}

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
                <Button variant="contained" type="submit">
                      Add Matching
                </Button>
          </Stack>        
        </Box>
        </Container>
        
            {/* <div className="container">
            <h1>Create</h1>
            <hr/>
            <div className="information">
                <form action="">
                <label>username</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    onChange={(e) => {
                    setUsername(e.target.value);
                    }}
                ></input>

                <label>password</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    onChange={(e) => {
                    setPassword(e.target.value);
                    }}
                ></input>

                <label>name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    onChange={(e) => {
                    setName(e.target.value);
                    }}
                ></input>

                <label>surname</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    onChange={(e) => {
                    setSurname(e.target.value);
                    }}
                ></input>

                <label>email</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    onChange={(e) => {
                    setEmail(e.target.value);
                    }}
                ></input>

                <label>telephone</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    onChange={(e) => {
                    setPhone(e.target.value);
                    }}
                ></input>

                <label>role</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    onChange={(e) => {
                    setRole(e.target.value);
                    }}
                ></input>

                <label>departure</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    onChange={(e) => {
                    setDeparture(e.target.value);
                    }}
                ></input>
                <div className="button-submit">
                    <button onClick={handleSubmit}>ADD Assets</button>
                </div>
                </form>
            </div>
            </div> */}
    </>
    );
}
export default NewUser;
