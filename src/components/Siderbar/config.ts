// component
import SvgColor from '../svg-color';

// ----------------------------------------------------------------------

// const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/app/dashboard',
    icon:'fluent-mdl2:b-i-dashboard',
  },
  {
    title: 'Node',
    path: '/app/node',
    icon: 'mdi:plug-socket-au',
  },
  {
    title: 'Asset',
    path: '/app/asset',
    icon: 'ri:plug-2-line',
  },
  {
    title: 'Match',
    path: '/app/match',
    icon: 'fluent:plug-connected-add-20-regular',
  },
  {
    title: 'Approve',
    path: '/app/approve',
    icon: 'mdi:user-search-outline',
  },
  {
    title: 'Transaction',
    path: '/app/transaction',
    icon: 'icon-park-outline:transaction-order',
  },
  {
    title: 'Not found',
    path: '/404',
    // icon: icon('ic_disabled'),
  },
];

export default navConfig;
