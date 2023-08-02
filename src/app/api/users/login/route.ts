import {connect} from "@/lib/db/db";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {email, password} = reqBody;
    console.log(reqBody);

    // check if user exists in DB
    const userinDB = await User.findOne({email})
    console.log(userinDB)
    if (!userinDB) {
      return NextResponse.json({error: "User does not exists"}, {status: 400})
    }

    // check password input with one in DB
    const validPassword = await bcryptjs.compare(password, userinDB.password)
    if (!validPassword){
      return NextResponse.json({error: "Password invalid"}, {status: 400})
    }
    // create token data
    const tokenData = {
      id: userinDB._id,
      username: userinDB.username,
      email: userinDB.email,
    }
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, 
      {expiresIn: "1d"})
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    })
    return response;
  
  } catch (error: any) {
    return NextResponse.json({error: error.message }, {status: 500})
  }
}