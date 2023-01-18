import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
// import { StyledNavItem } from './styles';

import { styled } from '@mui/material/styles';
// import { ListItemIcon, ListItemButton } from '@mui/material';
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';


// ----------------------------------------------------------------------
interface StyledListItemButtonProps extends ListItemButtonProps {
  component?:any
  to?:any
  sx?:any
}


export default function NavSection(props:any) {
  const data = props.data
  return (
    <Box>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item:any) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}


// ----------------------------------------------------------------------


function NavItem(props:any) {
  const { title, path, icon, info } = props.item;
  const StyledListItemButtonProps =  styled(ListItemButton)<StyledListItemButtonProps>(({ theme }) => ({
    ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  }));
  return (
    <StyledListItemButtonProps
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <ListItemText disableTypography primary={title} />


    </StyledListItemButtonProps>
    // <StyledNavItem
    //   component={RouterLink}
    //   to={path}
    //   sx={{
    //     '&.active': {
    //       color: 'text.primary',
    //       bgcolor: 'action.selected',
    //       fontWeight: 'fontWeightBold',
    //     },
    //   }}
    // >
    //   {/* <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon> */}

    //   <ListItemText disableTypography primary={title} />

    //   {info && info}
    // </StyledNavItem>
  );
}
