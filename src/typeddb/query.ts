import { Schema } from './schema';

type Equal<Type extends Schema> = {
    kind: 'equal';
    key: keyof Type;
    value: Type[keyof Type];
};

export const equal = <Type extends Schema>(key: keyof Type, value: Type[keyof Type]): Equal<Type> => ({
    kind: 'equal',
    key,
    value,
});

type Greater<Type extends Schema> = {
    kind: 'greater';
    key: keyof Type;
    value: Type[keyof Type];
};

export const greater = <Type extends Schema>(key: keyof Type, value: Type[keyof Type]): Greater<Type> => ({
    kind: 'greater',
    key,
    value,
});

type Less<Type extends Schema> = {
    kind: 'less';
    key: keyof Type;
    value: Type[keyof Type];
};

export const less = <Type extends Schema>(key: keyof Type, value: Type[keyof Type]): Less<Type> => ({
    kind: 'less',
    key,
    value,
});

type And<Type extends Schema> = {
    kind: 'and';
    leftComparator: Query<Type>;
    rightComparator: Query<Type>;
};

export const and = <Type extends Schema>(leftComparator: Query<Type>, rightComparator: Query<Type>): And<Type> => ({
    kind: 'and',
    leftComparator,
    rightComparator,
});

type Or<Type extends Schema> = {
    kind: 'or';
    leftComparator: Query<Type>;
    rightComparator: Query<Type>;
};

export const or = <Type extends Schema>(leftComparator: Query<Type>, rightComparator: Query<Type>): Or<Type> => ({
    kind: 'or',
    leftComparator,
    rightComparator,
});

export type Query<Type extends Schema> = Equal<Type> | Greater<Type> | Less<Type> | And<Type> | Or<Type>;
