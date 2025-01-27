export type KeyOfUnion<T> = T extends any ? keyof T : never;

export type ChangedTableColumnNames<T> = Partial<Record<keyof T, string>>

export type TableColumnNames<T> = Array<Partial<KeyOfUnion<T>>>;