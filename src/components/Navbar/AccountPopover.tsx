import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import Iconify from '../iconify';
// mocks_

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover(props:any) {
  const [open, setOpen] = useState(null);
  const userData : any = props.data;
  const handleOpen = (event:any) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (menu:number) => {
    setOpen(null);
    if(menu === 0){
      localStorage.clear()
      window.location.reload()
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        // sx={{
        //   zIndex: 1,
        //   content: "''",
        //   width: '100%',
        //   height: '100%',
        //   borderRadius: '50%',
        // }}
        // sx={{
        //   p: 0,
        //   ...(open && {
        //     '&:before': {
        //       zIndex: 1,
        //       content: "''",
        //       width: '100%',
        //       height: '100%',
        //       borderRadius: '50%',
        //       position: 'absolute',
        //       bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
        //     },
        //   }),
        // }}
      >
        <Avatar src={"https://ui-avatars.com/api/?bold=true&name=" + userData.name+"+"+userData.surname} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userData.name} {userData.surname}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userData.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} /> */}

        <MenuItem sx={{ color: 'error.main',m: 1 }} onClick={()=>handleClose(0)}>
          <Iconify icon={'ant-design:logout-outlined'} sx={{ width:15,height:15,mr: 2 }} />
            Logout
          </MenuItem>
      </Popover>
    </>
  );
}
