import axios from "axios";
import Cookies from "js-cookie";
const BASE_URL = "http://localhost:3000/api/";
const TOKEN = Cookies.get("tokenTeacher");
// const TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJKb2huRG9lIiwiZW1haWwiOiJqb2huZG9lQGV4YW1wbGUuY29tIiwiYXZhdGFyIjoiaHR0cHM6Ly9ob2NtYWkudm4vZmlsZS5waHAvMS9BdmF0YXItbGUta2hhbmgtdnkucG5nIiwicm9sZSI6InRlYWNoZXIiLCJpYXQiOjE3MDQ1MzM0ODksImV4cCI6MTcwNDc5MjY4OX0.ZSzUF29y4mxwNIMNs0ImH-9OOR2u7M4PZVWJb3u45ww";
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const TokenRequest = axios.create({
  baseURL: BASE_URL,
  headers: { authorization: `Bearer ${TOKEN}` },
});
