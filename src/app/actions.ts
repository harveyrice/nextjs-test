"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { revalidatePath } from "next/cache";

const dynamoClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.AWS_REGION,
  })
);

export interface SubmitScoreParams {
  username: string;
  score: number;
}

export async function getScores() {
  const result = await dynamoClient.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": "quiz",
      },
      Limit: 20,
      ScanIndexForward: false,
    })
  );

  return (result.Items || []).map((item) => ({
    username: item.username,
    score: item.sort,
  }));
}

export async function submitScore(params: SubmitScoreParams) {
  const { username, score } = params;

  await dynamoClient.send(
    new PutCommand({
      Item: {
        id: "quiz",
        sort: score,
        username,
      },
      TableName: process.env.TABLE_NAME,
    })
  );

  revalidatePath("/leaderboard");
}
