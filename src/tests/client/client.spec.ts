import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import sinon from 'sinon';

import { Configuration } from '../../typeddb/configuration';
import Client from '../../typeddb/client/client';
import { Schema } from '../../typeddb/schema';
import { equal, and, greater } from '../../typeddb/query/query';
import QueryBuilder from '../../typeddb/query/builder';

describe('TypedDB Client', () => {
    let documentClient: DocumentClient;
    let configuration: Configuration;
    let client: Client<Schema>;

    beforeAll(() => {
        configuration = {
            idPrefix: 'TST',
            table: 'TestsTable',
        };
        documentClient = sinon.createStubInstance(DocumentClient);
        client = new Client<Schema>(configuration, documentClient);
    });

    test('should find item by id', async () => {
        documentClient.get = sinon.stub().callsFake(() => ({
            promise: sinon.stub().resolves({ Item: { id: '12345' } }),
        }));
        const item = await client.findById({ id: '12345' });
        expect(item).toBeDefined();
        expect(item?.id).toEqual('12345');
    });

    test('should return null when object is not found', async () => {
        documentClient.get = sinon.stub().callsFake(() => ({
            promise: sinon.stub().resolves({ Item: null }),
        }));
        const item = await client.findById({ id: '12345' });
        expect(item).toBeNull();
    });

    test('should insert new item and autogenate string id', async () => {
        const item = { id: '1223345', createdAt: '27/02/2020', updatedAt: '27/02/2020' };

        documentClient.put = sinon.stub().callsFake(() => ({
            promise: sinon.stub().resolves({ Attributes: item }),
        }));

        const result = client.insert(item);
        expect(result).toBeDefined();
    });

    test('should insert new item and autogenate number id', async () => {
        const item = { id: '1223345', createdAt: '27/02/2020', updatedAt: '27/02/2020' };

        documentClient.put = sinon.stub().callsFake(() => ({
            promise: sinon.stub().resolves({ Attributes: item }),
        }));
        const client = new Client({ table: 'TestsTable' }, documentClient);
        const result = client.insert(item);
        expect(result).toBeDefined();
    });

    test('should update item in table', async () => {
        const item = { id: '1223335', createdAt: '27/02/2020', updatedAt: '27/02/2020' };

        documentClient.update = sinon.stub().callsFake(() => ({
            promise: sinon.stub().resolves({ Attributes: item }),
        }));

        const result = client.update(item);
        expect(result).toBeDefined();
    });

    test('should return and object from and query', async () => {
        const item = { id: '1223335', createdAt: '27/02/2020', updatedAt: '27/02/2020' };
        const query = new QueryBuilder()
            .expression(and(equal('id', '1223335'), greater('updatedAt', '27/02/2020')))
            .build();
        documentClient.scan = sinon.stub().callsFake(() => ({
            promise: sinon.stub().resolves({ Items: [item] }),
        }));
        const result = await client.query(query);
        expect(result).toBeDefined();
    });

    test('should delete an element by id', async () => {
        documentClient.delete = sinon.stub().callsFake(() => ({
            promise: sinon.stub().resolves({ Attributes: '' }),
        }));
        const result = await client.delete({ id: '123456' });
        expect(result).toBeDefined();
    });
});
