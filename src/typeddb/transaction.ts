import { Schema } from './schema';
import { Query } from './query';

export default interface Transaction<Type extends Schema> {
    find(item: Type): Promise<Type | undefined>;
    insert(item: Type): Promise<Type>;
    update(item: Type): Promise<Type | undefined>;
    query(query: Query<Type>): Promise<Array<Type> | undefined>;
    delete(item: Type): Promise<void>;
}
