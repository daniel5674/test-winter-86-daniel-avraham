import dbConnect from "@/lib/mongodb";
import Company from "@/models/Company";
import { revalidatePath } from "next/cache"; // Used to refresh cached page data after DB changes (so UI updates immediately)

// Server Action: runs ONLY on the server, so it can safely access the database
async function deleteCompany(formData) {
  "use server"; // Marks this function as a Server Action in Next.js App Router

  // FormData contains all submitted <input name="..."> values from the form
  const id = formData.get("id");

  // Ensure MongoDB connection exists before running any query
  await dbConnect();

  // Delete one company document by its MongoDB _id
  await Company.findByIdAndDelete(id);

  // Re-render this route so the deleted company disappears without manual refresh
  revalidatePath("/customers/companies");
}

// Server Action: creates a new company document in MongoDB based on form inputs
async function addCompany(formdata) {
  "use server";

  // Read input values by their "name" attribute from the HTML form
  const name = formdata.get("name");
  const size = formdata.get("size");
  const industry = formdata.get("industry");
  const budget = formdata.get("budget");

  await dbConnect();

  // Insert a new company into the database (Mongo collection managed by Mongoose model)
  await Company.create({ name, size, industry, budget });

  // Revalidate page so the new company appears immediately after submission
  revalidatePath("/customers/companies");
}

export default async function CompaniesPage() {
  // Server Component: runs on the server, so we can fetch data directly from MongoDB here
  await dbConnect();

  // Fetch all companies from the database
  const companies = await Company.find();

  // Find the company with the highest number of employees (size) using reduce
  const largestCompany =
    companies.length > 0
      ? companies.reduce(
          (max, company) => (company.size > max.size ? company : max),
          companies[0]
        )
      : null;

  return (
    <div>
      <h1>Leading Market Companies</h1>

      {/* Simple HTML form that triggers a Server Action (no fetch/axios needed) */}
      <form action={addCompany}>
        <p>
          Name: <input type="text" name="name" required /> {/* required = browser validation */}
        </p>
        <p>
          Size: <input type="number" name="size" required /> {/* number input for employees */}
        </p>
        <p>
          Industry: <input type="text" name="industry" required />
        </p>
        <p>
          Budget: <input type="number" name="budget" required /> {/* number input for budget */}
        </p>
        <button type="submit">Add Company</button>
      </form>

      <hr />

      {/* Render each company as a simple <p> line, as requested in the task */}
      {companies.map((company) => (
        <div key={company._id}>
          <p>
            Name: {company.name} | Industry: {company.industry} | Employees:{" "}
            {company.size} | Budget: {company.budget}
          </p>

          {/* Delete is done via a form so we can send the company id as FormData */}
          <form action={deleteCompany}>
            {/* Mongo ObjectId must be converted to string for input value */}
            <input type="hidden" name="id" value={company._id.toString()} />
            <button type="submit">Delete</button>
          </form>

          <hr />

          {/* Show summary about the largest company (name + industry) */}
          {largestCompany && (
            <p>
              The largest company is: {largestCompany.name} from the{" "}
              {largestCompany.industry} section.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}