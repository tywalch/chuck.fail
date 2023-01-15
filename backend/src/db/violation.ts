import { Entity } from 'electrodb'
import moment from "moment";

export const Violation = new Entity({
    model: {
        entity: 'Violation',
        service: 'Chuck.Fail',
        version: '1',
    },
    attributes: {
        type: {
          type: 'string',
          readOnly: true,
        },
        value: {
            type: 'string',
            readOnly: true,
        },
        metadata: {
          readOnly: true,
          type: 'any',
        },
        datetime: {
          type: 'string',
          readOnly: true,
          default: () => moment().format(),
        },
    },
    indexes: {
        offenders: {
            pk: {
                composite: ['type'],
                field: 'pk',
            },
            sk: {
                composite: ['datetime', 'value'],
                field: 'sk',
            }
        },
        types: {
            index: 'gsi1pk-gsi1sk-index',
            pk: {
                field: 'gsi1pk',
                composite: ['value'],
            },
            sk: {
                field: 'gsi1sk',
                composite: ['datetime', 'type'],
            }
        }
    }
});