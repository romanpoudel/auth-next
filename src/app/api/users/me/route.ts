import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) {
      return NextResponse.json({ status: 400, error: "User doesnot exist" });
    }
    return NextResponse.json({ status: 200, data: user });
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error.message });
  }
}
