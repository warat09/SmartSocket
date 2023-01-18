// component
import SvgColor from '../svg-color';

// ----------------------------------------------------------------------

// const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/app/dashboard',
    // icon: icon('ic_analytics'),
  },
  {
    title: 'Node',
    path: '/app/node',
    // icon: icon('ic_user'),
  },
  {
    title: 'Asset',
    path: '/app/asset',
    // icon: icon('ic_cart'),
  },
  {
    title: 'Match',
    path: '/app/match',
    // icon: icon('ic_cart'),
  },
  {
    title: 'Approve',
    path: '/app/approve',
    // icon: icon('ic_blog'),
  },
  {
    title: 'Transaction',
    path: '/app/transaction',
    // icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    // icon: icon('ic_disabled'),
  },
];

export default navConfig;
