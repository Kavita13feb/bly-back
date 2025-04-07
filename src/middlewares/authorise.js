


const authorise = (role_array) => {
    return (req, res, next) => {
      const userrole = req.userrole;
      const userId = req.userId;
  
      console.log("User Role:", userrole, "Allowed Roles:", role_array);
  
      if (!userrole) {
        return res.status(401).json({ message: "Unauthorized: No role assigned" });
      }
  
      if (role_array.includes(userrole)) {
        console.log(userrole)
        return next();
      }
  
      res.status(403).json({ message: "Not authorised to access this resource" });
    };
  };
  
  

module.exports = {authorise}
