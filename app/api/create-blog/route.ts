import { NextResponse } from "next/server";


export async function POST(req: Request) {
  console.log("hello form the server");

  return NextResponse.json({ success: true });
}
