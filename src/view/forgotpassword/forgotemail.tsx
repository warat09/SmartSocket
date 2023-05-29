import { useState,useEffect,useContext } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';

import { Link, Container, Typography, Divider, Stack, Button, TextField, InputAdornment, IconButton,Checkbox, Box, Snackbar, Alert } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';

import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
// components
// import Logo from '../components/logo';
import Iconify from '../../components/iconify';

import { Controller, useForm } from 'react-hook-form';

import { recoveryEmail } from '../../services/apiservice';

import { RecoveryContext } from "./forgotpassword";

// // sections
// import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  // boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ForgotPage() {
  const { setEmail, setPage, email, setOTP } = useContext(RecoveryContext);

  const mdUp = useResponsive('up', 'md','');

  const { control, handleSubmit } = useForm({
    reValidateMode: "onBlur"
  });

  const [load,setLoad] = useState(false)

  const [openAlert, setOpenAlert] = useState(false);

  const [messagealert, setMessagealert]:any = useState({message:"",color:""});

  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const myHelper:any = {
    email:{
      required: "Email is Required",
      pattern: "Invalid Email Address"
    }
  };

  const handleOnSubmit=async(data:any)=>{
    const nagigateToOtp =async () => {
        if (email) {
          const OTP = Math.floor(Math.random() * 900000 + 100000);
          console.log(OTP);
          await recoveryEmail("/Forgotpassword/send_recovery_email",String(OTP),email).then(setOTP(String(OTP)))
    
        //   axios
        //     .post("http://localhost:5000/send_recovery_email", {
        //       OTP,
        //       recipient_email: email,
        //     })
        //     .then(() => setPage("otp"))
        //     .catch(console.log);
          return;
        }
        return alert("Please enter your email");
      }
    setLoad(true)
    const {email} = data
    setTimeout(async()=>{
        setPage("otp")
        setEmail(email)
        nagigateToOtp()
        // await forgotpassword("/Forgotpassword",email)
    }
    , 2000);
  }
  
  useEffect(() => {
    const {open,message} = window.history.state
      if(open === 1){
          setMessagealert({message:message,color:"success"})
          setOpenAlert(true);
          window.history.replaceState({}, "", "");
      }
  }, []);

  return (
    <>
      <Helmet>
        <title> ForgotPassword | SmartSocket </title>
      </Helmet>

      <StyledRoot>  
        <Iconify icon={"solar:plug-circle-bold-duotone"} 
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
            width: 50, height: 50
          }}
        />



        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="body1" textAlign={'center'} color={'gray'} gutterBottom>
            โปรดป้อนที่อยู่อีเมลที่เชื่อมโยงกับบัญชีของคุณและเราจะส่งอีเมลลิงก์เพื่อรีเซ็ตรหัสผ่านของคุณ
            </Typography>
          <Box component="form" onSubmit={handleSubmit(handleOnSubmit)}>
            <Stack spacing={3} sx={{mt:3}}>
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
                          label="อีเมล"
                          error={error !== undefined}
                          helperText={error ? myHelper.email[error.type] : ""}
                        />
                      )}
                    />

            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={load} sx={{mt:4}}>
              ส่งคำขอ
            </LoadingButton>
            </Box>
          </StyledContent>
        </Container>

        {mdUp && (
          <StyledSection>
            <Typography style={{textAlign:'center'}} variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            ลืมรหัสผ่านใช่ไหม?
            </Typography>
            <img src="/assets/illustrations/illustration_forgotpassword.png" alt="forgotpassword" />
          </StyledSection>
        )}
      </StyledRoot>

      <Snackbar
          open={openAlert}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            variant="filled"
            severity={messagealert.color}
            sx={{ width: "100%" }}
          >
            {messagealert.message}!
          </Alert>
        </Snackbar>
        
    </>
  );
}
