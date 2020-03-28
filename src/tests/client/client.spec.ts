import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Configuration } from '../../typeddb/configuration';
import Client from '../../typeddb/client/client';

import { Schema } from 'typeddb/schema';
import sinon from 'sinon';

describe('TypedDB Client', () => {
    let documentClient: DocumentClient;
    let configuration: Configuration;
    let client: Client<Schema>;

    beforeAll(() => {
        configuration = {
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

    test('should insert new item in table', async () => {
        documentClient.put = jest.fn();

        const item = { id: '1223345', createdAt: '27/02/2020', updatedAt: '27/02/2020' };
        const result = client.insert(item);
        expect(documentClient.put).toBeCalled();
        expect(result).toBeDefined();
    });
});
