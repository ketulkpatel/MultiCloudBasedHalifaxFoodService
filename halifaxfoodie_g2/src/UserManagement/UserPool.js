/**
 * @author Ketul Patel - B00900957.
 * @project Serverless- Project - G2.
 */

import { CognitoUserPool } from "amazon-cognito-identity-js";

// UserPool data to will be used.
// Here data is provided statically so you can run the application(Otherwise credentials must be added securly using environment variables).
const poolData = {
    UserPoolId: "us-east-1_7aNcyYrXT",
    ClientId: "14376ct08h01vntbj3vkbd5f5q"
}

export default new CognitoUserPool(poolData);