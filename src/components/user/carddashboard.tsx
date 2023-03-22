import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import Iconify from '../iconify';
export default function CardDashboard(props:any) {
    const { difference, positive = false, sx, value, topic, icon } = props;
    return (
        <Card sx={sx}>
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
                backgroundColor: 'error.main',
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
          {difference && (
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Stack
                alignItems="center"
                direction="row"
                spacing={0.5}
              >
                <SvgIcon
                  color={positive ? 'success' : 'error'}
                  fontSize="small"
                >
                  {/* {positive ? <ArrowUpIcon /> : <ArrowDownIcon />} */}
                </SvgIcon>
                <Typography
                  color={positive ? 'success.main' : 'error.main'}
                  variant="body2"
                >
                  {difference}%
                </Typography>
              </Stack>
              <Typography
                color="text.secondary"
                variant="caption"
              >
                Since last month
              </Typography>
            </Stack>
          )}
        </CardContent>
      </Card>
      
    );
  }