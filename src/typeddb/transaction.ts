import { Schema } from './schema';
import { Query } from './query';

export default interface Transaction<Type extends Schema> {
    find(query: Query<Type>): Promise<Type | undefined>;
    insert(query: Query<Type>): Promise<Type>;
    update(query: Query<Type>): Promise<Type | undefined>;
    query(query: Query<Type>): Promise<Array<Type> | undefined>;
    delete(query: Query<Type>): Promise<void>;
}
