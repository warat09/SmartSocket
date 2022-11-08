import axios from 'axios';
// import {Node,Assets,Matching} from '../model/model'

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

const getAssets = async ():Promise<any>=> {
  const url = "http://localhost:9090/Asset/AllAsset";
  let list:any
  await axios
    .get(url)
    .then((response) => {
      const results = response.data;
      list = response.data;
      const { status, data } = results;
        // SetDataassetslist(response.data);    
        // console.log(new Date(response.data[0].date_assets).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' }))
        // console.log(response.data)

    })
    .catch((err) => {
      console.log(err);
    });
     return list
};

const addAssets = async(name_assets:string,expire_hour:number) => {
  const url = "http://localhost:9090/Asset/AddAsset";
  const attibute_assets = { name_assets, expire_hour };
  await axios
    .post(url, attibute_assets)
    .then((response) => {
      const results = response.data;
      const { status, data } = results;
      if (status !== "SUCCESS") {
        alert(status);
      } else {
        console.log(data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getNode = () => {
  const url = "http://localhost:9090/Node/GetAllMacAddress";
  let list:any
  axios
    .get(url)
    .then((response) => {
      const results = response.data;
      const { status, data } = results;
      if (status !== "SUCCESS") {
        alert(status);
      } else {
        console.log(data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
    return list
};
export default {login,getAssets,addAssets,getNode};