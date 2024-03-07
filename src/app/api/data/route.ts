import { connect } from "../../../dbConfig/dbConfig";
import UDdata from "../../../models/dataModel";

connect();
import { NextResponse,NextRequest } from "next/server";

export async function GET() {
  try {
    const data = await UDdata.find();
    return NextResponse.json(data);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req:NextRequest, res:NextResponse) {
  try {
    const data = await req.json();
    const {name,number,city  } = data;

    const newService = new UDdata({
     name,number,city
    });
    const savedService = await newService.save();

    return NextResponse.json({
      message: "Add number successfully",
      success: true,
      savedService,
    });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
