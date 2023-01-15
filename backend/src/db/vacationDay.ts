import { Entity } from "electrodb";
import moment from "moment";

export const VacationDay = new Entity({
    model: {
        entity: 'VacationDay',
        service: 'Chuck.Fail',
        version: '1',
    },
    attributes: {
        datetime: {
            type: 'string',
            readOnly: true,
            default: () => moment().format(),
        },
        ipAddress: {
            type: 'string'
        },
        userAgent: {
            type: 'string'
        },
        metadata: {
            type: 'any',
        }
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
        },
        source: {
            index: 'gsi1pk-gsi1sk-index',
            pk: {
                field: 'gsi1pk',
                composite: ['userAgent'],
            },
            sk: {
                field: 'gsi1sk',
                composite: ['datetime'],
            }
        }
    }
});