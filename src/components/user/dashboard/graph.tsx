// import PropTypes from 'prop-types';
// import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
// import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  SvgIcon
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { alpha, useTheme } from '@mui/material/styles';
import Chart  from 'react-apexcharts';

const useChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        columnWidth: '40px'
      }
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 2
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true
      },
      categories: [
        'ม.ค.',
        'ก.พ.',
        'มี.ค.',
        'เม.ย.',
        'พ.ค.',
        'มิ.ย.',
        'ก.ค',
        'ส.ค.',
        'ก.ย.',
        'ต.ค.',
        '	พ.ย.',
        '	ธ.ค.'
      ],
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (value:any) => (value > 0 ? `${value} อุปกรณ์` : `${value}`),
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
  };
};

export default function OverviewSales (props:any) {
  const { chartSeries, sx } = props;
  const chartOptions = useChartOptions();
  const navigate = useNavigate();

  return (
    <Card sx={sx}>
      <CardHeader
        title="บำรุงรักษาประจำปี"
      />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
        />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          sx={{paddingLeft:3}}
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              {/* <ArrowRightIcon /> */}
            </SvgIcon>
          )}
          size="small"
          onClick={() => navigate('/app/admin/maintenance')}
        >
          Overview
        </Button>
      </CardActions>
    </Card>
  );
};
