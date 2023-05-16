import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import path = require('path');

export class CrossAccountGitlabStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sampleS3Bucket = new s3.Bucket(this, `sample-s3-bucket`, {
      enforceSSL: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.KMS
    });

    // Serverless App Start
    /*
    const handler = new lambda.Function(this, 'Handler', {
      code: new lambda.AssetCode('lambda'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
    });

    const api = new apigw.RestApi(this, "widgets-api", {
      restApiName: "Hello World Service",
      description: "This is a sample api gateway service serves samples."
    });

    const getSampleLambdaIntegration = new apigw.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", getSampleLambdaIntegration);
    */
    // Serverless App End
  }
}
