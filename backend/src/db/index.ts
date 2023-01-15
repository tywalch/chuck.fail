import { DynamoDB } from "aws-sdk";
import { Service, CreateEntityItem } from 'electrodb';
import { BlackList } from './blacklist';
import { Violation } from './violation';
import { VacationDay } from './vacationDay';

const getEnv = (env: string) => {
  const value = process.env[env];
  if (value) {
      return value;
  }
  throw new Error(`Missing Environment Variable, ${env}`);
};

const table = getEnv("DYNAMODB_TABLE");

const client = new DynamoDB.DocumentClient({
  region: "us-east-1",
  credentials: {
      accessKeyId: getEnv("DYNAMODB_ACCESS_KEY"),
      secretAccessKey: getEnv("DYNAMODB_SECRET")
  }
});

export const VacationTracker = new Service({
  vacationDay: VacationDay,
  blackList: BlackList,
  violation: Violation,
}, { client, table });

export type BlackListViolation = CreateEntityItem<typeof Violation>;

export type BlackListItem = CreateEntityItem<typeof BlackList>;