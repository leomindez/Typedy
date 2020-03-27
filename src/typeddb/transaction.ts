import { Schema } from './schema';
import { Query, equal } from './query';

export default interface Transaction<Type extends Schema> {
    find(item: Type): Promise<Type | null>;
    insert(item: Type, conditions: Query<Type>): Promise<Type>;
    update(item: Type, conditions: Query<Type>): Promise<Type>;
    query(query: Query<Type>): Promise<Array<Type> | null>;
    delete(item: Type, conditions: Query<Type>): Promise<void>;
}
