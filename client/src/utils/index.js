import "whatwg-fetch";
import { jwtConfig } from "../config";
import upload from "superagent";

var token = localStorage.getItem("jwt") || "";
var user = localStorage.getItem("rompiendo") || "{}";

export const callApi = (url, data, method) => {
  console.log("Calling API... " + url);
  return new Promise(function(resolve, reject) {
    let options = {
      method: method || "GET",
      mode: "cors",
      redirect: "follow",
      compress: true,
      credentials: "include",
      headers: { Authorization: "Bearer " + token, user }
    };
    if (method === "POST") {
      options.body = JSON.stringify(data);
      options.headers.Accept = "application/json";
      options.headers["Content-Type"] = "application/json";
    }
    fetch(`${jwtConfig.fetchUrl}api${url}`, options)
      .then(res => {
        console.log(res);
        if (res.ok) return res.json();
        reject(new Error(res.statusText));
      })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

export const callApiToDownloadExcel = (url, data, method) => {
  console.log("Calling API... " + url);
  return new Promise(function(resolve, reject) {
    let options = {
      method: method || "GET",
      mode: "cors",
      redirect: "follow",
      compress: true,
      credentials: "include",
      headers: { Authorization: "Bearer " + token, user }
    };
    if (method === "POST") {
      options.body = JSON.stringify(data);
    }
    fetch(`${jwtConfig.fetchUrl}api${url}`, options)
      .then(res => {
        console.log(res);
        if (res.ok) return res.arrayBuffer();
        reject(new Error(res.statusText));
      })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

export const callApiWithFormData = (url, data, method, file) => {
  let photo = new FormData();
  photo.append("file", file);
  photo.append("data", JSON.stringify(data));
  console.log("Calling API... " + url);
  return new Promise(function(resolve, reject) {
    let options = {
      method: method || "GET",
      mode: "cors",
      redirect: "follow",
      credentials: "include",
      headers: { Authorization: "Bearer " + token, user }
    };
    if (method === "POST") {
      options.body = photo;
      options.headers.Accept = "application/json";
    }
    fetch(`${jwtConfig.fetchUrl}api${url}`, options)
      .then(res => {
        if (res.ok) return res.json();
        reject(new Error(res.statusText));
      })
      .then(data => resolve(data))
      .catch(err => {
        reject(err);
      });
  });
};
