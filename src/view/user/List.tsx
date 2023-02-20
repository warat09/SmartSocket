import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { register } from "../../services/apiservice";
import { useNavigate } from "react-router-dom";
import { Container,
  Stack,
  Typography,
  Button,
  Box 
} from "@mui/material";
import Iconify from "../../components/iconify/Iconify";
 
const ListUser: React.FC = () => {

  const navigate = useNavigate();

  //user
  const [name, setName] = useState("");

  const [surname, setSurname] = useState("");

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [departure, setDeparture] = useState("");

  const handleSubmit=async()=>{
    console.log(await register(name,surname,username,password,email,role,departure))
  }

  return (
    <>
      <Helmet>
          <title> User: List | SmartSocket </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5,mt:2 }}>
          <Typography variant="h4" gutterBottom>
            User List
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon={"eva:plus-fill"}/>} onClick={() => navigate('/app/user/new')}>
            New User
          </Button>
        </Stack>
      </Container>
    </>
    // <div className="container">
    //   <h1>Create</h1>
    //   <hr/>
    //   <div className="information">
    //     <form action="">
    //       <label>username</label>
    //       <input
    //         type="text"
    //         className="form-control"
    //         placeholder="Enter name"
    //         onChange={(e) => {
    //           setUsername(e.target.value);
    //         }}
    //       ></input>

    //       <label>password</label>
    //       <input
    //         type="text"
    //         className="form-control"
    //         placeholder="Enter name"
    //         onChange={(e) => {
    //           setPassword(e.target.value);
    //         }}
    //       ></input>

    //       <label>name</label>
    //       <input
    //         type="text"
    //         className="form-control"
    //         placeholder="Enter name"
    //         onChange={(e) => {
    //           setName(e.target.value);
    //         }}
    //       ></input>

    //       <label>surname</label>
    //       <input
    //         type="text"
    //         className="form-control"
    //         placeholder="Enter name"
    //         onChange={(e) => {
    //           setSurname(e.target.value);
    //         }}
    //       ></input>

    //       <label>email</label>
    //       <input
    //         type="text"
    //         className="form-control"
    //         placeholder="Enter name"
    //         onChange={(e) => {
    //           setEmail(e.target.value);
    //         }}
    //       ></input>

    //       {/* <label>telephone</label>
    //       <input
    //         type="text"
    //         className="form-control"
    //         placeholder="Enter name"
    //         onChange={(e) => {
    //           setPhone(e.target.value);
    //         }}
    //       ></input> */}

    //       <label>role</label>
    //       <input
    //         type="text"
    //         className="form-control"
    //         placeholder="Enter name"
    //         onChange={(e) => {
    //           setRole(e.target.value);
    //         }}
    //       ></input>

    //       <label>departure</label>
    //       <input
    //         type="text"
    //         className="form-control"
    //         placeholder="Enter name"
    //         onChange={(e) => {
    //           setDeparture(e.target.value);
    //         }}
    //       ></input>
    //       <div className="button-submit">
    //         <button onClick={handleSubmit}>ADD Assets</button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
};
export default ListUser;
