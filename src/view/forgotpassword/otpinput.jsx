import { useState,useEffect,useContext } from 'react';

import { Helmet } from 'react-helmet-async';

import { Container,Box,Stack,Typography,TextField,Divider} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { Controller, useForm } from "react-hook-form";

const myHelper = {
  otpnumber:{
    required: "Asset is Required"
  },
};

export default function OtpPage() {
  const [load,setLoad] = useState(false)
  const { control, handleSubmit } = useForm({
    reValidateMode: "onBlur"
  });
  const handleOnSubmit=async(data)=>{
  }

  return(
    <>
      <Helmet>
          <title> ForgotPassword | SmartSocket </title>
      </Helmet>
      <Container maxWidth="sm">
            <Typography variant="body1" textAlign={'center'} color={'gray'} gutterBottom>
            Please enter the email address associated with your account and We will email you a link to reset your password.
            </Typography>
          <Box component="form" onSubmit={handleSubmit(handleOnSubmit)}>
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
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={load} sx={{mt:4}}>
              Send Request
            </LoadingButton>
            </Box>
        </Container>
    </>
  );

}
