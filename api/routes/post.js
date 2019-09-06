const express = require("express");
const router = express.Router();

const upload = require("../services/image-upload");

const singleUpload = upload.single("image");

router.post("/create", function(req, res) {
    singleUpload(req, res, function(err) {
        return res.json({ "imageUrl": req.file.location })
    });
});

module.exports = router;