import { connect } from "../../../dbConfig/dbConfig";
import UDdata from "../../../models/dataModel";

connect();
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract page, limit, and search query parameters
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "100", 10); // Default limit to 100
    const query = searchParams.get("query") || ""; // Search query (name, city, number)

    // Ensure page and limit are valid numbers
    const skip = (page - 1) * limit;

    // Build a dynamic query object for searching
    const searchQuery: any = {};
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { number: { $regex: query, $options: "i" } },
      ];
    }

    // Get the total number of matching documents for pagination
    const total = await UDdata.countDocuments(searchQuery);

    // Fetch the data based on the search query, page, and limit
    const data = await UDdata.find(searchQuery).skip(skip).limit(limit);

    // Return the response with data and pagination details
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, number, city } = data;

    // Check for missing fields and specify which field is missing
    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!number) missingFields.push("Number");
    if (!city) missingFields.push("City");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `Missing required fields: ${missingFields.join(", ")}.`,
          success: false,
        },
        { status: 400 }
      );
    }

    // Save the data
    const newService = new UDdata({
      name,
      number,
      city,
    });

    const savedService = await newService.save();

    return NextResponse.json(
      {
        message: "Number added successfully.",
        success: true,
        data: savedService,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];

      try {
        // Query the database to find the existing record
        const existingRecord = await UDdata.findOne({ [field]: value });

        if (existingRecord) {
          return NextResponse.json(
            {
              message: `Duplicate entry for ${field}: ${value}. Name: ${existingRecord.name}, City ${existingRecord.city}`,
              success: false,
              existingRecord: {
                name: existingRecord.name,
                city: existingRecord.city,
                number: existingRecord.number,
              },
            },
            { status: 409 }
          );
        }
      } catch (dbError) {
        // If the query fails, return a generic duplicate error
        return NextResponse.json(
          {
            message: `Duplicate entry for ${field}: ${value}.`,
            success: false,
            error: "Unable to retrieve existing record details.",
          },
          { status: 409 }
        );
      }
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        {
          message: "Validation failed.",
          success: false,
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Generic error handling
    return NextResponse.json(
      {
        message: "An unexpected error occurred.",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
