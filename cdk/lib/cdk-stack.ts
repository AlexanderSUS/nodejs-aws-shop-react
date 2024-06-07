import * as cdk from "aws-cdk-lib";
import { BlockPublicAccess, Bucket, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path = require("path");

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const reactAppBucket = new Bucket(this, "RSSReactAppBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      versioned: false,
      publicReadAccess: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
    });

    new BucketDeployment(this, "BucketDeployment", {
      sources: [Source.asset(path.join(__dirname, "../..", "dist"))],
      destinationBucket: reactAppBucket,
    });
  }
}
