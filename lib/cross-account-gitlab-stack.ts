import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as logs from 'aws-cdk-lib/aws-logs'
import path = require('path');

export class CrossAccountGitlabStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Serverless App Start

    const lambdaRole = new iam.Role(this, 'lambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    const lambdaFunction = new lambda.Function(this, 'Handler', {
      code: new lambda.AssetCode('lambda'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      role: lambdaRole
    });

    const sample_bucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      serverAccessLogsPrefix: 'accesslogs'
    });

    lambdaRole.attachInlinePolicy(new iam.Policy(this, 'lambda-policy', {
      statements: [new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [sample_bucket.bucketArn],
      })],
    }));
  }
}
