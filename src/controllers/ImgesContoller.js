// const { getImages, saveImages } = require("../repositories/ImagesRepository");

const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} = require("firebase/storage");
const { storage } = require("../config/firebase");
const ImageModel = require("../models/ImagesModel");
const axios =require('axios')
const IMGBB_API_KEY = "3bdf3d126a213bf262dc19e326846757"

const addImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const ImageDetails = req.body;

console.log(ImageDetails)
    const file = req.file;
    const storageRef = ref(storage, `uploads/${file.originalname}`);
    const metadata = {
      contentType: "image/jpeg", 
    };
    const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: Track progress of the upload if needed
      },
      (error) => {
        console.log(error);
        return res.status(500).send(error.message);
      },
      () => {
        // Get the download URL and respond with it
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            
    const Image = await ImageModel({...req.body,imgeUrl:downloadURL});
    await Image.save()
    res.status(200).send(Image);
        });
      }
    );
   
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// const addMultipleImages = async (req, res, next) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).send("No files uploaded.");
//   }

//   try {
//     const imageDetails = req.body; // Optional: Store additional details with images
//     const uploadedImages = []; // Array to store image details after upload
// console.log(imageDetails)
//     for (const file of req.files) {
//       const storageRef = ref(storage, `uploads/${file.originalname}`);
//       const metadata = { contentType: file.mimetype };

//       // Upload file to Firebase Storage
//       const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
//       const downloadURL = await getDownloadURL(snapshot.ref);

//       // Save image details in MongoDB
//       const image = await ImageModel.create({
//         ...imageDetails,
//         imageUrl: downloadURL,
//       });

//       uploadedImages.push(image);
//     }

//     res.status(200).json({
//       message: `${uploadedImages.length} images uploaded successfully`,
//       images: uploadedImages,
//     });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };
const addMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const uploadedUrls = [];

    // Loop through each uploaded image and upload to ImgBB
    for (const file of req.files) {
      const formData = new FormData();
      formData.append("image", file.buffer.toString("base64")); // Send base64 encoded image

      // Make API call to ImgBB
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Collect image URL
      if (response.data.success) {
        const imge =ImageModel({
          imgeUrl:response.data.data.url,
          boatId:req.params.yachtId,
        })
        imge.save()
        uploadedUrls.push(response.data.data.url);
      } else {
        console.error("ImgBB upload failed for one image:", response.data.error.message);
      }
    }
    console.log(uploadedUrls)
    res.status(200).json({ message: "Images uploaded successfully", images: uploadedUrls });
  } catch (error) {
    console.error("Error uploading images:", error.message);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};

const getAllBoatImages = async (req, res) => {
    try {
    //   const boatId = req.params.boatId;
      const Images = await ImageModel.find({});
  
      res.status(200).json({ status: "success", data: Images });
    } catch (error) {
      console.error("Error retrieving user profile:", error);
      res.status(500).json({ status: "failed", message: "Server error" });
    }
  };
const getBoatImages = async (req, res) => {
  try {
    const boatId = req.params.boatId;
    const Images = await ImageModel.find({boatId});

    res.status(200).json({ status: "success", data: Images });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ status: "failed", message: "Server error" });
  }
};

const updateImages = async (req, res) => {
  try {
    const ImageId = req.params.ImageId;
    const ImageDetails = req.body;

    // Ensure the user has permission to update this profile
    if (req.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ status: "failed", message: "Not Authorised" });
    }

    const updatedUser = await updateUserById(userId, updatedData);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    res.status(200).json({ status: "success", data: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ status: "failed", message: "Server error" });
  }
};

const deleteImages = async (req, res) => {
  try {
    const ImageId = req.params.ImageId;

    // Ensure the user has permission to update this profile
    // if (req.userId.toString() !== userId.toString()) {
    //   return res
    //     .status(403)
    //     .json({ status: "failed", message: "Not Authorised" });
    // }
   await ImageModel.findByIdAndDelete({_id:ImageId});

    // if (!updatedUser) {
    //   return res
    //     .status(404)
    //     .json({ status: "failed", message: "User not found" });
    // }

    res.status(200).json({ status: "success", message: "image deleted successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ status: "failed", message: "Server error" });
  }
};

module.exports = {
  addImage,
  getAllBoatImages,
  getBoatImages,
  updateImages,
  deleteImages,
  addMultipleImages
};
