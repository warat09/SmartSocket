import { useState,useEffect,useContext } from 'react';

import { Helmet } from 'react-helmet-async';

import { Container,Box,Stack,Typography,TextField,Divider} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { Controller, useForm } from "react-hook-form";

import { styled } from '@mui/material/styles';

import { RecoveryContext } from "./forgotpassword";

const myHelper = {
  otpnumber:{
    required: "Asset is Required"
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
    padding: theme.spacing(12, 0),
  }));
  const [inputotp,setinputotp] = useState({otp_1:""})
  const handleOnSubmit=async(data)=>{
  }

  return(
    <>
      <Helmet>
          <title> ForgotPassword | SmartSocket </title>
      </Helmet>
      <Container maxWidth="sm">
      <StyledContent>
          <Box paddingBottom={3}>
            <img src="/assets/illustrations/illustration_sentemail.png" alt="login" style={{marginLeft:'auto',marginRight:'auto',width: '60%'}} />
              <Typography variant="body1" textAlign={'center'} color={'gray'} gutterBottom>
              We've sent a 6-digit confirmation email to your email.
              </Typography>
              <Typography variant="body1" textAlign={'center'} color={'gray'} gutterBottom>
              Please enter the code in below box to verify your email.
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
                      label="Email"
                      defaultValue={email}
                      InputProps={{
                        readOnly: true,
                      }}
                      error={error !== undefined}
                      helperText={error ? myHelper.asset[error.type] : ""}
                    />
                    )}
                  />
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            justifyContent="center"
            pt={3}
            pb={1}
          >
                  <Controller
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
                        />
                      )}
                    />

                    <Controller
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
                    />
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
                          label="Password"
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
                          label="Confirm New Password"
                          error={error !== undefined}
                          helperText={error ? myHelper.otpnumber[error.type] : ""}
                        />
                      )}
                    />
            </Stack>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={load} sx={{mt:4}}>
              Update Password
            </LoadingButton>
            </Box>
            </StyledContent>
        </Container>
    </>
  );

}
