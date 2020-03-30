import {
    DocumentClient,
    UpdateExpression,
    ExpressionAttributeNameMap,
    ExpressionAttributeValueMap,
} from 'aws-sdk/clients/dynamodb';

import Transaction, { Id, UpdateItem } from 'typeddb/transaction';
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

    async findById(id: Id<Type>): Promise<Type | null> {
        const { Item: result } = await this.documentClient
            .get({
                TableName: this.configuration.table,
                Key: id,
            })
            .promise();

        return result as Type;
    }

    async insert(item: Type): Promise<Type> {
        const { Attributes: result } = await this.documentClient
            .put({
                TableName: this.configuration.table,
                Item: item,
                ReturnValues: 'ALL_OLD',
            })
            .promise();
        return result as Type;
    }

    async update(id: Id<Type>, item: UpdateItem<Type>): Promise<Type> {
        const { Attributes: result } = await this.documentClient
            .update({
                TableName: this.configuration.table,
                Key: id,
                UpdateExpression: this.createUpdateExpression(item),
                ExpressionAttributeNames: this.createExpressionAttributeNames<UpdateItem<Type>>(item),
                ExpressionAttributeValues: this.createExpressioAttributeValues<UpdateItem<Type>>(item),
                ReturnValues: 'ALL_NEW',
            })
            .promise();

        return result as Type;
    }

    query(): Promise<Type[] | null> {
        throw new Error('Method not implemented.');
    }

    delete(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    private createUpdateExpression(item: UpdateItem<Type>): UpdateExpression {
        return `set ${Object.keys(item).reduce((acc, key) => acc + `#${key} = :${key}, `, '')}`;
    }

    private createExpressionAttributeNames<Item>(item: Item): ExpressionAttributeNameMap {
        return Object.keys(item).reduce((acc, key) => ({ ...acc, [`#${key}`]: `:${key}` }), {});
    }

    private createExpressioAttributeValues<Item>(item: Item): ExpressionAttributeValueMap {
        return Object.entries(item).reduce((acc, entry) => ({ ...acc, [`:${entry[0]}`]: entry[1] }), {});
    }
}
