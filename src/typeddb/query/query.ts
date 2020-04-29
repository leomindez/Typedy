import { Schema } from '../schema';

export type Equal<Type extends Schema> = {
    kind: 'equal';
    key: keyof Type;
    value: Type[keyof Type];
};

export const equal = <Type extends Schema>(key: keyof Type, value: Type[keyof Type]): Equal<Type> => ({
    kind: 'equal',
    key,
    value,
});

export type Greater<Type extends Schema> = {
    kind: 'greater';
    key: keyof Type;
    value: Type[keyof Type];
};

export const greater = <Type extends Schema>(key: keyof Type, value: Type[keyof Type]): Greater<Type> => ({
    kind: 'greater',
    key,
    value,
});

export type Less<Type extends Schema> = {
    kind: 'less';
    key: keyof Type;
    value: Type[keyof Type];
};

export const less = <Type extends Schema>(key: keyof Type, value: Type[keyof Type]): Less<Type> => ({
    kind: 'less',
    key,
    value,
});

export type And<Type extends Schema> = {
    kind: 'and';
    left: Query<Type>;
    right: Query<Type>;
};

export const and = <Type extends Schema>(left: Query<Type>, right: Query<Type>): And<Type> => ({
    kind: 'and',
    left,
    right,
});

export type Or<Type extends Schema> = {
    kind: 'or';
    left: Query<Type>;
    right: Query<Type>;
};

export const or = <Type extends Schema>(left: Query<Type>, right: Query<Type>): Or<Type> => ({
    kind: 'or',
    left,
    right,
});

export type Query<Type extends Schema> = Equal<Type> | Greater<Type> | Less<Type> | And<Type> | Or<Type>;

export type QueryExpression = {
    query: string;
    expression: object | undefined;
};
