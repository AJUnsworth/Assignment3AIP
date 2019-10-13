const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

//This file is based off a tutorial from Medium.com that can no longer be located
//A similar tutorial can be seen here: https://medium.com/@paulrohan/file-upload-to-aws-s3-bucket-in-a-node-react-mongo-app-and-using-multer-72884322aada

//Setup keys for AWS bucket
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-2"
});

const s3 = new aws.S3();

const uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        acl: "public-read",
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + file.originalname)
        }
    })
});

const deleteImage = async (imageUrl) => {
    const key = imageUrl.split(".com/")[1];

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: key
    };

    //Delete image to save space in S3 Bucket, then remove the actual image
    s3.deleteObject(params, function (err, data) {
        if (err) {
            return err;
        } else {
            return;
        }
    });
}

module.exports = { uploadImage, deleteImage };