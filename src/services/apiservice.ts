import axios from 'axios';
// import {Node,Assets,Matching} from '../model/model'

const link = "http://localhost:9090";
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

export const getAssets = async ():Promise<any>=> {
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

export const addAssets = async(name_assets:string,expire_hour:number) => {
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

export const addMatching=async (id_assets:string,mac_address:string,room:string,floor:string)=>{
  const url = "http://localhost:9090/Match/MatchingAssets";
  const attibute_matching = {id_assets,mac_address,room,floor };
  console.log(attibute_matching)
  await axios
  .post(url,attibute_matching)
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

export const getMatching = async ():Promise<any> => {
  const url = "http://localhost:9090/Match/AllMatching";
  let list:any
  await axios
    .get(url)
    .then((response) => {
      const results = response.data;
      console.log(response)
      list = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
    return list
};

export const SelectMatchNode = async (id:any) => {
  console.log("id is ",id)
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
  const url = "http://localhost:9090/Transection/AllTransection";
  let list:any
    const a = await axios.get(url)
    list = a.data;
     return list
};
