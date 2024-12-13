// import axios from "axios";
// import { getItems } from "./utils/SecureStoreChain";

// async function getKey() {
//   const temp = await getItems("itemKey").then(token => {
//     return token
//   });

//   return temp
// }

// const API:any = () => {
//   const api = axios.create({
//     baseURL: "http://localhost:3000",
//     timeout: 5000,
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: `Bearer ${getKey()}`
//     },
//   });

//   console.log("Authorization Header:", api.defaults.headers["Authorization"]);

//   return api
// };

// export default API;

import axios from "axios";
import { getItems } from "./utils/SecureStoreChain";

async function getKey() {
  const temp = await getItems("itemKey").then(token => {
    return token
  });

  console.log("SUCCESS")
  return temp
}

export async function API() {
  const api = await axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${await getKey()}`,
    },
  });

  console.log("Authorization Header:", api.defaults.headers["Authorization"]);

  return api;
}
