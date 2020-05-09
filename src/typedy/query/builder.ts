import { Schema } from '../schema';
import { Query, QueryExpression } from './query';

export default class QueryBuilder<Type extends Schema> {
    private queryString = '';
    private queryExpression: object | undefined = {};

    expression(query: Query<Type>): this {
        this.queryString = `${this.queryString}${this.interpretQuery(query)}`;
        this.queryExpression = this.interpretExpression(query);
        return this;
    }

    build(): QueryExpression {
        return {
            query: this.queryString,
            expressionAttribute: this.queryExpression,
        };
    }

    private interpretQuery<Type extends Schema>(query: Query<Type>): string | undefined {
        switch (query.kind) {
            case 'equal':
                return `${query.key} = :${query.key}`;
            case 'greater':
                return `${query.key} > :${query.key}`;
            case 'less':
                return `${query.key} < :${query.key}`;
            case 'and':
                return `${this.interpretQuery(query.left)} and ${this.interpretQuery(query.right)}`;
            case 'or':
                return `${this.interpretQuery(query.left)} or ${this.interpretQuery(query.right)}`;
        }
    }

    private interpretExpression<Type extends Schema>(query: Query<Type>): object | undefined {
        switch (query.kind) {
            case 'equal':
                return { ...this.queryExpression, [`${query.key}`]: query.value };
            case 'greater':
                return { ...this.queryExpression, [`${query.key}`]: query.value };
            case 'less':
                return { ...this.queryExpression, [`${query.key}`]: query.value };
            case 'and':
                return Object.assign(
                    this.queryExpression,
                    this.interpretExpression(query.left),
                    this.interpretExpression(query.right),
                );
            case 'or':
                return Object.assign(
                    this.queryExpression,
                    this.interpretExpression(query.left),
                    this.interpretExpression(query.right),
                );
        }
    }
}
