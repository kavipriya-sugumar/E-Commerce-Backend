import AWS from "aws-sdk";
import multer from "multer";
import multers3 from "multer-s3";
import dotenv from 'dotenv';
dotenv.config();
 
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    endpoint:process.env.WASABI_ENDPOINT,
    region:process.env.WASABI_REGION ,
    apiVersion: process.env.WASABI_API_VERSION,
    signatureVersion: 'v4', });
   
console.log(process.env.ACCESS_KEY_ID);
 
 
   export const s3 = new AWS.S3({ region: process.env.WASABI_REGION });
 
 
 export const upload=multer({
    storage:multers3({
        s3:s3,
        bucket:process.env.WASABI_BUCKET,
        key:(req,file,cb)=>{
          cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
  })
 
  export const uploadFiles=upload.array('files', 5);
 
  export const generateS3FileUrl = (key) => {
    return `https://s3.${process.env.WASABI_REGION}.wasabisys.com/${process.env.WASABI_BUCKET}/${key}`;
 
  };
 
 
 
  export const deleteFileFromS3 = async (key) => {
    const params = {
      Bucket: process.env.WASABI_BUCKET ,
      Key: key
    };
 
    try {
      await s3.deleteObject(params).promise();
      console.log(`File ${key} deleted successfully from S3 bucket.`);
    } catch (error) {
      console.error(`Error deleting file ${key} from S3 bucket:`, error);
      throw error;
    }
  };