
import { s3, S3_BUCKET } from './aws-config';

export const uploadImageToS3 = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
  
  const params = {
    Bucket: S3_BUCKET,
    Key: `artwork-images/${fileName}`,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read'
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteImageFromS3 = async (imageUrl: string): Promise<void> => {
  try {
    const key = imageUrl.split('.com/')[1]; // Extract key from URL
    
    const params = {
      Bucket: S3_BUCKET,
      Key: key
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Failed to delete image');
  }
};
