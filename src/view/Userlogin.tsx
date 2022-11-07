import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import serviceapi from "../services/apiservice";
// import { UsersProps} from "../interfaces/User";

const Login :React.FC = () =>{
    const navigate = useNavigate();
    const [inputs,setInputs] = useState({
        username:"",
        password:""
    });
    const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInputs(values => ({...values,[name]:value}))
    }

    const handleSubmit = async(event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            username: { value: string };
            password: { value: string };
          };
          const username = target.username.value; // typechecks!
          const password = target.password.value; // typechecks!
          serviceapi.login("/User/Login",username,password).then((results)=>{
            const login = JSON.parse(JSON.stringify(results))
            if(login.status === "ok"){
                alert(login.message);
                navigate('/');
            }
            else{
                alert(login.message);
            }
          })
        // var myHeaders = new Headers();
        // myHeaders.append("Content-Type","application/json");

        // var raw = JSON.stringify({
        //     "username": inputs.username,
        //     "password": inputs.password
        // })
    }
    return(
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                 type="text"
                 name="username"
                 value={inputs.username || ""}
                 onChange={handleChange}
                >
                </input>
                <input
                 type="password"
                 name="password"
                 value={inputs.password || ""}
                 onChange={handleChange}
                >
                </input>
                <input type="submit"/>
            </form>
        </>
    )
};
export default Login
