const buildYachtQuery = (query, isAdmin = false) => {
     let searchQuery = { $and: [] };
   
     // Basic Filters
     if (query.min_price || query.max_price) {
       const priceFilter = {};
       if (query.min_price) priceFilter.$gte = parseInt(query.min_price);
       if (query.max_price) priceFilter.$lte = parseInt(query.max_price);
       searchQuery.$and.push({ "priceDetails.daily.rate": priceFilter });
     }
   
     if (query.capacity) {
       searchQuery.$and.push({ capacity: { $gte: parseInt(query.capacity) } });
     }
   
     // User-Specific Search (By Location Only)
     if (!isAdmin && query.location) {
       const regex = new RegExp(query.location, 'i');
       searchQuery.$and.push({ "location.formattedAddress": regex });
     }
   
     // Admin-Specific Search (By Location, Owner Name, Yacht Title)
     if (isAdmin) {
       const searchConditions = [];
       
       if (query.location) {
         const regex = new RegExp(query.location, 'i');
         searchConditions.push({ "location.formattedAddress": regex });
       }
   
       if (query.ownerName) {
         const regex = new RegExp(query.ownerName, 'i');
         searchConditions.push({ "ownerName": regex });
       }
   
       if (query.title) {
         const regex = new RegExp(query.title, 'i');
         searchConditions.push({ "title": regex });
       }
   
       if (searchConditions.length > 0) {
         searchQuery.$and.push({ $or: searchConditions });
       }
   
       // Filter by status if provided
       if (query.status) {
         searchQuery.$and.push({ status: query.status });
       }
     } else {
       // Default filter for user (only show published & approved yachts)
       searchQuery.$and.push({ status: { $in: ["published", "approved"] } });
     }
   
     if (searchQuery.$and.length === 0) searchQuery = {};
   
     return searchQuery;
   };
   
   module.exports = { buildYachtQuery };
   