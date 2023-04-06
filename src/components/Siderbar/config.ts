// component
import SvgColor from '../svg-color';

// ----------------------------------------------------------------------

// const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/app/admin/dashboard',
    icon:'ant-design:dashboard-filled',
  },
  {
    title:'User',
    path: '/app/admin/user',
    icon:'mdi:user-circle'
  },
  {
    title: 'Socket',
    path: '/app/admin/socket',
    icon: 'mdi:plug-socket-au',
  },
  {
    title: 'Asset',
    path: '/app/admin/asset',
    icon: 'ri:plug-2-line',
  },
  {
    title: 'Match',
    path: '/app/admin/match',
    icon: 'ph:plugs-connected-bold',
  },
  {
    title: 'Approve',
    path: '/app/admin/approve',
    icon: 'basil:user-clock-solid',
  },
  {
    title: 'Maintenance',
    path: '/app/admin/maintenance',
    icon: 'wpf:maintenance',
  },
  {
    title: 'Transaction',
    path: '/app/admin/transaction',
    icon: 'icon-park-solid:transaction-order',
  },
  {
    title: 'Not found',
    path: '/404',
    // icon: icon('ic_disabled'),
  },
];

export default navConfig;
