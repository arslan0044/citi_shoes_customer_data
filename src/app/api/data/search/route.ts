import { NextRequest, NextResponse } from "next/server";

async function fetchCustomers() {
  const response = await fetch("numberdata-2g5i7oso1-arslan0044s-projects.vercel.app/api/data/", {
    method: "GET",
  });

  const customers = await response.json();
  return customers;
}

export async function GET(request: NextRequest) {
  const customers = await fetchCustomers();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ;

  const filteredCustomers = customers.filter((data:any) => {
    // const {city, name , number, company} = a
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
