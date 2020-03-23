import { Schema } from '../typeddb/schema';
import { Query, equal, greater, less, and, or } from '../typeddb/query';

describe('Query Type', () => {
    test('return equals comparator structure', () => {
        const equalComparator: Query<Schema> = equal('id', '2939939394');
        expect(equalComparator).toBeDefined();
        expect(equalComparator.kind).toEqual('equal');
        expect(equalComparator.key).toEqual('id');
        expect(equalComparator.value).toEqual('2939939394');
    });

    test('return greater comparator structure', () => {
        const greaterComparator: Query<Schema> = greater('createdAt', '23/03/2020');
        expect(greaterComparator).toBeDefined();
        expect(greaterComparator.kind).toEqual('greater');
        expect(greaterComparator.key).toEqual('createdAt');
        expect(greaterComparator.value).toEqual('23/03/2020');
    });

    test('return less comparator structure', () => {
        const lessComparator: Query<Schema> = less('updatedAt', '18/02/2020');
        expect(lessComparator).toBeDefined();
        expect(lessComparator.kind).toEqual('less');
        expect(lessComparator.key).toEqual('updatedAt');
        expect(lessComparator.value).toEqual('18/02/2020');
    });

    test('return and logical comparator structure', () => {
        const andLogicalComparator: Query<Schema> = and(equal('id', '2939939394'), greater('updatedAt', '18/02/2020'));
        expect(andLogicalComparator).toBeDefined();
        expect(andLogicalComparator.leftComparator.kind).toEqual('equal');
        expect(andLogicalComparator.rightComparator.kind).toEqual('greater');
    });

    test('return or logical comparator structure', () => {
        const orLogicalComparator: Query<Schema> = or(
            less('updatedAt', '23/03/2020'),
            greater('updatedAt', '18/02/2020'),
        );
        expect(orLogicalComparator).toBeDefined();
        expect(orLogicalComparator.leftComparator.kind).toEqual('less');
        expect(orLogicalComparator.rightComparator.kind).toEqual('greater');
    });
});
