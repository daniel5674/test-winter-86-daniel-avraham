import dbConnect from "@/lib/mongodb";
import Company from "@/models/Company";

// API Route (POST):
// This endpoint is used only for seeding initial data into the database
export async function POST() {
  // Open a connection to MongoDB before performing any database operations
  await dbConnect();

  // Remove all existing company documents to avoid duplicates on re-seeding
  await Company.deleteMany({});

  // Static array of company objects used to populate the database
  // Each object matches the Company schema (name, size, industry, budget)
  const companies = [
    { name: "TECH INNOVATORS INC.", size: 500, industry: "TECHNOLOGY", budget: 2000000 },
    { name: "GREEN ENERGY SOLUTIONS", size: 300, industry: "RENEWABLE ENERGY", budget: 1500000 },
    { name: "HEALTHPLUS CORP.", size: 800, industry: "HEALTHCARE", budget: 2500000 },
    { name: "FINTECH DYNAMICS", size: 400, industry: "FINANCE", budget: 1800000 },
    { name: "EDUFUTURE LTD.", size: 250, industry: "EDUCATION", budget: 1200000 },
  ];

  try {
    // Insert all companies into MongoDB in a single operation
    const created = await Company.insertMany(companies);

    // Return a success response with the number of inserted documents
    return Response.json({
      message: "Companies seeded successfully",
      count: created.length,
    });
  } catch (error) {
    // Log the error to the server console for debugging purposes
    console.error(error);

    // Return an error response if the seeding process fails
    return Response.json(
      { error: "Failed to seed companies" },
      { status: 500 }
    );
  }
}