import {DocumentClient, ClientConfiguration} from 'aws-sdk/clients/dynamodb';
import {v4 as uuid}  from 'uuid';

export namespace TypedDB {
  
    export type Entity = {
      id: string | number,
      createdAt: string | number, 
      updatedAt: string | number
    }

    type Operation<T extends Entity> = {[K in keyof T]: T[K]}
    type UpdateOperation<T extends Entity> = Omit<Operation<T>, "id">
    
    interface Operations<T extends Entity> {
        find(operation: Operation<T>): Promise<T | undefined>
        insert(operation: Operation<T>) : Promise<T>
        update(operation: Operation<T>) : Promise<T | undefined>
        query(operation: Operation<T>): Promise<Array<T> | undefined>
        delete(operation: Operation<T>): Promise<void>
    }

    export interface Configuration {
        options?: DocumentClient.DocumentClientOptions & ClientConfiguration,
        prefix?: string,
        table: string
    }

    export class Client<T extends Entity> implements Operations<T> {
      private documentClient: DocumentClient;
      private configuration: Configuration;
      constructor(configuration: Configuration) {
        this.documentClient = new DocumentClient(configuration.options)
        this.configuration = configuration;
      }

      async find(operation: Operation<T>): Promise<T | undefined> {
        const id = operation.id;
        const {Item} = await this.documentClient.get({
          TableName: this.configuration.table,
          Key: {id: id}
        }).promise();

        return Item as T
      } 
      
      async insert(operation: Operation<T>): Promise<T> {
        operation.id = `${this.configuration.prefix}-${uuid()}`.toLocaleLowerCase()
        operation.createdAt = Date.now()
        await this.documentClient.put({
          TableName: this.configuration.table,
          Item: operation
        }).promise()
        return operation
      }

      async update(operation: Operation<T>): Promise<T | undefined> {
        operation.updatedAt = Date.now()
        const updatedItem: UpdateOperation<T> = operation

        const {Attributes: Item } = await this.documentClient.update({
          TableName: this.configuration.table,
          Key: {id: operation.id}, 
          ExpressionAttributeValues: this.createExpressionAttributeValues(updatedItem), 
          UpdateExpression: this.createUpdateExpressionFromObject(updatedItem)
        }).promise()

        return Item as T
      }

      async query(operation: Operation<T>): Promise<T[] | undefined> {
        throw new Error('Method not implemented.');
      }

      async delete(operation: Operation<T>): Promise<void> {
        await this.documentClient.delete({
          TableName: this.configuration.table,
          Key: {id: operation.id}
        }).promise()
      }

      private createUpdateExpressionFromObject(item: UpdateOperation<T>): string {
        return `set${Object.keys(item)
          .map(key => ` ${key} = :${key}`)
          .toString()}`;
      }
      
      private createConditionExpression(item: Operation<T>): string {
        return `${Object.keys(item)
          .map((key, index, keys) => `${key} = :${key} ${index<keys.length?'and ':''}`)
          .toString()}`;
      }

      private createExpressionAttributeValues(item: UpdateOperation<T>): T {
        return Object.entries(item).reduce((obj, entry) => {
          const attributeKey = `:${entry[0]}`;
          const attributeValue = entry[1];
          Object.assign(obj, { [attributeKey]: attributeValue });
          return obj;
        }, {}) as T;
      }
    }
}
