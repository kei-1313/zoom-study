"use server"

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const API_SECRET = process.env.NEXT_PUBLIC_STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  //clerkのuserをサーバ側で取得できる
  const user = await currentUser();

  if(!user) throw new Error("User is not logged in");
  if(!API_KEY) throw new Error("No API Key");
  if(!API_SECRET) throw new Error("No SECRET Key");

  const streamClient = new StreamClient(API_KEY , API_SECRET)

  //MTGの期限 1時間 
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  //発行日
  const issuedAt = Math.floor((Date.now() / 1000) - 60);
  // tokenの作成
  const token = streamClient.createToken(user.id, exp, issuedAt);

  return token;
}