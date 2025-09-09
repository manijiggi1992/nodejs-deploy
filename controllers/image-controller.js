const Image = require("../models/Image");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const uploadImageController = async (req, res) => {
  try {
    //check if file is missing in req object
    console.log("req.file", req.file);
    // req.file {
    //   fieldname: 'image',
    //   originalname: 'kia.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   destination: 'uploads/',
    //   filename: 'image-1756900260455.jpg',
    //   path: 'uploads/image-1756900260455.jpg',
    //   size: 34549
    // }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload an image",
      });
    }

    //upload to clodinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    console.log("url, publicId", url, publicId);
    //store the image url and public id along with the uploaded user id in database
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });
    await newlyUploadedImage.save();

    //delete the file from local storage
    //fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Imaged uploaded successfully",
      image: newlyUploadedImage,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: `Something went wrong! Please try again ${e}`,
    });
  }
};

const fetchImagesController = async (req, res) => {
  try {
    console.log("req.query", req.query.page);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    console.log("sortObj", sortObj);
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
    const getImageId = req.params.id;
    const userId = req.userInfo.userId;
    console.log("delete image", getImageId, userId);

    const image = await Image.findById(getImageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    //check if this image is uploaded by the current user who is trying to delete this image
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to delete this image because you haven't uploaded it`,
      });
    }

    //delete this image first from your cloudinary stroage
    await cloudinary.uploader.destroy(image.publicId);

    //delete this image from mongodb database
    await Image.findByIdAndDelete(getImageId);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.log("delete image", error);
    res.status(500).json({
      success: false,
      message: `Something went wrong! Please try again ${error}`,
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
};
