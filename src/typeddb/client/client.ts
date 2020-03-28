import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import Transaction, { FindById } from 'typeddb/transaction';
import { Schema } from 'typeddb/schema';
import { Configuration } from 'typeddb/configuration';

export default class Client<Type extends Schema> implements Transaction<Type> {
    private configuration: Configuration;
    private documentClient: DocumentClient;
    constructor(
        configuration: Configuration,
        documentClient: DocumentClient = new DocumentClient(configuration.options),
    ) {
        this.configuration = configuration;
        this.documentClient = documentClient;
    }

    async findById(item: FindById<Type>): Promise<Type | null> {
        const { Item: result } = await this.documentClient
            .get({
                TableName: this.configuration.table,
                Key: item,
            })
            .promise();

        return result as Type;
    }

    async insert(item: Type): Promise<Type> {
        await this.documentClient
            .put({
                TableName: this.configuration.table,
                Item: item,
            })
            .promise();

        return item;
    }

    update(): Promise<Type> {
        throw new Error('Method not implemented.');
    }

    query(): Promise<Type[] | null> {
        throw new Error('Method not implemented.');
    }

    delete(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    private toQueryString(): string {
        throw new Error('Method not implemented.');
    }
}
