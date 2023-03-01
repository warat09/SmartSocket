import {useState,useEffect} from 'react';
import { Checktoken } from '../../services/apiservice';

const ApplicationLayout: React.FC = () => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      Checktoken("/User/CheckToken",user.token).then((response) => {
        if (response.status === "ok") {
          if(response.data.role === "user"){
          }
        } 
      });
    } 
    return(
        <>
        </>
    );

}
export default ApplicationLayout