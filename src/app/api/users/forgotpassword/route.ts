import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const {email} = await request.json();

    //check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json({ status: 400, error: "User doesnot exists" });
    }

    //send email
    await sendEmail({ email, emailType: "RESET", userId: user._id });

    return NextResponse.json({
      status: 201,
      message: "Email sent successfully",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
