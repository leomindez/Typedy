import { Schema } from '../schema';
import { Query, QueryExpression } from '../query/query';

export default class QueryBuilder<Type extends Schema> {
    private queryString = '';
    private expression: object | undefined = {};

    build(query: Query<Type>): this {
        this.queryString = `${this.queryString}${this.interpretQuery(query)}`;
        this.expression = this.interpretExpression(query);
        return this;
    }

    getQueryExpression(): QueryExpression {
        return {
            query: this.queryString,
            expression: this.expression,
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
                return { ...this.expression, [`${query.key}`]: query.value };
            case 'greater':
                return { ...this.expression, [`${query.key}`]: query.value };
            case 'less':
                return { ...this.expression, [`${query.key}`]: query.value };
            case 'and':
                return Object.assign(
                    this.expression,
                    this.interpretExpression(query.left),
                    this.interpretExpression(query.right),
                );
            case 'or':
                return Object.assign(
                    this.expression,
                    this.interpretExpression(query.left),
                    this.interpretExpression(query.right),
                );
        }
    }
}
