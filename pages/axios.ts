import { default as axiosLib } from 'axios';

export const axios = axiosLib.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
