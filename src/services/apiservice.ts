import axios from 'axios';

const api = "http://mistersigz.thddns.net:7572";

export const login = async(path:string,email:string,password:string) => {
  try{
    const attibute_login = { email, password };
    const response = await axios.post(api+path,attibute_login);
    const userData = {
      token:response.data.token
    };
    localStorage.setItem("User", JSON.stringify(userData));
    window.history.pushState({open:1,message:response.data.message},"Success","/");
    window.location.reload();
    return response.data;

  }
  catch(err){
    localStorage.clear();
    window.history.pushState({open:1,message:"Email or password incorrect",status:"error"},"Error","/login");
    window.location.reload();
    return null;
  }
}

export const forgotpassword = async(path:string,email:string) => {
  try{
    const response = await axios.post(api+path,{email});
    window.history.pushState({open:1,message:response.data.message},"Success","/forgotpassword");
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

export const register = async(path:string,token:string,name:string,surname:string,id_card:string,password:string,email:string,role:string,departure:string) => {
  // console.log(name,surname,username,password,email,role,departure)
  try{
    const attibute_register = { name, surname, id_card, password, email, role, departure };
    const response = await axios.post(api+path,attibute_register,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    // window.history.pushState({},"Success","/app/admin/user/list");
    window.history.pushState({open:1,message:response.data.message},"Success","");
    window.location.reload();
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  }
  // const url = "http://localhost:9090/User/Register";
  // let message;
  // await axios.post(url, {
  //   name:name,
  //   surname:surname,
  //   username:username,
  //   password:password,
  //   email:email,
  //   role:role,
  //   departure:departure,
  //   status:"active"
  // })
  // .then(async(response)=>{
  //     message = response.data
  // }).catch(error=> {
  //   if (axios.isAxiosError(error) && error.response) {
  //       message = error.response.data;
  //   } else{
  //       message = String(error);
  //   }
  // });
  // return message
}
//Node
export const updateStatusNode = async(path:string) => {
  try{
    const response = await axios.patch(api+path,{},
    //   {
    //   headers:{
    //     Authorization: `Bearer ${token}`
    //   }
    // }
    )
    window.history.pushState({open:1,message:response.data.message},"Success","");
    window.location.reload();
    return response.data;
  }
  catch(err){
      // localStorage.clear();
      // window.history.pushState({},"Error","/login");
      // window.location.reload();
      return null;
  }
}
//User
export const updateUser = async(path:string,token:string,name:string,surname:string,id_card:string,email:string,role:string,departure:string)=>{
  try{
    const response = await axios.put(api+path,{name,surname,id_card,email,role,departure},{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    const userData = {
      token:response.data.token
    };
    // localStorage.setItem("User", JSON.stringify(userData));
    window.history.pushState({open:1,message:response.data.message},"Success","");
    window.location.reload();
    return response.data;
  }
  catch(err){
      // localStorage.clear();
      // window.history.pushState({},"Error","/login");
      // window.location.reload();
      return null;
  }
}
export const updateUserStatus = async(path:string,token:string)=>{
  try{
    console.log(token)
    const response = await axios.patch(api+path,{},{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    window.history.pushState({open:1,message:response.data.message},"Success","");
    window.location.reload();
    return response.data;
  }
  catch(err){
      // localStorage.clear();
      // window.history.pushState({},"Error","/login");
      // window.location.reload();
      return null;
  }
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
    window.history.pushState({open:1,message:response.data.message},"Success","/app/admin/asset");
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

export const updateAsset = async (path:string,asset_name:string,rfid_address:string,expire_hour:string) => {
  try{
    const response = await axios.put(api+path,{asset_name,rfid_address,expire_hour}
    //   ,{
    //   headers:{
    //     Authorization: `Bearer ${token}`
    //   }
    // }
    )
    window.history.pushState({open:1,message:response.data.message},"Success","/app/admin/asset");
    window.location.reload();
    return response.data;
  }
  catch(err){
      // localStorage.clear();
      // window.history.pushState({},"Error","/login");
      // window.location.reload();
      return null;
  }

}

export const updateStatusAsset = async (path:string,token:string) => {
  try{
    console.log(api+path)
    const response = await axios.patch(api+path,{},{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    window.history.pushState({open:1,message:response.data.message},"Success","/app/admin/asset");
    window.location.reload();
    return response.data;
  }
  catch(err){
      // localStorage.clear();
      // window.history.pushState({},"Error","/login");
      // window.location.reload();
      return null;
  }
}
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

export const addMatching=async (path:string,token:string,id_assets:string,mac_address:string)=>{
  try{
    const attibute_match = { id_assets, mac_address};
    const response = await axios.post(api+path,attibute_match,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    window.history.pushState({open:1,message:response.data.message},"Success","/app/admin/match");
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
export const SelectAssetMaintenance = async (path:string,token:string)=>{
  try{
    const response = await axios.get(api+path,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    console.log(response.data)
    return response.data;
  }
  catch(err){
      localStorage.clear();
      window.history.pushState({},"Error","/login");
      window.location.reload();
      return null;
  } 
}
export const updateStatusMatch = async (path:string,token:string) =>{
  try{
    const response = await axios.patch(api+path,{},{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    window.history.pushState({open:1,message:response.data.message},"Success","/app/admin/match");
    window.location.reload();
    return response.data;
  }
  catch(err){
      // localStorage.clear();
      // window.history.pushState({},"Error","/login");
      // window.location.reload();
      return null;
  }
}
export const updateMatching = async (path:string,token:string,asset:string,node:string) => {
  try{
    const response = await axios.put(api+path,{asset,node},{
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    )
    window.history.pushState({open:1,message:response.data.message},"Success","/app/admin/match");
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
//UserMatch
export const addUserMatching=async (path:string,token:string,id_match:string,room:string,floor:string,description:string)=>{
  try{
    const attibute_user_match = { id_match, description ,room ,floor };
    const response = await axios.post(api+path,attibute_user_match,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    window.history.pushState({open:1,message:response.data.message},"Success","/app/personnel/borrow");
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

export const updateUsermatch = async (path:string,token:string,room:string,floor:string,description:string) =>{
  try{
    const response = await axios.put(api+path,{room,floor,description}
      ,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    }
    )
    window.history.pushState({open:1,message:response.data.message},"Success","/app/admin/match");
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
export const returnAsset = async(path:string,token:string,id_match:string) => {
  try{
    console.log(path,token,id_match)
    const response = await axios.put(api+path,{id_match},{
      headers:{
        Authorization: `Bearer ${token}`
      }
    } )
    window.history.pushState({open:1,message:response.data.message},"Success","/app/personnel/borrow");
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

export const ApproveUserMatch = async (path:string,token:string,attibute_approveuser_match:object) => {
  try{
    const response = await axios.patch(api+path,attibute_approveuser_match,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    window.history.pushState({open:1,message:response.data.message},"Success","");
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
//Maintenance
export const AddStatusMaintenance = async(path:string,token:string,status_maintenance:string,asset:number)=>{
  try{
    const attibute_matchnode = {status_maintenance,asset};
    const response = await axios.post(api+path,attibute_matchnode,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    window.history.pushState({open:1,message:response.data.message},"Success","/app/admin/maintenance");
    window.location.reload();
    return response.data;
  }
  catch(err){
      // localStorage.clear();
      // window.history.pushState({},"Error","/login");
      // window.location.reload();
      // return null;
  }
}
export const AddMatchMaintenance = async(path:string,token:string,id_match:string)=>{
  try{
    const attibute_matchnode = {id_match};
    const response = await axios.post(api+path,attibute_matchnode,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    window.history.pushState({open:1,message:response.data.message},"Success","/app/admin/maintenance");
    window.location.reload();
    return response.data;
  }
  catch(err){
      // localStorage.clear();
      // window.history.pushState({},"Error","/login");
      // window.location.reload();
      // return null;
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
