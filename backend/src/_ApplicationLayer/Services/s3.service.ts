import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { logError, logThrowError } from '_InfrastructureLayer/Repositories/DynamoDB/utils/utils';

@Injectable()
export class S3Service {
  constructor(private readonly s3: S3) {}

  public async getSignedUrl(operation: string, params: any) {
    return await this.s3
      .getSignedUrlPromise(operation,params)
      .catch<null>(err => {
        logError('S3 Get Signed Url', err, params);
        return null;
      });
  }

  public async getObject(key: string, bucket: string) {
    const params: S3.Types.GetObjectRequest = {
      Bucket: bucket,
      Key: key,
    };
    return await this.s3
      .getObject(params)
      .promise()
      .then((data: S3.Types.GetObjectOutput) => data)
      .catch<null>(err => {
        logError('S3 Get Object', err, params);
        return null;
      });
  }

  public async uploadObject(key: string, bucket: string, body: Buffer,contentType: string) {
    const params: S3.Types.PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      ACL: 'public-read',
      Body: body,
      ContentType: contentType,
    };
    return await this.s3
      .putObject(params)
      .promise()
      .then(data => data)
      .catch(logThrowError('S3 Put Object', params));
  }


}
