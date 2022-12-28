import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Approve } from "../../model/model";
import {
  getMatchAssets,
  SelectMatchNode,
  getMatching,
  getApprove,
  Checktoken,
  ApproveUserMatch,
} from "../../services/apiservice";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Container,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const HomeApprove: React.FC = () => {
  const navigate = useNavigate();
  const [listapprove, setlistapprove] = useState<Approve[]>([]);
  const [open, setOpen] = React.useState(false);
  const [dialog, setdialog] = React.useState({
    header: "",
    body: "",
    id: 0,
    status: 0,
  });
  const [openAlert, setOpenAlert] = React.useState(false);
  const [token, SetToken] = useState("");

  const ComponentMatch = async (token: string) => {
    setlistapprove(await getApprove(token));
  };

  const handleClickOpen = (id: number, status: number, asset: string) => {
    setOpen(true);
    if (status == 1) {
      setdialog({
        header: "Approve?",
        body: `Do you want approve asset ${asset}`,
        id: id,
        status: status,
      });
    } else {
      setdialog({
        header: "Reject?",
        body: `Do you want reject asset ${asset}`,
        id: id,
        status: status,
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const Checkapprove = async (id: number, status: number) => {
    console.log(id, status);
    
    if (status === 1) {
      handleClose();
      handleClick()
      // handleClickOpen(status,asset)
      console.log(listapprove);
      console.log("approve");
      const status_Approve="Approve"
      await ApproveUserMatch(id, token, status_Approve)
     
    } else {
      // handleClickOpen(status,asset)
      handleClose();
      handleClick()
      const status_Approve="Reject"
      await ApproveUserMatch(id, token, status_Approve)
      console.log("reject");
    }
  };

  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      Checktoken(user.token).then((response) => {
        if (response.status === "ok") {
          if(response.data[0].role === "admin"){
            ComponentMatch(user.token);
            SetToken(user.token);
          }
          else{
            navigate('/')
          }
        } else {
          localStorage.clear();
        }
      });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <Container>
      <br />
      <h1>Approve</h1>
      <hr />
      <br></br>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>status&nbsp;</TableCell>
              <TableCell align="center">action</TableCell>
              <TableCell align="right">assets</TableCell>
              <TableCell align="right">room&nbsp;</TableCell>
              <TableCell align="right">floor&nbsp;</TableCell>
              <TableCell align="right">description&nbsp;</TableCell>
              <TableCell align="right">Date&nbsp;</TableCell>
              <TableCell align="right">name&nbsp;</TableCell>
              <TableCell align="right">surname&nbsp;</TableCell>
              <TableCell align="right">username&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listapprove.map((row: any) => (
              <TableRow
                key={row.UserMatch_status_user_match}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.UserMatch_status_user_match}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() =>
                      handleClickOpen(
                        row.UserMatch_id_user_match,
                        1,
                        row.Asset_name_assets
                      )
                    }
                  >
                    Approve
                  </Button>
                  &nbsp;
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() =>
                      handleClickOpen(
                        row.UserMatch_id_user_match,
                        0,
                        row.Asset_name_assets
                      )
                    }
                  >
                    Reject
                  </Button>
                  {/* <Dialog variant={"contained"} color={"success"} btn={"Approve"} test={Checkapprove}/>
                <Dialog variant={"contained"} color={"error"} btn={"Reject"}/> */}
                </TableCell>
                <TableCell align="right">{row.Asset_name_assets}</TableCell>
                <TableCell align="right">{row.UserMatch_room}</TableCell>
                <TableCell align="right">{row.UserMatch_floor}</TableCell>
                <TableCell align="right">{row.UserMatch_description}</TableCell>
                <TableCell align="right">
                  {new Date(row.UserMatch_datetime).toLocaleString("sv-SE", {
                    timeZone: "Asia/Bangkok",
                  })}
                </TableCell>
                <TableCell align="right">{row.User_name}</TableCell>
                <TableCell align="right">{row.User_surname}</TableCell>
                <TableCell align="right">{row.User_username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialog.header}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog.body}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button
            onClick={() => Checkapprove(dialog.id, dialog.status)}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          This is a success message!
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default HomeApprove;
