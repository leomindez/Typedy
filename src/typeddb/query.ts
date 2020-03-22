import { Schema } from './schema';

export type Operator = {
    kind: string;
};

export interface Comparator<Type extends Schema> extends Operator {
    key: keyof Type;
    value: Type[keyof Type];
}

export interface LogicalComparator<Comparator> extends Operator {
    rightComparator: Comparator;
    leftComparator: Comparator;
}

export interface Equal<Type extends Schema> extends Comparator<Type> {
    kind: 'equals';
}

export interface Greater<Type extends Schema> extends Comparator<Type> {
    kind: 'greater';
}

export interface Less<Type extends Schema> extends Comparator<Type> {
    kind: 'less';
}

export interface And<Comparator> extends LogicalComparator<Comparator> {
    kind: 'and';
}

export interface Or<Comparator> extends LogicalComparator<Comparator> {
    kind: 'or';
}

export type Operations<Type extends Schema> = Equal<Type> | And<Type> | Greater<Type> | Less<Type> | Or<Type>;

export type Query<Type extends Schema> = Operations<Type>;
