import { DocumentClient, ClientConfiguration } from 'aws-sdk/clients/dynamodb';

export type Configuration = {
    options?: DocumentClient.DocumentClientOptions & ClientConfiguration;
    prefix?: string;
    table: string;
};
