// import { format } from 'date-fns';
// import PropTypes from 'prop-types';
// import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import formatTime from '../../caltime/millisectohms';
// import { Scrollbar } from 'src/components/scrollbar';
// import { SeverityPill } from 'src/components/severity-pill';

const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error'
};

export default function OverviewLatestOrders (props:any) {
  const { orders = [], sx ,title} = props;

  return (
    <Card sx={sx}>
      <CardHeader title={title}/>
      {/* <Scrollbar sx={{ flexGrow: 1 }}> */}
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Assets
                </TableCell>
                <TableCell sortDirection="asc" >
                  Remaining time
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
                {/* <TableCell>
                  Status
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order:any) => {
                // const createdAt = format(order.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={order.Asset_name_assets}
                  >
                    <TableCell>
                      {order.Asset_name_assets}
                    </TableCell>
                    <TableCell>
                      {formatTime(order.Match_remain_time)} 
                    </TableCell>
                    <TableCell>
                      {new Date(order.Match_active_datetime).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}
                    </TableCell>
                    {/* <TableCell>
                      {order.Match_status_match}
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      {/* </Scrollbar> */}
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              {/* <ArrowRightIcon /> */}
            </SvgIcon>
          )}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};
