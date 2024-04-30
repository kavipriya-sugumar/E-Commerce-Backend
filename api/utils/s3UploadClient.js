import AWS from "aws-sdk";
import multer from "multer";
import multers3 from "multer-s3";
 
 
 
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION });
 
 export const s3= new AWS.S3();
 
 
 export const upload=multer({
    storage:multers3({
        s3:s3,
        bucket:'khan-carlmart',
        key:(req,file,cb)=>{
          cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
  })
 
  export const uploadFiles=upload.array('inputFile', 3);
 
  export const generateS3FileUrl = (key) => {
    return `https://khan-carlmart.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  };
 
 
 
  export const deleteFileFromS3 = async (key) => {
    const params = {
      Bucket: 'khan-carlmart' ,
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