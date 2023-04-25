// component
import SvgColor from '../svg-color';

// ----------------------------------------------------------------------

// const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'แผงควบคุม',
    path: '/app/admin/dashboard',
    icon:'ant-design:dashboard-filled',
  },
  {
    title:'ผู้ใช้',
    path: '/app/admin/user',
    icon:'mdi:user-circle'
  },
  {
    title: 'เต้าเสียบ',
    path: '/app/admin/socket',
    icon: 'mdi:plug-socket-au',
  },
  {
    title: 'อุปกรณ์',
    path: '/app/admin/asset',
    icon: 'ri:plug-2-line',
  },
  {
    title: 'จับคู่อุปกรณ์',
    path: '/app/admin/match',
    icon: 'ph:plugs-connected-bold',
  },
  {
    title: 'อนุมัติ',
    path: '/app/admin/approve',
    icon: 'basil:user-clock-solid',
  },
  {
    title: 'บำรุงรักษา',
    path: '/app/admin/maintenance',
    icon: 'wpf:maintenance',
  },
  {
    title: 'ธุรกรรม',
    path: '/app/admin/transaction',
    icon: 'icon-park-solid:transaction-order',
  }
];

export default navConfig;
