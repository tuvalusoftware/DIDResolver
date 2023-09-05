import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET = process.env.AWS_BUCKET;

// Handle the case where any of the variables is undefined or null
if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY || !AWS_REGION || !AWS_BUCKET) {
  throw Error("Some AWS environment variables are missing!");
}

/**
 * @description Handle error from AWS
 * @param {Error} err Error returned by AWS
 * @returns {Error | {error_code: Number, error_message: String}}
 */
const handleAWSError = (err) => {
  if (
    err.message === "Resolved credential object is not valid" &&
    err.name === "Error"
  ) {
    return ERROR_CODES.AWS_INVALID_CREDENTIAL;
  }

  if (err.message === "UnknownError" && err.name === "NotFound") {
    return ERROR_CODES.AWS_S3_NOT_FOUND;
  }

  return ERROR_CODES.UNKNOWN_ERROR;
};

class AWSService {
  constructor() {
    const config =
      process.env.NODE_ENV !== "test"
        ? {
            region: AWS_REGION,
            credentials: {
              accessKeyId: AWS_ACCESS_KEY,
              secretAccessKey: AWS_SECRET_KEY,
            },
          }
        : {};

    this.client = new S3Client(config);
  }

  /**
   * @async
   * @description List all available buckets in S3
   * @returns {Promise<Array>} List of available buckets
   */
  async listBuckets() {
    try {
      const data = await this.client.send(new ListBucketsCommand({}));
      return data.Buckets;
    } catch (err) {
      throw handleAWSError(err);
    }
  }

  /**
   * @async
   * @description List objects in the specified AWS bucket
   * @returns {Promise<Array>} List of objects in the specified bucket
   */
  async listObjects() {
    try {
      const data = await this.client.send(
        new ListObjectsCommand({
          Bucket: AWS_BUCKET,
        })
      );
      return data.Contents;
    } catch (err) {
      throw handleAWSError(err);
    }
  }

  /**
   * @async
   * @description Check if the Object exists in S3
   * @param {String} objectKey AWS Object Key
   * @returns {Promise<Boolean>} Resolves with a boolean indicating if the object exists
   */
  async checkObjectExistence(objectKey) {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: AWS_BUCKET,
          Key: objectKey,
        })
      );
      return true;
    } catch (err) {
      const handledErr = handleAWSError(err);
      if (handledErr === ERROR_CODES.AWS_S3_NOT_FOUND) {
        return false;
      }
      throw handledErr;
    }
  }
  /**
   * @async
   * @description Upload a file to AWS S3
   * @param {Buffer} fileContent File's content as a Buffer object
   * @param {String} fileName File's mimetype
   * @param {String} fileType Type of the file (image, csv, ...)
   * @param {Boolean} modifyFileName Default to true. If true, add a datetime.now string to make the filename unique, encodeURI the file name to make it suitable
   * @returns {Promise<String>} Resolves with the AWS Object Key of the uploaded file
   */
  async uploadObjects(fileContent, fileName, fileType, modifyFileName = true) {
    const objectKey = modifyFileName
      ? `${Date.now()}-${encodeURI(fileName)}`
      : fileName;

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: AWS_BUCKET,
          Key: objectKey,
          Body: fileContent,
          ContentType: fileType,
        })
      );
      return objectKey;
    } catch (err) {
      throw handleAWSError(err);
    }
  }

  /**
   * @async
   * @description Remove an object with the given object key in S3
   * @param {String} objectKey - The object key of the object to be removed
   * @returns {Promise} A promise that resolves when the object is successfully removed
   */
  async removeObject(objectKey) {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: AWS_BUCKET,
          Key: objectKey,
        })
      );
    } catch (err) {
      throw handleAWSError(err);
    }
  }

  /**
   * @async
   * @description Get pre-signed URL of an object in AWS
   * @param {String} objectKey AWS Object Key
   * @param {Number} expiresIn Expiration time in second, default to an hour (3600s), maximum 7 days
   * @returns {Promise<String>} Resolves with the pre-signed URL of the object
   */
  async getPresignedURL(objectKey, expiresIn = 3600) {
    // presigned URLs must have an expiration date less than one week in the future
    if (expiresIn > 604800) {
      throw ERROR_CODES.AWS_S3_URL_MAXIMUM_EXPIRED;
    }

    try {
      const data = await getSignedUrl(
        this.client,
        new GetObjectCommand({
          Bucket: AWS_BUCKET,
          Key: objectKey,
        }),
        { expiresIn }
      );
      return data;
    } catch (err) {
      throw handleAWSError(err);
    }
  }
}

export default AWSService;
