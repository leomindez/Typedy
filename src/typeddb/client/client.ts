import {
    DocumentClient,
    UpdateExpression,
    ExpressionAttributeNameMap,
    ExpressionAttributeValueMap,
} from 'aws-sdk/clients/dynamodb';

import Transaction, { Id, UpdateItem } from '../transaction';
import { Schema } from '../schema';
import { Configuration } from '../configuration';
import { QueryExpression } from '../query/query';

export default class Client<Type extends Schema> implements Transaction<Type> {
    private configuration: Configuration;
    private documentClient: DocumentClient;
    constructor(configuration: Configuration, documentClient: DocumentClient) {
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

    async update(item: Type): Promise<Type> {
        const updateItem: UpdateItem<Type> = item;
        const { Attributes: result } = await this.documentClient
            .update({
                TableName: this.configuration.table,
                Key: { id: item.id },
                UpdateExpression: this.createUpdateExpression(item),
                ExpressionAttributeNames: this.createExpressionAttributeNames<UpdateItem<Type>>(updateItem),
                ExpressionAttributeValues: this.createExpressioAttributeValues<UpdateItem<Type>>(updateItem),
                ReturnValues: 'ALL_NEW',
            })
            .promise();

        return result as Type;
    }

    async query(query: QueryExpression): Promise<Type[] | null> {
        const { Items: result } = await this.documentClient
            .scan({
                TableName: this.configuration.table,
                FilterExpression: query.query,
                ExpressionAttributeNames: this.createExpressionAttributeNames(query.expression),
                ExpressionAttributeValues: this.createExpressioAttributeValues(query.expression),
            })
            .promise();
        return result as Type[];
    }

    async delete(id: Id<Type>): Promise<Type> {
        const { Attributes: result } = await this.documentClient
            .delete({
                TableName: this.configuration.table,
                Key: id,
                ReturnValues: 'ALL_OLD',
            })
            .promise();
        return result as Type;
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
