import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props:any) {

  const {body,header} = props.alert

  const [openDialog, setOpenDialog] = React.useState(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
      <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{header}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {body}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Disagree</Button>
            <Button
              // onClick={() => Checkapprove(dialog.id, dialog.status)}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
  );
}