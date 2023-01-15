import moment from "moment";
import { Handler } from "@netlify/functions";
import { VacationTracker, BlackListViolation, BlackListItem } from './db';

type Event = Parameters<Handler>[0];

type RequestMetadata = {
    ipAddress: string;
    userAgent: string;
    metadata: {
        headers: Event['headers'];
        multiValueHeaders: Event['multiValueHeaders'];
    }
}

function formatResponse<T>(options?: {data?: T, message?: string, statusCode?: number}) {
    return {
        statusCode: options?.statusCode ?? 200,
        body: JSON.stringify({
        data: options?.data,
        message: options?.message ?? "thank you",
        })
    }
}

async function createNewVacationStart(request: RequestMetadata) {
    return await VacationTracker.entities.vacationDay
        .put(request)
        .go();
}

function getBlacklistViolations(event: Event, blacklist: BlackListItem[]): BlackListViolation[] {
    return blacklist
        .filter((record) => record.multiValue 
            ? event.headers[record.type] !== record.value
            : event.multiValueHeaders[record.type]?.includes(record.value) === false
        )
        .map((conflict) => ({
            ...conflict,
            metadata: event,
            datetime: moment().format(),
        }));
}
  
async function getHandler(event: Event) {
    const request = parseEvent(event);
    const result = await VacationTracker.entities
        .vacationDay.query
        .days({})
        .go({order: 'desc'});
    
    const [ latest ] = result.data;

    if (!latest) {
        await createNewVacationStart(request)
        .catch(err => console.error(err));
    }

    const datetime = typeof latest?.datetime === 'string'
        ? moment(latest.datetime).utc().valueOf()
        : Date.now();

    return {
        datetime
    }
}

type Authorization = {
    authorized: boolean;
    violations: BlackListViolation[];
}

async function authorizeEvent(event: Event): Promise<Authorization> {
    try {
        const blacklist = await VacationTracker.entities
            .blackList.query
            .types({})
            .go();

        const violations = getBlacklistViolations(event, blacklist.data);

        return {
            authorized: violations.length === 0,
            violations,
        }
    } catch (err) {
        return {
            authorized: false,
            violations: [],
        }
    }
}

async function postHandler(event: Event) {
    const request = parseEvent(event);
    const {authorized, violations} = await authorizeEvent(event);
    if (authorized) {
        await VacationTracker.entities.vacationDay
            .put({ ...request, datetime: moment().format() })
            .go();
    } else {
        await VacationTracker.entities
            .violation.put(violations)
            .go();
    }

    return {
        authorized
    };
}

function parseEvent(event: Event): RequestMetadata {
    const { multiValueHeaders, headers } = event;
    return {
        ipAddress: headers['x-nf-client-connection-ip']!,
        userAgent: headers['user-agent']!,
        metadata: {
            headers,
            multiValueHeaders,
        }
    }
}

async function route(event: Event) {
    switch(event.httpMethod.toLowerCase()) {
        case 'get':
            return await getHandler(event)
        case 'post':
            return await postHandler(event);
        default: 
            return undefined;
    }
}

const handler: Handler = async (event) => {
try {
    console.log(JSON.stringify({event}));
    const response = await route(event);
    if (response) {
        return formatResponse({data: response});
    }
    return formatResponse({statusCode: 404, message: 'not found'});
} catch(err) {
    console.error({err});
    return formatResponse();
}
};

export { handler };