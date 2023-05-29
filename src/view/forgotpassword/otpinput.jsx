import { useState,useEffect,useContext,useRef } from 'react';

import { Helmet } from 'react-helmet-async';

import { Container,Box,Stack,Typography,TextField,Divider} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { Controller, useForm } from "react-hook-form";

import { styled } from '@mui/material/styles';

import { RecoveryContext } from "./forgotpassword";


const myHelper = {
  otpnumber:{
    required: ""
  },
};

export default function OtpPage() {
  const { email, otp } = useContext(RecoveryContext);
  const [load,setLoad] = useState(false)
  const { control, handleSubmit } = useForm({
    reValidateMode: "onBlur"
  });
  const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 3),
  }));

  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (value.length === 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleOnSubmit=async(data)=>{
    let {email,password,otp_1,otp_2,otp_3,otp_4,otp_5,otp_6} = data
    const Otp = String(otp_1).concat(String(otp_2),String(otp_3),String(otp_4),String(otp_5),String(otp_6));
    if(Otp === otp){
      console.log("yes")
      console.log(Otp,otp)
    }
    else{
      console.log("no")
      console.log(Otp,otp)
    }
  }

  return(
    <>
      <Helmet>
          <title> ForgotPassword | SmartSocket </title>
      </Helmet>
      <Container maxWidth="xs">
      
      <StyledContent>
        
          <Box paddingBottom={3}>
            <img src="/assets/illustrations/illustration_sentemail.png" alt="login" style={{marginLeft:'auto',marginRight:'auto',width: '60%'}} />
              <Typography variant="body1" textAlign={'center'} color={'gray'} gutterBottom>
              เราได้ส่งอีเมลยืนยัน 6 หลักไปยังอีเมลของคุณแล้ว
              </Typography>
              <Typography variant="body1" textAlign={'center'} color={'gray'} gutterBottom>
              กรุณาใส่รหัสในช่องด้านล่างเพื่อยืนยันอีเมลของคุณ
              </Typography>
          </Box>
          
            
          <Box component="form" onSubmit={handleSubmit(handleOnSubmit)}>
          <Controller
                    control={control}
                    name="email"
                    defaultValue={email}
                    rules={{
                      required: true
                    }}
                    render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      type="text"
                      fullWidth
                      label="อีเมล"
                      defaultValue={email}
                      InputProps={{
                        readOnly: true,
                      }}
                      error={error !== undefined}
                      helperText={error ? myHelper.asset[error.type] : ""}
                    />
                    )}
                  />
                  {/* <p>OTP Entered - {Otp.join("")}</p> */}
                  
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            pt={3}
            pb={1}
          >
            {[...Array(6)].map((data, index) => {
                        return (
                          <Controller
                          control={control}
                          name={`otp_${index+1}`}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              type="text"
                              placeholder="-"
                              value={data}
                              inputProps={{
                                maxLength: 1,
                                style: { width:'30px',height:'23px',textAlign: 'center' },
                              }}
                              onChange={(e) =>{
                                field.onChange(parseInt(e.target.value))
                                handleChange(index, e)                             
                                }                     
                              }
                              inputRef={(ref) => (inputRefs.current[index] = ref)}
                              error={error !== undefined}
                              helperText={error ? myHelper.otpnumber[error.type] : ""}
                            />
                          )}
                        />
                        // <TextField
                        //   type="text"
                        //   name="otp"
                        //   key={index}
                        //   value={data}
                        //   onChange={e => handleChange(e.target, index)}
                        //   onFocus={e => e.target.select()}
                        //   inputProps={{
                        //     maxLength: 1,
                        //     style: { width:'30px',height:'23px',textAlign: 'center' },
                        //   }}
                        // />
                      //   <TextField
                      //   key={index}
                      //   variant="outlined"
                      //   size="small"
                      //   type="text"
                      //   inputProps={{ maxLength: 1,style: { width:'30px',height:'40px',textAlign: 'center' }, }}
                      //   onChange={(e) => handleChange(index, e)}
                      //   inputRef={(ref) => (inputRefs.current[index] = ref)}
                      // />
                        );
                    })}
            
                    
            
                  {/* <Controller
                      control={control}
                      name="otp_1"
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          placeholder="-"
                          error={error !== undefined}
                          helperText={error ? myHelper.otpnumber[error.type] : ""}
                          inputProps={{
                            maxLength: 1,
                            style: { width:'30px',height:'23px',textAlign: 'center' },
                          }}
                          inputRef={(input) => {
                            if (input != null) {
                              input.focus();
                              // setinputotp({otp_1:input})
                            }
                          }}
                          onFocus={e => e.target.select()}
                        />
                      )}
                    /> */}

                    {/* <Controller
                      control={control}
                      name="otp_2"
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          placeholder="-"
                          error={error !== undefined}
                          helperText={error ? myHelper.otpnumber[error.type] : ""}
                          inputProps={{
                            maxLength: 1,
                            style: { width:'30px',height:'23px',textAlign: 'center' },
                          }}
                          onFocus={e => e.target.select()}
                        />
                      )}
                    />

                  <Controller
                      control={control}
                      name="otp_3"
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          placeholder="-"
                          error={error !== undefined}
                          helperText={error ? myHelper.otpnumber[error.type] : ""}
                          inputProps={{
                            maxLength: 1,
                            style: { width:'30px',height:'23px',textAlign: 'center' },
                          }}
                        />
                      )}
                    />

                  <Controller
                      control={control}
                      name="otp_4"
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          placeholder="-"
                          error={error !== undefined}
                          helperText={error ? myHelper.otpnumber[error.type] : ""}
                          inputProps={{
                            maxLength: 1,
                            style: { width:'30px',height:'23px',textAlign: 'center' },
                          }}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="otp_5"
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          placeholder="-"
                          error={error !== undefined}
                          helperText={error ? myHelper.otpnumber[error.type] : ""}
                          inputProps={{
                            maxLength: 1,
                            style: { width:'30px',height:'23px',textAlign: 'center' },
                          }}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="otp_6"
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          placeholder="-"
                          error={error !== undefined}
                          helperText={error ? myHelper.otpnumber[error.type] : ""}
                          inputProps={{
                            maxLength: 1,
                            style: { width:'30px',height:'23px',textAlign: 'center' },
                          }}
                        />
                      )}
                    /> */}
            </Stack>
            <Stack spacing={3} sx={{mt:3}}>
                <Controller
                      control={control}
                      name="password"
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="password"
                          label="รหัสผ่าน"
                          error={error !== undefined}
                          helperText={error ? myHelper.otpnumber[error.type] : ""}
                        />
                      )}
                    />
                <Controller
                      control={control}
                      name="confirm_password"
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="password"
                          label="ยืนยันรหัสผ่าน"
                          error={error !== undefined}
                          helperText={error ? myHelper.otpnumber[error.type] : ""}
                        />
                      )}
                    />
            </Stack>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={load} sx={{mt:4}}>
              ยืนยัน
            </LoadingButton>
            </Box>
            </StyledContent>
        </Container>
    </>
  );

}
