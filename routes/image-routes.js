const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const { uploadImageController, fetchImagesController, deleteImageController } = require("../controllers/image-controller");

const router = express.Router();

router.post(
    "/upload",
    (req, res, next)=>{
        console.log("Headers", req.headers['content-type']); // multipart/form-data; boundary=----WebKitFormBoundary97N7AkFFikIWNxMx
        next();
    },
    authMiddleware,
    adminMiddleware,
    uploadMiddleware.single("image"),
    uploadImageController
);

//to get all the images
router.get("/get", authMiddleware, fetchImagesController);

//delete the image
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;