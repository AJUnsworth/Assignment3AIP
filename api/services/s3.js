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

//Upload image to S3 bucket
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

//Remove image from S3 bucket
const deleteImage = async (imageUrl) => {
    //Image key is after ".com/" in the url
    const key = imageUrl.split(".com/")[1];

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: key
    };

    try {
        await s3.deleteObject(params).promise();
        return;
    } catch {
        throw new Error(err);
    }
}

module.exports = { uploadImage, deleteImage };