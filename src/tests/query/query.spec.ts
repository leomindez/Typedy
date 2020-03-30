import { Schema } from '../../typeddb/schema';
import { Query, equal, greater, less, and, or, interpretQuery } from '../../typeddb/query';

describe('Query Type', () => {
    test('should return equals comparator structure', () => {
        const equalQuery: Query<Schema> = equal('id', '2939939394');
        expect(equalQuery).toBeDefined();
        expect(equalQuery.kind).toEqual('equal');
        expect(equalQuery.key).toEqual('id');
        expect(equalQuery.value).toEqual('2939939394');
    });

    test('should return greater comparator structure', () => {
        const greaterQuery: Query<Schema> = greater('createdAt', '23/03/2020');
        expect(greaterQuery).toBeDefined();
        expect(greaterQuery.kind).toEqual('greater');
        expect(greaterQuery.key).toEqual('createdAt');
        expect(greaterQuery.value).toEqual('23/03/2020');
    });

    test('should return less comparator structure', () => {
        const lessQuery: Query<Schema> = less('updatedAt', '18/02/2020');
        expect(lessQuery).toBeDefined();
        expect(lessQuery.kind).toEqual('less');
        expect(lessQuery.key).toEqual('updatedAt');
        expect(lessQuery.value).toEqual('18/02/2020');
    });

    test('should return and logical comparator structure', () => {
        const andLogicalQuery: Query<Schema> = and(equal('id', '2939939394'), greater('updatedAt', '18/02/2020'));
        expect(andLogicalQuery).toBeDefined();
        expect(andLogicalQuery.leftComparator.kind).toEqual('equal');
        expect(andLogicalQuery.rightComparator.kind).toEqual('greater');
    });

    test('should return or logical comparator structure', () => {
        const orLogicalQuery: Query<Schema> = or(less('updatedAt', '23/03/2020'), greater('updatedAt', '18/02/2020'));
        expect(orLogicalQuery).toBeDefined();
        expect(orLogicalQuery.leftComparator.kind).toEqual('less');
        expect(orLogicalQuery.rightComparator.kind).toEqual('greater');
    });

    test('should return equal string', () => {
        const equalQuery = equal('id', '12345');
        const equalStringQuery = interpretQuery(equalQuery);
        expect(equalStringQuery).toEqual('id = 12345');
    });

    test('should return greater string', () => {
        const greaterQuery = greater('id', '12345');
        const greaterStringQuery = interpretQuery(greaterQuery);
        expect(greaterStringQuery).toEqual('id > 12345');
    });

    test('should return less string', () => {
        const lessQuery = less('id', '12345');
        const lessStringQuery = interpretQuery(lessQuery);
        expect(lessStringQuery).toEqual('id < 12345');
    });

    test('should return and string', () => {
        const andLogicalQuery: Query<Schema> = and(equal('id', '2939939394'), greater('updatedAt', '18/02/2020'));
        const andStringQuery = interpretQuery(andLogicalQuery);
        expect(andStringQuery).toEqual('id = 2939939394 and updatedAt > 18/02/2020');
    });

    test('should return or string', () => {
        const orLogicalQuery: Query<Schema> = or(less('updatedAt', '23/03/2020'), greater('updatedAt', '18/02/2020'));
        const orStringQuery = interpretQuery(orLogicalQuery);
        expect(orStringQuery).toEqual('updatedAt < 23/03/2020 or updatedAt > 18/02/2020');
    });
});
