import * as cdk from '@aws-cdk/core';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class CrossAccountGitlabStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sampleS3Bucket = new s3.Bucket(this, `sample-s3-bucket`, {
      enforceSSL: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.KMS
    });
  }
}
