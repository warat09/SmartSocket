// import PropTypes from 'prop-types';
// import ComputerDesktopIcon from '@heroicons/react/24/solid/ComputerDesktopIcon';
// import DeviceTabletIcon from '@heroicons/react/24/solid/DeviceTabletIcon';
// import PhoneIcon from '@heroicons/react/24/solid/PhoneIcon';
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';

import useChart  from '../../chart/useChart';
import Chart  from 'react-apexcharts';

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const StyledChartWrapper = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// const useChartOptions = (labels:any) => {
//   const theme = useTheme();

//   return {
//     chart: {
//       background: 'transparent'
//     },
//     dataLabels: {
//       enabled: false
//     },
//     labels,
//     legend: {
//       show: false,
//     },
//     plotOptions: {
//       pie: {
//         expandOnClick: true,
//         donut:{
//           size: '85%',
//           labels:{
//             show: true,
//             value: {
//               show: true,
//               fontSize: '20px',
//               fontFamily: 'Helvetica, Arial, sans-serif',
//               fontWeight: 400,
//               color: undefined,
//               offsetY: 16,

//             },
//             total:{
//               fontSize: '20px',
//               fontFamily: 'Helvetica, Arial, sans-serif',
//               fontWeight: 600,
//               color: 'gray',
//               show:true,
//               // showAlways:true
//             }
//           }
//         }
//       }
//     },
//     states: {
//       active: {
//         filter: {
//           type: 'none'
//         }
//       },
//       hover: {
//         filter: {
//           type: 'none'
//         }
//       }
//     },
//     stroke: {
//       width: 4
//     },
//     theme: {
//       mode: theme.palette.mode
//     },
//     tooltip: {
//       fillSeriesColor: false
//     },
//     fill: {
//       type: "gradient"
//     }
//   };
// };

// const iconMap:any = {
//   Desktop: (
//     <SvgIcon>
//       {/* <ComputerDesktopIcon /> */}
//     </SvgIcon>
//   ),
//   Tablet: (
//     <SvgIcon>
//       {/* <DeviceTabletIcon /> */}
//     </SvgIcon>
//   ),
//   Phone: (
//     <SvgIcon>
//       {/* <PhoneIcon /> */}
//     </SvgIcon>
//   )
// };

export default function OverviewTraffic (props:any) {
  const { chartData,sx } = props;
  const theme = useTheme();
  const chartLabels = chartData.map((i:any) => i.departure);
  const chartSeries = chartData.map((i:any) => Number(i.total));

  const chartOptions = useChart({
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName:any) => Number(seriesName),
        title: {
          formatter: (seriesName:any) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: true } } },
    },
  });

  return (
    <Card sx={sx}>
      <CardHeader title="Total Departure Rent" />
      <StyledChartWrapper dir="ltr">
        <Chart type="donut" series={chartSeries} options={chartOptions} height={280} />
      </StyledChartWrapper>
    </Card>
  );
};

