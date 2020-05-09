import QueryBuilder from '../../typedy/query/builder';
import { greater, equal, or, and, less } from '../../typedy/query/query';

describe('Query Builder class', () => {
    test('should return equal query expression', () => {
        const equalQueryExpression = new QueryBuilder().expression(equal('id', '28812882')).build();
        expect(equalQueryExpression.query).toBeDefined();
        expect(equalQueryExpression.expressionAttribute).toBeDefined();
        expect(equalQueryExpression.query).toEqual('id = :id');
        expect(equalQueryExpression.expressionAttribute).toEqual({ id: '28812882' });
    });

    test('should return greater query expression', () => {
        const greaterQueryExpression = new QueryBuilder().expression(greater('createdAt', '28812882')).build();
        expect(greaterQueryExpression.query).toBeDefined();
        expect(greaterQueryExpression.expressionAttribute).toBeDefined();
        expect(greaterQueryExpression.query).toEqual('createdAt > :createdAt');
        expect(greaterQueryExpression.expressionAttribute).toEqual({ createdAt: '28812882' });
    });

    test('should return less query expression', () => {
        const lessQueryExpression = new QueryBuilder().expression(less('updatedAt', '28812882')).build();
        expect(lessQueryExpression.query).toBeDefined();
        expect(lessQueryExpression.expressionAttribute).toBeDefined();
        expect(lessQueryExpression.query).toEqual('updatedAt < :updatedAt');
        expect(lessQueryExpression.expressionAttribute).toEqual({ updatedAt: '28812882' });
    });

    test('should return and query expression', () => {
        const andQueryExpression = new QueryBuilder()
            .expression(and(equal('updatedAt', '28812882'), greater('createdAt', '28838384')))
            .build();
        expect(andQueryExpression.query).toBeDefined();
        expect(andQueryExpression.expressionAttribute).toBeDefined();
        expect(andQueryExpression.query).toEqual('updatedAt = :updatedAt and createdAt > :createdAt');
        expect(andQueryExpression.expressionAttribute).toEqual({ createdAt: '28838384', updatedAt: '28812882' });
    });

    test('should return or query expression', () => {
        const orQueryExpression = new QueryBuilder()
            .expression(or(equal('updatedAt', '28812882'), greater('createdAt', '28838384')))
            .build();
        expect(orQueryExpression.query).toBeDefined();
        expect(orQueryExpression.expressionAttribute).toBeDefined();
        expect(orQueryExpression.query).toEqual('updatedAt = :updatedAt or createdAt > :createdAt');
        expect(orQueryExpression.expressionAttribute).toEqual({ createdAt: '28838384', updatedAt: '28812882' });
    });
});
