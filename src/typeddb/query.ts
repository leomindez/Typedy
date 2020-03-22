import { Schema } from './schema';

export type Operator = {
    kind: string;
};

interface Comparator<Type extends Schema> extends Operator {
    key: keyof Type;
    value: Type[keyof Type];
}

interface LogicalComparator<Type extends Schema> extends Operator {
    leftComparator: Comparator<Type>;
    rightComparator: Comparator<Type>;
}

type Equal<Type extends Schema> = Comparator<Type>;

export const equal = <Type extends Schema>(key: keyof Type, value: Type[keyof Type]): Equal<Type> => ({
    kind: 'equal',
    key,
    value,
});

type Greater<Type extends Schema> = Comparator<Type>;

export const greater = <Type extends Schema>(key: keyof Type, value: Type[keyof Type]): Greater<Type> => ({
    kind: 'greater',
    key,
    value,
});

type Less<Type extends Schema> = Comparator<Type>;

export const less = <Type extends Schema>(key: keyof Type, value: Type[keyof Type]): Less<Type> => ({
    kind: 'less',
    key,
    value,
});

type And<Type extends Schema> = LogicalComparator<Type>;

export const and = <Type extends Schema>(
    leftComparator: Comparator<Type>,
    rightComparator: Comparator<Type>,
): And<Type> => ({
    kind: 'and',
    leftComparator,
    rightComparator,
});

type Or<Type extends Schema> = LogicalComparator<Type>;

export const or = <Type extends Schema>(
    leftComparator: Comparator<Type>,
    rightComparator: Comparator<Type>,
): Or<Type> => ({
    kind: 'or',
    leftComparator,
    rightComparator,
});

type Operations<Type extends Schema> = Equal<Type> | Greater<Type> | Less<Type> | And<Type> | Or<Type>;

export type Query<Type extends Schema> = Operations<Type>;
