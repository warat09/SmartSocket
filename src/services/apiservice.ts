import axios from 'axios';
// import {Node,Assets,Matching} from '../model/model'

const link = "http://localhost:9090";
export const register = async(name:string,surname:string,username:string,password:string,email:string,role:string,departure:string) => {
  const url = "http://localhost:9090/User/Register";
  let message;
  await axios.post(url, {
    name:name,
    surname:surname,
    username:username,
    password:password,
    email:email,
    role:role,
    departure:departure,
    status:"active"
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

export const login = async(path:string,username:string,password:string) => {
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

export const checktoken = async(path:string,username:string,password:string) => {
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

export const getAssets = async (token:string):Promise<any>=> {
  const url = "http://localhost:9090/Asset/AllAsset";
  const config = { headers: { Authorization: `Bearer ${token}` } }
  let list:any
  await axios
    .get(url,config)
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

export const getMatchAssets = async (token:string):Promise<any>=> {
  const url = "http://localhost:9090/Asset/SelectMatchAsset";
  const config = { headers: { Authorization: `Bearer ${token}` } }
  let list:any
  await axios
    .get(url,config)
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

export const addAssets = async(token:string,name_assets:string,expire_hour:number) => {
  const url = "http://localhost:9090/Asset/AddAsset";
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const attibute_assets = { name_assets, expire_hour };
  await axios
    .post(url,attibute_assets,config)
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

export const addMatching=async (token:string,id_assets:string,mac_address:string,room:string,floor:string)=>{
  const url = "http://localhost:9090/Match/MatchingAssets";
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const attibute_matching = {id_assets,mac_address,room,floor };
  await axios
  .post(url,attibute_matching,config)
  .then((response)=>{
    const results = response.data;
    const { status, data } = results;
    console.log(response.data)
    if (status !== "SUCCESS") {
      alert(status);
    } else {
      console.log(data);
    }
  })
  .catch((err) => {
    console.log(err);
  });
}

export const addUserMatching=async (token:string,id_match:string,room:string,floor:string,description:string)=>{
  const url = "http://localhost:9090/Usermatch/AddUsermatch";
  const attibute_matching = { token,id_match,room,floor,description };
  const config = { headers: { Authorization: `Bearer ${token}` } }
  await axios
  .post(url,attibute_matching,config)
  .then((response)=>{
    const results = response.data;
    const { status, data } = results;
    console.log(response.data)
    if (status !== "SUCCESS") {
      alert(status);
    } else {
      console.log(data);
    }
  })
  .catch((err) => {
    console.log(err);
  });
}

export const getNode = async ():Promise<any> => {
  const url = "http://localhost:9090/Node/AllMACAddress";
  let list:any
  await axios
    .get(url)
    .then((response) => {
      const results = response.data;
      list = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
    return list
};

export const getMatching = async (token:string):Promise<any> => {
  const url = "http://localhost:9090/Match/AllMatching";
  const config = { headers: { Authorization: `Bearer ${token}` } }
  let list:any
  await axios
    .get(url,config)
    .then((response) => {
      const results = response.data;
      list = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
    return list
};

export const getRequestRent = async (token:string) => {
  const url = "http://localhost:9090/Usermatch/GetRequestRent";
  const config = { headers: { Authorization: `Bearer ${token}` } }
  let list:any
  await axios
    .get(url,config)
    .then((response) => {
      list = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
    return list
};

export const getApprove = async (token:any) => {
  const url = "http://localhost:9090/UserMatch/GetApprove";
  const config = { headers: { Authorization: `Bearer ${token}` } }
  let list:any
  await axios
    .get(url,config)
    .then((response) => {
      list = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
    return list
};

export const ApproveUserMatch = async (id:number,token:string) => {
  const url = "http://localhost:9090/UserMatch/Approve/";
  const config = { headers: { Authorization: `Bearer ${token}` } }
  await axios.put(url+id,config).catch(error => console.log(error))
}

export const getRentMatch = async (token:string):Promise<any> => {
  const url = "http://localhost:9090/Match/SelectRentMatch";
  const config = { headers: { Authorization: `Bearer ${token}` } }
  let list:any
  await axios
    .get(url,config)
    .then((response) => {
      const results = response.data;
      list = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
    return list
};

export const SelectMatchNode = async (id:any) => {
  const url = "http://localhost:9090/Node/SelectNode";
  let list:any
  await axios
    .post(url,{
      id_assets:id
    })
    .then((response) => {
      list = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
    return list
};

export const getTransection =async()=> {
  const url = "http://localhost:9090/Transaction/AllTransaction";
  let list:any
  await axios
    .get(url)
    .then((response) => {
      list = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
    return list
};
export const getDashboard=async(token:string)=>{
  const url = "http://localhost:9090/Dashboard/AllDashboard";
  const config = { headers: { Authorization: `Bearer ${token}` } }
  let list:any 
  await axios
    .get(url,config)
    .then((response) => {
      const results = response.data;
      list = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
    return list
}
export const Checktoken =async(token:string)=> {
  const url = "http://localhost:9090/User/CheckToken";
  let list:any 
  await axios
    .post(url,{
      token: token
    })
    .then((response) => {
      if(response.status !== 200){
        list = false;
      }
      else{
        list = true;
      }
    })
    .catch((err) => {
      console.log(err);
    });
    return list;
};
