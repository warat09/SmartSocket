import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearBuffer() {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            return 0;
          }
          const diff = Math.random() * 20;
          return Math.min(oldProgress + diff, 100);
        });
      }, 500);
  
      return () => {
        clearInterval(timer);
      };
    }, []);

  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems:'center'
      }}>
        <LinearProgress sx={{width:'20%',height: 5,borderRadius: 5}} variant="determinate" value={progress} color="inherit"/>
    </Box>
  );
}