import { Schema } from './schema';
import { Query } from './query';

export default interface Transaction<Item extends Schema> {
    findById(item: FindById<Item>): Promise<Item | null>;
    insert(item: Item, conditions: Query<Item>): Promise<Item>;
    update(item: Item, conditions: Query<Item>): Promise<Item>;
    query(query: Query<Item>): Promise<Array<Item> | null>;
    delete(item: Item, conditions: Query<Item>): Promise<void>;
}

export type FindById<Type extends Schema> = Pick<Type, 'id'>;
