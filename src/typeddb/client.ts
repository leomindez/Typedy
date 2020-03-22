import { DocumentClient, ClientConfiguration } from 'aws-sdk/clients/dynamodb';
import { Schema } from './schema';
import { Configuration } from './configuration';
import Transaction from './transaction';
import { v4 as uuid } from 'uuid';

export class Client<Type extends Schema> implements Transaction<Type> {
    private documentClient: DocumentClient;
    private configuration: Configuration;

    constructor(configuration: Configuration) {
        this.documentClient = new DocumentClient(configuration.options);
        this.configuration = configuration;
    }

    async find(): Promise<Type | undefined> {
        throw new Error();

        /* const id = operation.id;
        const { Item } = await this.documentClient
            .get({
                TableName: this.configuration.table,
                Key: { id: id },
            })
            .promise();

        return Item as Type; */
    }

    async insert(): Promise<Type> {
        throw new Error();
        /* operation.id = `${this.configuration.prefix}-${uuid()}`.toLocaleLowerCase();
        operation.createdAt = Date.now();
        await this.documentClient
            .put({
                TableName: this.configuration.table,
                Item: operation,
            })
            .promise();
        return operation; */
    }

    async update(): Promise<Type | undefined> {
        throw new Error();

        /*  operation.updatedAt = Date.now();
        const updatedItem: UpdateOperation<T> = operation;

        const { Attributes: Item } = await this.documentClient
            .update({
                TableName: this.configuration.table,
                Key: { id: operation.id },
                ExpressionAttributeValues: this.createExpressionAttributeValues(updatedItem),
                UpdateExpression: this.createUpdateExpressionFromObject(updatedItem),
            })
            .promise();

        return Item as T; */
    }

    async query(): Promise<Type[] | undefined> {
        throw new Error('Method not implemented.');
    }

    async delete(): Promise<void> {
        throw new Error();

        /*  await this.documentClient
            .delete({
                TableName: this.configuration.table,
                Key: { id: operation.id },
            })
            .promise(); */
    }

    /*   private createUpdateExpressionFromObject(item: UpdateOperation<T>): string {
        return `set${Object.keys(item)
            .map((key) => ` ${key} = :${key}`)
            .toString()}`;
    }

    private createConditionExpression(item: Operation<T>): string {
        return `${Object.keys(item)
            .map((key, index, keys) => `${key} = :${key} ${index < keys.length ? 'and ' : ''}`)
            .toString()}`;
    }

    private createExpressionAttributeValues(item: UpdateOperation<T>): T {
        return Object.entries(item).reduce((obj, entry) => {
            const attributeKey = `:${entry[0]}`;
            const attributeValue = entry[1];
            Object.assign(obj, { [attributeKey]: attributeValue });
            return obj;
        }, {}) as T;
    } */
}
