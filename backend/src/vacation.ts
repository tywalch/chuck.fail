import { Handler } from "@netlify/functions";
import { Entity } from "electrodb";
import { DynamoDB } from "aws-sdk";
import moment from "moment";

const getEnv = (env: string) => {
    const value = process.env[env];
    if (value) {
        return value;
    }
    throw new Error(`Missing Environment Variable, ${env}`);
};
const configuration = {
    region: "us-east-1",
    table: getEnv("DYNAMODB_TABLE"),
    accessKeyId: getEnv("DYNAMODB_ACCESS_KEY"),
    secretAccessKey: getEnv("DYNAMODB_SECRET"),
};

const client = new DynamoDB.DocumentClient({
    region: configuration.region,
    credentials: {
        accessKeyId: configuration.accessKeyId,
        secretAccessKey: configuration.secretAccessKey
    }
});

const VacationDay = new Entity({
    model: {
        entity: 'VacationDay',
        service: 'Chuck.Fail',
        version: '1',
    },
    attributes: {
        datetime: {
            type: 'number',
            readOnly: true,
            default: () => Date.now(),
        },
        metadata: {
            type: 'any',
        },
    },
    indexes: {
        days: {
            pk: {
                composite: [],
                field: 'pk',
            },
            sk: {
                composite: ['datetime'],
                field: 'sk',
            }
        }
    }
}, { client, table: configuration.table });

function formatResponse<T>(options?: {data?: T, message?: string, statusCode?: number}) {
    return {
      statusCode: options?.statusCode ?? 200,
      body: JSON.stringify({
        data: options?.data,
        message: options?.message ?? "thank you",
      })
    }
  }
  
async function getHandler() {
    const result = await VacationDay.query.days({}).go({order: 'desc'});
    const [ latest ] = result.data;
    const now = Date.now();
    if (!latest) {
        await postHandler();
    }
    return {
        datetime: latest?.datetime ?? now,
    }
}

async function postHandler() {
    await VacationDay.put({}).go();
}

const handler: Handler = async (event, context) => {
try {
    console.log({event});
    switch(event.httpMethod.toLowerCase()) {
    case 'get':
        return formatResponse({
            data: await getHandler()
        });
    case 'post':
        return formatResponse({
            data: await postHandler()
        });
    default: 
        return formatResponse({statusCode: 404});
    }
} catch(err) {
    console.log({err});
    return formatResponse();
}
};

export { handler };