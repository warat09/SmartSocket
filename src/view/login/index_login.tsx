import { useEffect, useState } from 'react';

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
import { Checktoken, login } from '../../services/apiservice';
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

export default function LoginPage() {
  
  const mdUp = useResponsive('up', 'md','');

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

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
    },
    password:{
      required: "Password is Required",
    }
  };

  const handleOnSubmit=async(data:any)=>{
    setLoad(true)
    const {email,password} = data
    setTimeout(async()=>{
      await login("/Login",email,password);
    }
    , 2000);
  }
  
  useEffect(() => {
        if(window.history.state !== null){
          const {open,message,status} = window.history.state
          if(open === 1){
            setMessagealert({message:message,color:status})
            setOpenAlert(true);
            window.history.replaceState({}, "", "");
        }
      }
  }, []);

  return (
    <>
      <Helmet>
        <title> Login | SmartSocket </title>
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

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              สวัสดี! ยินดีต้อนรับ
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
            ลงชื่อเข้าใช้ SmartS<Iconify icon={"solar:plug-circle-outline"} />cket
            </Typography>
          <Box component="form" onSubmit={handleSubmit(handleOnSubmit)}>
            <Stack spacing={3} sx={{mt:5}}>
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
                          name="password"
                          label="รหัสผ่าน"
                          type={showPassword ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          error={error !== undefined}
                          helperText={error ? myHelper.password[error.type] : ""}
                        />
                      )}
                    />

              
            </Stack>


            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
              <Typography variant="body2">
              </Typography>
              <Link  variant="subtitle2" underline="hover" onClick={() => {navigate("/forgotpassword")}}>
                ลืมรหัสผ่าน?
              </Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={load}>
              เข้าสู่ระบบ
            </LoadingButton>
            </Box>
          </StyledContent>
        </Container>
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
