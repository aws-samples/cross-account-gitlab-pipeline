GitLab is a web-based Open Source Git platform that provides free open and private repositories, issue-following capabilities, and wikis. It is a complete DevOps platform that enables professionals to perform all the tasks in a project—from project planning and source code management to monitoring and security. GitLab provides parallel development with repositories following Git approach. GitLab also has DevOps platform with Pipelines which helps in automating several areas of SDLC such as development, deployment, testing, monitoring and more.

AWS Cloud Development Kit (AWS CDK) is an open-source software development framework for defining cloud infrastructure as code with modern programming languages and deploying it through AWS CloudFormation. It is generally available in JavaScript, TypeScript, Python, Java, C#, and Go as of now.

As multiple customers are utilizing GitLab as CI/CD platform for multi-account deployments in AWS, this pattern provides a demonstration and reference of deploying AWS infrastructure as code using AWS CDK and GitLab pipeline to multiple AWS accounts.

In this example, Typescript is used to write the CDK application and GitLab CI/CD pipeline is used to deploy resources to Dev account followed by a manual approval step for deployment to Prod account.

## Target technology stack

-   GitLab

-   AWS CDK

-   AWS CloudFormation


## Target architecture

![](https://1a9zxhkqsj.execute-api.us-west-2.amazonaws.com/v1/contents/8e3f99aa-3d02-4a28-8272-108df88a85c9/images/99913777-37de-4f62-9f63-18a5f050f5d2.png)

1.  Developers push their infrastructure changes/additions to the GitLab repository.

2.  GitLab Pipeline gets triggered with changes. GitLab repository has CI/CD variables to authenticate to the DevOps account. It does not need to access to Dev or Prod accounts as DevOps account assumes a dedicated IAM role for CDK in target accounts (Dev/Prod) to deploy infrastructure.

3.  GitLab Pipeline synthesizes CDK stack to form AWS CloudFormation template.

4.  CDK assumes a dedicated IAM role for CDK to deploy Dev account.

5.  After necessary validations are done in Dev account, app owner or product owner can approve the pipeline to continue deployment to Prod account.

6.  CDK assumes a dedicated IAM role for CDK to deploy Prod account.

7.  **Note:** Infra components will be deployed to Dev and Prod accounts, Not the DevOps account. DevOps account hosts any shared resources like IAM roles, Pipelines, ECR Repositories etc…

## Tools

-   GitLab 

-   AWS CDK Toolkit

-   Node.js

-   TypeScript

-   Shell Script


## Best Practices

1.  After bootstrapping Dev, Prod and DevOps accounts, remove/disable IAM users created Dev and Prod account as we do not need those anymore. GitLab requires access only to the IAM user in DevOps account which has trust enabled when we bootstrapped cdk in Dev and Prod accounts. More details on bootstrapping in [https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)

2.  It is recommended to add code scanning tools for security vulnerability scanning as part of the pipeline when working with actual deployments. For more details, visit [https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/check-aws-cdk-applications-or-cloudformation-templates-for-best-practices-by-using-cdk-nag-rule-packs.html](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/check-aws-cdk-applications-or-cloudformation-templates-for-best-practices-by-using-cdk-nag-rule-packs.html)


## Epics

### Create a GitLab project with an empty repository

1.  Create a project in GitLab and initialize it with an empty repository. 

2.  Clone the repository in your local machine.

3.  In this example, repository name is **cross-account-cicd-gitlab**. You can choose any name.

4.  Open terminal (Unix Based) and ‘cd’ into project directory.


```
cd cross-account-cicd-gitlab
```


### Create AWS IAM User

1.  Create a new IAM user in DevOps AWS account. In this example, IAM user name is ‘cicd_gitlab’ (You can choose any name). This user needs to have Admin access in this AWS account for running pipeline in gitlab.

2.  Capture the Access Key Id and Secret Access Key generated once the user is created with programmatic access. We will use these keys in later steps.


### Configure CI/CD Variables

1.  Go to Settings in GitLab project we created earlier.

2.  Click on CI/CD.

3.  Expand Variables tab.

4.  Add below properties to the Variables as protected variables:

    AWS_ACCESS_KEY_ID - Access Key Id of the IAM user in DevOps Account

    AWS_DEFAULT_REGION - Default Region for AWS resources

    AWS_SECRET_ACCESS_KEY - Secret Access Key of the IAM user in DevOps Account

    DEV_ACCOUNT_ID - 12-digit Dev Account ID

    PROD_ACCOUNT_ID - 12-digit Prod Account ID


### Install AWS CDK Toolkit and configure

Install CDK on your local machine using the following commands -

```
npm install -g aws-cdk

cdk --version
```

Detailed steps for installation and pre-requisites can be found here - [https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install)


### Bootstrap AWS Accounts

-   **Bootstrap DevOps Account:**

    1.  Create an IAM user in the DevOps account with AdministratorAccess permission policy and programmatic access.

    2.  Capture Access Key ID and the Secret Access Key associated with the IAM user to create the devops_profile profile.

    3.  Open Terminal in local workspace and setup AWS named profile **devops_profile** to authenticate to DevOps AWS account:

        -   Update the credentials file to add the profile - `~/.aws/credentials` (Linux & Mac) or `%USERPROFILE%\.aws\credentials` (Windows)

            ```
            [devops_profile]
            aws_access_key_id=<AWS_ACCESS_KEY_FOR_DEVOPS_ACCOUNT>
            aws_secret_access_key=<AWS_SECRET_ACCESS_KEY_FOR_DEVOPS_ACCOUNT>
            ```

            For more details on creating AWS named profile, visit [https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html#cli-configure-profiles-create](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html#cli-configure-profiles-create).

    4.  Run below command to bootstrap DevOps AWS account and wait for bootstrap to complete:


```
export devops_account=<aws_devops_account_id>
export region=<aws_region_for_deployment>
cdk bootstrap aws://$devops_account/$region --profile devops_profile
```

-   **Bootstrap Dev Account**


1.  Create an IAM user in the Dev account with AdministratorAccess permission policy and programmatic access.

2.  Capture Access Key ID and the Secret Access Key associated with the IAM user to create the dev_profile profile.

3.  Open Terminal in local workspace and setup AWS named profile **dev_profile** to authenticate to Dev AWS account:

    -   Update the credentials file to add the profile - `~/.aws/credentials` (Linux & Mac) or `%USERPROFILE%\.aws\credentials` (Windows)

        ```
        [dev_profile]
        aws_access_key_id=<AWS_ACCESS_KEY_FOR_DEV_ACCOUNT>
        aws_secret_access_key=<AWS_SECRET_ACCESS_KEY_FOR_DEV_ACCOUNT>
        ```

        For more details on creating AWS named profile, visit [https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html#cli-configure-profiles-create](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html#cli-configure-profiles-create).

4.  Run below command to bootstrap Dev AWS account and wait for bootstrap to complete:


```
export dev_account=<aws_dev_account_id>
cdk bootstrap aws://$dev_account/$region --trust $devops_account --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess' --profile dev_profile
```

-   **Bootstrap Prod Account**


1.  Create an IAM user in the Prod account with AdministratorAccess permission policy and programmatic access.

2.  Capture Access Key ID and the Secret Access Key associated with the IAM user to create the prod_profile profile.

3.  Open Terminal in local workspace and setup AWS named profile **prod_profile** to authenticate to Prod AWS account:

    -   Update the credentials file to add the profile - `~/.aws/credentials` (Linux & Mac) or `%USERPROFILE%\.aws\credentials` (Windows)

        ```
        [prod_profile]
        aws_access_key_id=<AWS_ACCESS_KEY_FOR_PROD_ACCOUNT>
        aws_secret_access_key=<AWS_SECRET_ACCESS_KEY_FOR_PROD_ACCOUNT>
        ```

        For more details on creating AWS named profile, visit [https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html#cli-configure-profiles-create](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html#cli-configure-profiles-create).

4.  Run below command to bootstrap Prod AWS account and wait for bootstrap to complete:


```
export prod_account=<aws_prod_account_id>
cdk bootstrap aws://$prod_account/$region --trust $devops_account --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess' --profile prod_profile
```

As a security best practice, after bootstrapping is completed successfully, IAM access keys created in Dev and Prod AWS accounts can be deactivated and deleted. We only need the IAM user credentials in DevOps accounts for GitLab to authenticate.


### Create a CDK App and sample infrastructure

1.  Use below command to create a cdk app:


```
cdk init app --language typescript
```

2.  Go into lib directory with below command:


```
cd lib
```

3.  Open **cross-account-cicd-gitlab-stack.ts** file in an editor. You can use any editor of your choice.

4.  Add an import statement for s3 at top of the file:


```
import * as s3 from 'aws-cdk-lib/aws-s3';
```

3.  Add a sample s3 bucket into stack after the line » **super(scope, id, props);** and save file:


```
const sampleS3Bucket = new s3.Bucket(this, `sample-s3-bucket`, {
      enforceSSL: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.KMS
    });
```

5.  We are going to deploy this s3 bucket into multiple accounts - Dev, followed by a manual approval step to allow deployment to Prod.

6.  Go to bin directory under **cross-account-cicd-gitlab**

7.  Open **cross-account-cicd-gitlab.ts**

8.  Add below env JSON inside the stack file to pass AWS account ID and region from environment variables. Resulting code looks like below:


```
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CrossAccountCicdGitlabStack } from '../lib/cross-account-cicd-gitlab-stack';

const app = new cdk.App();
new CrossAccountCicdGitlabStack(app, 'CrossAccountCicdGitlabStack', {
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION
  }
});
```


### Create Gitlab Pipeline

1.  Go to top level directory of your project, (in this case it is **cross-account-cicd-gitlab** directory


```
cd ..
```

2.  Create a file named **.gitlab-ci.yml**

3.  Add below content to **.gitlab-ci.yml**. This YAML template defines the GitLab pipeline and various stages in the pipeline.


```
image: node:14-alpine
cache:
  paths:
  - node_modules/
stages:
- build
- deploy-test
- deploy-prod

build-job:
  stage: build
  script:
  - echo "Compiling the code..."
  - npm install
  - npm run build
  - echo "Compile complete."

deploy-dev-infra:
  stage: deploy-test
  variables:
    CDK_DEPLOY_ACCOUNT: $DEV_ACCOUNT_ID
    CDK_DEPLOY_REGION: $AWS_DEFAULT_REGION
  before_script:
  - npm install -g aws-cdk
  script:
  - npx cdk synth
  - cdk diff
  - cdk deploy --require-approval never

deploy-prod-infra:
  stage: deploy-prod
  variables:
    CDK_DEPLOY_ACCOUNT: $PROD_ACCOUNT_ID
    CDK_DEPLOY_REGION: $AWS_DEFAULT_REGION
  before_script:
  - npm install -g aws-cdk
  script:
  - npx cdk synth
  - cdk diff
  - cdk deploy --require-approval never
  rules:
  - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
    when: manual
```


### Verify pipeline execution and deployment

1.  Check-in the changes to your GitLab repository.

2.  When check-in is successful, you should see a GitLab pipeline kicked-off automatically.

3.  Pipeline deploys the stack to Dev account in **deploy-test** stage.

4.  Pipeline pauses before Prod account deployment and waits for manual approval.

5.  Click on Play icon on **deploy-prod** stage.

6.  Pipeline resumes deployment to Prod Account. This approach can be used for validating changes in Dev/Test environment before approving deployment in Prod environment.

7.  Verify the logs for each stage and see the pipeline to completion successfully.


### Validate the resources in the stack are now created in Dev and Prod AWS accounts

Once the ‘deploy-test’ stage of the GitLab pipeline has passed, you can open the AWS Management console in Dev AWS account, navigate to S3 console and verify that the new S3 bucket is now created. After reviewing the resource deployed in Dev AWS account and approving the pipeline for ‘deploy-prod’ stage, pipeline now executes in the Prod AWS account.

Once the ‘deploy-prod’ stage of GitLab pipeline has passed, you can open the AWS Management console in Prod AWS account, navigate to S3 console and verify that the new S3 bucket is now created.


## Troubleshooting

You might run into the `toomanyrequests` error in build stage in your pipeline:


`Pulling docker image node:14-alpine ...`

`WARNING: Failed to pull image with policy "always": Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit (manager.go:237:0s)`

`ERROR: Job failed: failed to pull image "node:14-alpine" with specified policies [always]: Error response from daemon: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit (manager.go:237:0s)`



You get this error when you try to pull an image from the public Docker Hub repository after you have reached your Docker pull rate limit. Docker Hub uses IP addresses to authenticate the users, and pull rates limits are based on individual IP addresses.

-   For anonymous users, the rate limit is set to 100 pulls per 6 hours per IP address.

-   For authenticated users with a Docker ID, the pull rate is set to 200 pulls per 6-hour period.

-   If your image pull request exceeds these limits, these requests are denied until the six-hour window elapses.

    You can simply wait and re-run your pipeline at a later time OR you can follow the following AWS Blog for mitigation options: [https://aws.amazon.com/blogs/containers/advice-for-customers-dealing-with-docker-hub-rate-limits-and-a-coming-soon-announcement/](https://aws.amazon.com/blogs/containers/advice-for-customers-dealing-with-docker-hub-rate-limits-and-a-coming-soon-announcement/)


## References

For CDK examples, visit [https://github.com/aws-samples/aws-cdk-examples](https://github.com/aws-samples/aws-cdk-examples)

For CDK documentation, visit [https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)


## Cleanup

You can either delete the stack through the AWS CloudFormation console or use `cdk destroy`:

```
cdk destroy
```

You’ll be asked:

```
Are you sure you want to delete: CdkWorkshopStack (y/n)?
```

Hit “y” and you’ll see your stack being destroyed.

The bootstrapping stack created through `cdk bootstrap` still exists. If you plan on using the CDK in the future (we hope you do!) do not delete this stack.

If you would like to delete this stack, it will have to be done through the CloudFormation console. Head over to the CloudFormation console and delete the `CDKToolkit` stack. The S3 bucket created will be retained by default, so if you want to avoid any unexpected charges, be sure to head to the S3 console and empty + delete the bucket generated from bootstrapping.