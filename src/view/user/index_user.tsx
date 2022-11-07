import React, { useEffect, useState } from "react";
import axios from "axios";

const user :React.FC=()=>{
    const [Datauser,setDataUser]=useState([]);

    const Getalluser=()=>{
        const url="" 
        axios.get(url)
        .then(response=>{
            const results=response.data;
            const{status,message,data}=results;
            if(status !== 'SUCCESS'){
                alert(status);
            }
            else{
                setDataUser(data)
                console.log(data)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    
    useEffect(()=>{
        Getalluser();
    },[])

    }
    return(
        <div>
            <h1>user</h1>
        </div>
    )
};
export default user