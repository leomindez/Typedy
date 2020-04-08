import {
    DocumentClient,
    UpdateExpression,
    ExpressionAttributeNameMap,
    ExpressionAttributeValueMap,
} from 'aws-sdk/clients/dynamodb';

import Transaction, { Id, UpdateItem } from '../transaction';
import { Schema } from '../schema';
import { Configuration } from '../configuration';
import { Query, interpretQuery, QueryItem } from '../query';

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

    async query(query: Query<Type>): Promise<Type[] | null> {
        const queryItem = interpretQuery(query);
        const { Items: result } = await this.documentClient
            .scan({
                TableName: this.configuration.table,
                FilterExpression: this.createFilterExpression(queryItem),
                ExpressionAttributeNames: this.createExpressionAttributeNames(
                    this.createObjectFromQueryItem(queryItem),
                ),
                ExpressionAttributeValues: this.createExpressioAttributeValues(
                    this.createObjectFromQueryItem(queryItem),
                ),
            })
            .promise();
        return result as Type[];
    }

    async delete(id: Id<Type>): Promise<Type> {
       const { Attributes: result } = await this.documentClient
            .delete({
                TableName: this.configuration.table,
                Key: id,
                ReturnValues: "ALL_OLD"
            })
            .promise();
        return result as Type
    }

    private createUpdateExpression(item: UpdateItem<Type>): UpdateExpression {
        return `set ${Object.keys(item).reduce((acc, key) => acc + `#${key} = :${key}, `, '')}`;
    }

    private createFilterExpression(queryItem: QueryItem<Type>): string | undefined {
        switch (queryItem.operation) {
            case '=':
                return `${queryItem.rightValue} = :${queryItem.rightValue}`;
            case '>':
                return `${queryItem.rightValue} > :${queryItem.rightValue}`;
            case '<':
                return `${queryItem.rightValue} < :${queryItem.rightValue}`;
            case 'and':
                return `${this.createFilterExpression(
                    queryItem.leftValue as QueryItem<Type>,
                )} and ${this.createFilterExpression(queryItem.rightValue as QueryItem<Type>)}`;
            case 'or':
                return `${this.createFilterExpression(
                    queryItem.leftValue as QueryItem<Type>,
                )} or ${this.createFilterExpression(queryItem.rightValue as QueryItem<Type>)}`;
        }
    }

    private createObjectFromQueryItem(queryItem: QueryItem<Type>): object {
        if (typeof queryItem.leftValue === 'string' || typeof queryItem.rightValue === 'string') {
            return { [`${queryItem.leftValue}`]: queryItem.rightValue };
        }
        return Object.assign(
            this.createObjectFromQueryItem(queryItem.leftValue as QueryItem<Type>),
            this.createObjectFromQueryItem(queryItem.rightValue as QueryItem<Type>),
        );
    }

    private createExpressionAttributeNames<Item>(item: Item): ExpressionAttributeNameMap {
        return Object.keys(item).reduce((acc, key) => ({ ...acc, [`#${key}`]: `:${key}` }), {});
    }

    private createExpressioAttributeValues<Item>(item: Item): ExpressionAttributeValueMap {
        return Object.entries(item).reduce((acc, entry) => ({ ...acc, [`:${entry[0]}`]: entry[1] }), {});
    }
}
