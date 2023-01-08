"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const electrodb_1 = require("electrodb");
const aws_sdk_1 = require("aws-sdk");
const moment_1 = __importDefault(require("moment"));
const getEnv = (env) => {
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
const client = new aws_sdk_1.DynamoDB.DocumentClient({
    region: configuration.region,
    credentials: {
        accessKeyId: configuration.accessKeyId,
        secretAccessKey: configuration.secretAccessKey
    }
});
const VacationDay = new electrodb_1.Entity({
    model: {
        entity: 'VacationDay',
        service: 'Chuck.Fail',
        version: '1',
    },
    attributes: {
        datetime: {
            type: 'string',
            readOnly: true,
            default: () => (0, moment_1.default)().format(),
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
function formatResponse(options) {
    var _a, _b;
    return {
        statusCode: (_a = options === null || options === void 0 ? void 0 : options.statusCode) !== null && _a !== void 0 ? _a : 200,
        body: JSON.stringify({
            data: options === null || options === void 0 ? void 0 : options.data,
            message: (_b = options === null || options === void 0 ? void 0 : options.message) !== null && _b !== void 0 ? _b : "thank you",
        })
    };
}
function getHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        return VacationDay.query.days({}).go({ order: 'desc' });
    });
}
function postHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        yield VacationDay.put({}).go();
    });
}
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log({ event });
        switch (event.httpMethod.toLowerCase()) {
            case 'get':
                return formatResponse({
                    data: yield getHandler()
                });
            case 'post':
                return formatResponse({
                    data: yield postHandler()
                });
            default:
                return formatResponse({ statusCode: 404 });
        }
    }
    catch (err) {
        console.log({ err });
        return formatResponse();
    }
});
exports.handler = handler;
