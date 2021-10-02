import type { AWS } from "@serverless/typescript";

import list from "@functions/list";

const serverlessConfiguration: AWS = {
  service:
    "${self:custom.channel.name}-medics-${self:custom.lambda.type}-${self:provider.stage}-cf",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: false,
    },
    channel: {
      name: "group01",
    },
    lambda: { type: "bussines" },
    regionName: {
      dev: "us-east-2",
      qa: "us-east-2",
      prod: "us-east-1",
    },
  },
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-2",
    stage: '${opt:stage,"dev"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    deploymentBucket: {
      name: "group01-delga-${self:provider.stage}-lambda-${self:custom.lambda.type}",
      serverSideEncryption: "AES256",
    },
    iam: {
      role: "arn:aws:iam::431224282472:role/aws-group01-role-lambdas-${self:custom.lambda.type}-${self:provider.stage}",
    },
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: { list },
};

module.exports = serverlessConfiguration;
