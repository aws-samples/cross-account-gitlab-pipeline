import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as CrossAccountGitlab from '../lib/cross-account-gitlab-stack';

test('S3 Bucket Created', () => {
  const app = new cdk.App();
  const stack = new CrossAccountGitlab.CrossAccountGitlabStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::S3::Bucket', {
    DeletionPolicy: 'Retain'
  });
});
