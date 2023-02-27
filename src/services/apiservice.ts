import axios from 'axios';

const api = "http://localhost:9090";
export const login = async(path:string,username:string,password:string) => {
  let message;
  await axios.post(api+path, {
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
  await axios.post(api+path, {
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
//Dashboard
export const getDashboard=async(path:string,token:string)=>{
  try{
    const response = await axios.get(api+path,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
}
//User
export const getUsers = async(path:string,token:string) => {
  try{
    const response = await axios.get(api+path,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
}

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
//Assets
export const getAssets = async (path:string,token:string):Promise<any>=> {
  try{
    const response = await axios.get(api+path,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};

export const addAssets = async(path:string,token:string,name_assets:string,rfid_address:string,expire_hour:number) => {
  try{
    const attibute_assets = { name_assets, rfid_address ,expire_hour };
    const response = await axios.post(api+path,attibute_assets,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    window.history.pushState({},"Error","/app/asset/list");
    window.location.reload();
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};

export const getRfidAssets = async (path:string):Promise<any>=> {
  try{
    const response = await axios.get(api+path
    //   ,
    //   {
    //   headers:{
    //     Authorization: `Bearer ${token}`
    //   }
    // }
    )
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};
//Match
export const getMatching = async (path:string,token:string):Promise<any> => {
  try{
    const response = await axios.get(api+path,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};

export const getMatchAssets = async (path:string,token:string):Promise<any>=> {
  try{
    const response = await axios.get(api+path,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};

export const getRequestRent = async (path:string,token:string) => {
  try{
    const response = await axios.get(api+path,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};

export const getRentMatch = async (path:string,token:string):Promise<any> => {
  try{
    const response = await axios.get(api+path,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};

export const addMatching=async (path:string,token:string,id_assets:string,mac_address:string,room:string,floor:string)=>{
  try{
    const attibute_match = { id_assets, mac_address ,room ,floor };
    const response = await axios.post(api+path,attibute_match,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    window.history.pushState({},"Success","/app/match/list");
    window.location.reload();
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
}

export const SelectMatchNode = async (path:string,id:any) => {
  try{
    const attibute_matchnode = { id_assets:id };
    const response = await axios.post(api+path,attibute_matchnode,{
      // headers:{
      //   Authorization: `Bearer ${token}`
      // }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};
//UserMatch
export const addUserMatching=async (path:string,token:string,id_match:string,room:string,floor:string,description:string)=>{
  try{
    const attibute_user_match = { id_match, description ,room ,floor };
    const response = await axios.post(api+path,attibute_user_match,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    window.history.pushState({},"Success","/app/usermatch/list");
    window.location.reload();
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
}
//Node
export const getNode = async (path:string):Promise<any> => {
  try{
    const response = await axios.get(api+path
    //   ,{
    //   headers:{
    //     Authorization: `Bearer ${token}`
    //   }
    // }
    )
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};
//Approve
export const getApprove = async (path:string,token:any) => {
  try{
    const response = await axios.get(api+path,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};

export const ApproveUserMatch = async (path:string,token:string,id:number,status_Approve:any) => {
  try{
    const attibute_approveuser_match={UserMatch_status_user_match:status_Approve}
    const response = await axios.post(api+path+id,attibute_approveuser_match,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
}
//Transaction
export const getTransaction =async(path:string,token:string)=> {
  try{
    const response = await axios.get(api+path,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};

export const Checktoken =async(path:string,token:string)=> {
  try{
    const attibute_checktoken = { token: token };
    const response = await axios.post(api+path,attibute_checktoken,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
};
