import { Avatar, Card,CardActionArea, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Iconify from '../../iconify';
const CardWrapper = styled(Card)(({ theme }) => ({
  // backgroundColor: theme.palette.secondary.dark,
  // color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${'#16395e'} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
},
'&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${'#16395e'} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
}
}));
export default function CardDashboard(props:any) {
    const { difference, positive = false, sx, value, topic, icon } = props;
    return (
        <CardWrapper sx={sx}>
          <CardActionArea>
        <CardContent>
          <Stack
            alignItems="flex-start"
            direction="row"
            justifyContent="space-between"
            spacing={4}
          >
            <Stack spacing={1}>
              <Typography
                color="text.secondary"
                variant="overline"
              >
                {topic}
              </Typography>
              <Typography variant="h4">
                {value}
              </Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: '#16395e',
                height: 56,
                width: 56
              }}
            >
              <Iconify icon={icon} sx={{width: 40, height: 40 }}/>
              {/* <SvgIcon>
                <CurrencyDollarIcon />
              </SvgIcon> */}
            </Avatar>
          </Stack>
        </CardContent>
        </CardActionArea>
      </CardWrapper>
      
    );
  }