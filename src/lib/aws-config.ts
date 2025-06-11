
import AWS from 'aws-sdk';

// AWS Configuration
AWS.config.update({
  accessKeyId: 'AKIAUJ3VUG6VAUCD4233',
  secretAccessKey: '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',
  region: 'us-east-1'
});

export const s3 = new AWS.S3();
export const S3_BUCKET = 'ariesgallery';

// Database Configuration
export const DB_CONFIG = {
  host: 'aries-gallery.c3868qigeobt.us-east-1.rds.amazonaws.com',
  user: 'aries',
  password: 'knowthyGod5533',
  database: 'postgres',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
};
