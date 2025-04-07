const express = require('express');
const ImageRouter = express.Router()

const multer = require('multer');
const { uploadFile } = require('../services/Strorage');
const { addImage, getBoatImages, updateImages, deleteImages, getAllBoatImages, addMultipleImages } = require('../controllers/ImgesContoller');
const upload = multer({ storage: multer.memoryStorage() }); 


// ImageRouter.post('/upload', upload.single('file'), uploadFile);


ImageRouter.post('/',upload.single('file'), addImage);
ImageRouter.post('/multiple/:yachtId', upload.array('files', 10), addMultipleImages);

ImageRouter.get('/',getAllBoatImages);

ImageRouter.get('/:boatId',getBoatImages);

ImageRouter.patch('/:ImageId', updateImages);

ImageRouter.delete('/:ImageId', deleteImages);




module.exports = ImageRouter;
