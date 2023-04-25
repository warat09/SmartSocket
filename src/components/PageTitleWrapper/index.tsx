import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, styled } from '@mui/material';

const PageTitle = styled(Box)(
  ({ theme }) => ({
    boxShadow:theme.shadows[5],
    backgroundColor:"#f2f5f9",
    borderRadius:10,
    padding:theme.spacing(2),
    // margin:theme.spacing(4)
    marginBottom:20
  })
);
// const StyledRoot = styled(AppBar)(({ theme }) => ({
//   //   ...bgBlur({ color: theme.palette.background.default }),
//     backgroundColor:'#192846',
//     boxShadow: '1px',
//     [theme.breakpoints.up('lg')]: {
//       width: `calc(100% - ${NAV_WIDTH + 1}px)`,
//     },
//   }));
interface PageTitleWrapperProps {
  children?: ReactNode;
}

const PageTitleWrapper: FC<PageTitleWrapperProps> = ({ children }) => {
  return (
    <PageTitle>
      <Container maxWidth="lg" sx={{display:'flex',alignItems:'center'}}>
        {children}
      </Container>
    </PageTitle>
  );
};

PageTitleWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default PageTitleWrapper;
