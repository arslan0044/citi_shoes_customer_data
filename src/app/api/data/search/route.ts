import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbConfig/dbConfig";
import UDdata from "../../../../models/dataModel";

connect();

export async function GET(request: NextRequest) {
  const customers = await UDdata.find();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ;

  const filteredCustomers = customers.filter((data:any) => {
    const name = data.name || "";
    const company = data.number || "";
    const city = data.city || "";
    const result =
      name.toLowerCase().includes(query?.toLowerCase()) ||
      city.toLowerCase().includes(query?.toLowerCase()) ||
      company.toLowerCase().includes(query?.toLowerCase());
    return result;
  });

  return NextResponse.json(filteredCustomers);
}
