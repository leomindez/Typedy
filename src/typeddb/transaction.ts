import { Schema } from './schema';
import { Query } from './query';

export default interface Transaction<Item extends Schema> {
    findById(id: Id<Item>): Promise<Item | null>;
    insert(item: Item, conditions: Query<Item>): Promise<Item>;
    update(id: Id<Item>, item: UpdateItem<Item>, conditions: Query<Item>): Promise<Item>;
    query(query: Query<Item>): Promise<Array<Item> | null>;
    delete(item: Item, conditions: Query<Item>): Promise<void>;
}

export type Id<Type extends Schema> = Pick<Type, 'id'>;
export type UpdateItem<Type extends Schema> = Omit<Type, 'id'>;
