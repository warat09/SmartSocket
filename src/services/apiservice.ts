import axios from 'axios';

const link = "http://localhost:9090";
const login = async(path:string,username:string,password:string) => {
  let message;
  await axios.post(link+path, {
    username: username,
    password: password
  }).then(async(response)=>{
      message = response.data
  }).catch(error=> {
    if (axios.isAxiosError(error) && error.response) {
        message = error.response.data;
    } else{
        message = String(error);
    }
  });
  return message
}
export default {login};