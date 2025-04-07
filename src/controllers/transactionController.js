const TransactionModel = require("../models/transactionModel");

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new TransactionModel(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Failed to create transaction", error: err.message });
  }
};

// Get all transactions with filters, pagination, and sorting
// exports.getAllTransactions = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       sortBy = "createdAt",
//       order = "desc",
//       type,
//       status,
//       search,
//     } = req.query;

//     const query = {};

//     if (type) query.type = type;
//     if (status) query.status = status;

//     // Support for search
//     if (search) {
//       query.$or = [
//         { userName: { $regex: search, $options: "i" } },
//         { userEmail: { $regex: search, $options: "i" } },
//         { ownerName: { $regex: search, $options: "i" } },
//         { yachtTitle: { $regex: search, $options: "i" } },
//         { txnId: { $regex: search, $options: "i" } },
//       ];
//     }

//     const total = await TransactionModel.countDocuments(query);

//     const transactions = await TransactionModel.find(query)
//       .sort({ [sortBy]: order === "asc" ? 1 : -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     res.status(200).json({
//       total,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       transactions,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
//   }
// };

exports.getAllTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      sort = "date",
      order = "desc",
      status,
      userId,
      yachtId,
     
      search,
    } = req.query;

    const filters = {};

    // ✅ Filter by Status
    if (status) filters.status = new RegExp(`^${status}$`, "i");
//     if (status) filters.Status = status;
    // ✅ Filter by User (User ID)
    if (userId) filters.userId = userId;

    // ✅ Filter by Yacht (Yacht ID)
    if (yachtId) filters.yachtId = yachtId;


    if (search) {
      const regex = new RegExp(search, "i"); // Case-insensitive
      filters.$or = [
        { userName: regex },
        { yachtTitle: regex },
        { ownerName: regex },
        { "location.city": regex },
        { "location.country": regex },
      ];
    }
    // ✅ Fetch Paginated Data
    const transactions = await TransactionModel
      .find(filters)
     //  .sort({ [sort]: order === "desc" ? -1 : 1 }) // ✅ Sorting
      .skip((page - 1) * limit) // ✅ Pagination
      .limit(parseInt(limit))
      .populate('userId', '_id name')
      .populate('yachtId', '_id title')
      .populate('ownerId', '_id name')

     //  .populate("paymentId", "txnId") // ✅ Populate Payment Info  
      .lean();

    // ✅ Formatted Output for Frontend
    const formattedtransactions = transactions.map((transaction) => ({
      id: transaction?.txnRef || transaction._id,
      _id: transaction._id,
      user: {
        name: transaction.userId?.name || "N/A",
        id: transaction.userId?._id || "N/A"
      },
      yacht: {
        name: transaction.yachtId?.title || "N/A", 
        id: transaction.yachtId?._id || "N/A"
      },
      owner: {
        name: transaction.ownerId?.name || "N/A",
        id: transaction.ownerId?._id || "N/A"
      },
     
      phone: transaction.userPhone || "N/A",
      type:transaction.type,
      
      status: transaction.status,
      
    
      amount: `$${
        transaction.amount || transaction.price ||0
      }`,
      transactionNumber: transaction.txnId || "Pending",
      transactionCode:transaction.txnRef || "Pending",
     //  refundDetails: transaction.refundDetails || null,
      date: new Date(transaction.date).toISOString().split("T")[0] // Format Date (YYYY-MM-DD)
    }));

    // ✅ Total Count for Pagination
    const total = await TransactionModel.countDocuments(filters);

    // ✅ Final Response
    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      limit: parseInt(limit),
      data: formattedtransactions,
    });
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};
// Get single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transaction", error: err.message });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
// console.log(req.body)
  const { id } = req.params; // Booking ID
  let { status } = req.body; // New status
  // Convert status to lowercase for consistency
  // Get all fields to update from request body
  const updateFields = { ...req.body };
  if (updateFields.status) {
    updateFields.status = updateFields.status.toLowerCase();
  }
  // Format date to DB format
  if (updateFields.date) {
    updateFields.date = new Date(updateFields.date);
  }

  // Format amount - remove $ and convert to number
  if (updateFields.amount) {
    updateFields.amount = parseFloat(updateFields.amount.replace('$', '').replace(',', ''));
  }

  // Format transaction reference
  if (updateFields.transactionCode) {
    updateFields.txnRef = updateFields.transactionCode;
    delete updateFields.transactionCode;
  }
  try {
    const updated = await TransactionModel.findByIdAndUpdate(
        id,
      { $set: updateFields },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    console.log(updated)
    res.status(200).json(updated);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Failed to update transaction", error: err.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await TransactionModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete transaction", error: err.message });
  }
};
