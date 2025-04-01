import axios from "axios"

const token = "d491f3a3-f527-4022-be5a-ad1a459e0d68"
const apiKey = "2ce9edc9-5880-4110-ab2d-4e4ef2fb6acf"

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1",
  headers: {
    Authorization: `Bearer ${token}`,
    "API-KEY": apiKey
  },
})