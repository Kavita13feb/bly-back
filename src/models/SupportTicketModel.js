const mongoose = require("mongoose");

const SupportTicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who created the ticket
    subject: { type: String, required: true }, // Brief title of the issue
    description: { type: String, required: true }, // Detailed description of the issue
    status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" }, // Ticket status
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" }, // Priority level
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin handling the ticket
    createdAt: { type: Date, default: Date.now }, // Creation date
    updatedAt: { type: Date, default: Date.now }, // Last update timestamp
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportTicket", SupportTicketSchema);
