import {
    DocumentClient,
    UpdateExpression,
    ExpressionAttributeNameMap,
    ExpressionAttributeValueMap,
} from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';

import Transaction, { Id, UpdateItem } from '../transaction';
import { Schema } from '../schema';
import { Configuration } from '../configuration';
import { QueryExpression } from '../query/query';
import { omit } from 'lodash';

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
        item = this.generateId(item);
        item = this.appendCreatedAtDate(item);
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
        let updatedItem: UpdateItem<Type> = omit(item, 'id');
        updatedItem = this.appendUpdatedAtDate(updatedItem);
        const { Attributes: result } = await this.documentClient
            .update({
                TableName: this.configuration.table,
                Key: { id: item.id },
                UpdateExpression: this.createUpdateExpression(updatedItem),
                ExpressionAttributeNames: this.createExpressionAttributeNames<UpdateItem<Type>>(updatedItem),
                ExpressionAttributeValues: this.createExpressioAttributeValues<UpdateItem<Type>>(updatedItem),
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
                ExpressionAttributeNames: this.createExpressionAttributeNames(query.expressionAttribute),
                ExpressionAttributeValues: this.createExpressioAttributeValues(query.expressionAttribute),
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

    private generateId(item: Type): Type {
        const uuidOptions = {
            random: [0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36],
        };
        if (this.configuration.idPrefix !== undefined && typeof this.configuration.idPrefix === 'string') {
            item.id = `${this.configuration.idPrefix}-${uuid()}`;
        }
        item.id = uuid(uuidOptions);
        return item;
    }

    private appendCreatedAtDate(item: Type): Type {
        item.createdAt = Date.now();
        return item;
    }

    private appendUpdatedAtDate(item: UpdateItem<Type>): UpdateItem<Type> {
        item.updatedAt = Date.now();
        return item;
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
