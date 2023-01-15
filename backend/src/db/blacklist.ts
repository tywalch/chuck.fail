import { Entity } from 'electrodb'

export const BlackList = new Entity({
    model: {
        entity: 'BlackList',
        service: 'Chuck.Fail',
        version: '1',
    },
    attributes: {
        type: {
          type: 'string',
        },
        value: {
            type: 'string'
        },
        multiValue: {
            type: 'boolean'
        }
    },
    indexes: {
        types: {
            pk: {
                composite: [],
                field: 'pk',
            },
            sk: {
                composite: ['multiValue', 'type', 'value'],
                field: 'sk',
            }
        },
        values: {
            index: 'gsi1pk-gsi1sk-index',
            pk: {
                field: 'gsi1pk',
                composite: ['value'],
            },
            sk: {
                field: 'gsi1sk',
                composite: ['multiValue', 'type'],
            }
        }
    }
});