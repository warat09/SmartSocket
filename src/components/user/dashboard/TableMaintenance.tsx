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
    Paper,
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
          <Box sx={{ minWidth: 700 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    ชื่ออุปกรณ์
                  </TableCell>
                  <TableCell>
                    เวลาที่เหลือในการบำรุงรักษา
                  </TableCell>
                  <TableCell sortDirection="desc">
                    วันที่-เวลา
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
                      key={order.name_assets}
                    >
                      <TableCell>
                        {order.name_assets}
                      </TableCell>
                      <TableCell>
                        {order.maintenance ? 'ควรส่งซ่อม' : 'ยังไม่ซ่อม'} 
                      </TableCell>
                      <TableCell>
                        {new Date(order.date_assets).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}
                      </TableCell>
                      {/* <TableCell>
                        {order.Match_status_match}
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
              {Object.values(orders).length === 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center",
                          }}
                        >
                          <img src="/assets/illustrations/illustration_empty_content.svg"  height={300} width={300} />
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
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
  
  