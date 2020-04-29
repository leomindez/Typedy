import QueryBuilder from '../../typeddb/query/builder';
import { greater, equal, or, and, less } from '../../typeddb/query/query';

describe('Query Builder class', () => {
    test('should return equal query expression', () => {
        const queryBuilder = new QueryBuilder().build(equal('id', '28812882'));
        const equalQueryExpression = queryBuilder.getQueryExpression();
        expect(equalQueryExpression.query).toBeDefined();
        expect(equalQueryExpression.expression).toBeDefined();
        expect(equalQueryExpression.query).toEqual('id = :id');
        expect(equalQueryExpression.expression).toEqual({ id: '28812882' });
    });

    test('should return greater query expression', () => {
        const queryBuilder = new QueryBuilder().build(greater('createdAt', '28812882'));
        const greaterQueryExpression = queryBuilder.getQueryExpression();
        expect(greaterQueryExpression.query).toBeDefined();
        expect(greaterQueryExpression.expression).toBeDefined();
        expect(greaterQueryExpression.query).toEqual('createdAt > :createdAt');
        expect(greaterQueryExpression.expression).toEqual({ createdAt: '28812882' });
    });

    test('should return less query expression', () => {
        const queryBuilder = new QueryBuilder().build(less('updatedAt', '28812882'));
        const lessQueryExpression = queryBuilder.getQueryExpression();
        expect(lessQueryExpression.query).toBeDefined();
        expect(lessQueryExpression.expression).toBeDefined();
        expect(lessQueryExpression.query).toEqual('updatedAt < :updatedAt');
        expect(lessQueryExpression.expression).toEqual({ updatedAt: '28812882' });
    });

    test('should return and query expression', () => {
        const queryBuilder = new QueryBuilder().build(
            and(equal('updatedAt', '28812882'), greater('createdAt', '28838384')),
        );
        const andQueryExpression = queryBuilder.getQueryExpression();
        expect(andQueryExpression.query).toBeDefined();
        expect(andQueryExpression.expression).toBeDefined();
        expect(andQueryExpression.query).toEqual('updatedAt = :updatedAt and createdAt > :createdAt');
        expect(andQueryExpression.expression).toEqual({ createdAt: '28838384', updatedAt: '28812882' });
    });

    test('should return or query expression', () => {
        const queryBuilder = new QueryBuilder().build(
            or(equal('updatedAt', '28812882'), greater('createdAt', '28838384')),
        );
        const orQueryExpression = queryBuilder.getQueryExpression();
        expect(orQueryExpression.query).toBeDefined();
        expect(orQueryExpression.expression).toBeDefined();
        expect(orQueryExpression.query).toEqual('updatedAt = :updatedAt or createdAt > :createdAt');
        expect(orQueryExpression.expression).toEqual({ createdAt: '28838384', updatedAt: '28812882' });
    });
});
