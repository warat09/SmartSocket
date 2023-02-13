import * as React from 'react';
import { Icon } from '@iconify/react';
import { Box } from '@mui/system';

export default function Iconify(props:any) {
    const icon = props.icon;
  return (
    <Box>
        <Box component={Icon} icon={icon}/>
    </Box>
  );
}