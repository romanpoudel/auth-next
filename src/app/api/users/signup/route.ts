import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log(reqBody);

    //check if user exists
    const user = await User.findOne({ email: email });
    if (user) {
      return NextResponse.json({ status: 409, error: "User already exists" });
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    return NextResponse.json({
      status: 201,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
