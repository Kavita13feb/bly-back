
const { ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
const { storage } = require('../config/firebase');



const uploadFile = (req, res) => {
  console.log(req.file)
    if (!req.file) {
      // console.log(req)
      return res.status(400).send('No file uploaded.');
      
    }
  
    const file = req.file;
    const storageRef = ref(storage, `uploads/${file.originalname}`);
  console.log(storageRef)
  const metadata = {
    contentType: 'image/jpeg', // Set the correct content type here
  };
    const uploadTask = uploadBytesResumable(storageRef, file.buffer,metadata);
  
    uploadTask.on('state_changed',
      (snapshot) => {
        // Optional: Track progress of the upload if needed
      },
      (error) => {
        console.log(error)
        return res.status(500).send(error.message);
      },
      () => {
        // Get the download URL and respond with it
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          res.status(200).send({ downloadURL });
        });
      }
    );
  };
  
  module.exports = { uploadFile };

