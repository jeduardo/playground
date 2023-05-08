# Signed Lambda Caller

How to call AWS Lambda Functions protected by `AWS_IAM` authentication.

## Dependencies

```shell
npm install @aws-sdk/signature-v4 @aws-crypto/sha256-js axios
```

## Configuring

Export the following environment variables:

* LAMBDA_URL: Full function URL for the Lambda
* AWS_ACCESS_KEY_ID: AWS access key id of an authorized user
* AWS_SECRET_ACCESS_KEY: AWS secret access key of an authorized user
* AWS_SESSION_TOKEN: Optional, valid session token. Replaces the previous rwo
    parameters
* AWS_REGION: region the lambda function is running in

## Running

Run the script with `node`:

```shell
node ./caller.js
```

## References

* [Security and auth model for Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html)
* [Signing requests with AWS SDK in Lambda functions](https://dev.to/aws-builders/signing-requests-with-aws-sdk-in-lambda-functions-476)
