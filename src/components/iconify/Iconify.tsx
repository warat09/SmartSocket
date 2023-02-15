import * as React from 'react';
import { Icon } from '@iconify/react';
import { Box } from '@mui/system';

export default function Iconify(props:any) {
    const {icon ,style,sx} = props;
  return (
    <Box>
        <Box component={Icon} icon={icon} style={style} sx={sx}/>
    </Box>
  );
}