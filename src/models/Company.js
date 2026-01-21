import mongoose from "mongoose";

// Define a Mongoose schema that represents a Company document in MongoDB
// The schema describes the structure and data types of each company
const companySchema = new mongoose.Schema({
  // Company name (string) – required field
  name: {
    type: String,
    required: true,
  },

  // Number of employees in the company
  // Stored as a Number so we can perform numeric comparisons and calculations
  size: {
    type: Number,
    required: true,
  },

  // Industry or sector the company belongs to (e.g., Technology, Finance)
  industry: {
    type: String,
    required: true,
  },

  // Company budget stored as a Number for future calculations or summaries
  budget: {
    type: Number,
    required: true,
  },
});

// Export the Company model
// The conditional check prevents model re-compilation errors in Next.js
// when files are reloaded during development
export default mongoose.models.Company ||
  mongoose.model("Company", companySchema);