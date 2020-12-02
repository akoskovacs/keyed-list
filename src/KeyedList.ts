export type KeyValueType = string;

export interface IKeyedList<T> {
    keyList: string[];
    elements: { [id: string]: T };
}

export interface ElementWithId {
  id: string;
}

/**
 * Create a keyed list from an array. The array elements, must
 * have unique "id" properties
 * 
 * ```typescript
 * const persons = [ { id: '1', name: 'Peter' }, { id: '2', name: 'John' }, { id: '3', name: 'Steve' } ];
 * const list = fromArray(persons);
 * 
 * const john = getById(list, '2');
 * ```
 */
export const fromArray = <T extends ElementWithId>(array: T[]) => {
    const keys = array.map(x => x.id);
    return {
        keyList: keys,
        elements: array.reduce((prev, curr) =>
            ({ ...prev, [curr.id]: { ...curr } })
            , {})
    };
};

export const toArray = <T extends ElementWithId>(list: IKeyedList<T>): T[] =>
    list.keyList.map(k => list.elements[k]) as T[];

export const getById = <T extends ElementWithId>(list: IKeyedList<T>, id: string): T | undefined => {
    return { ...list.elements[id] };
}

export const append = <T extends ElementWithId>(list: IKeyedList<T>,  x: T): IKeyedList<T> => {
    return {
        keyList: [ ...list.keyList, x.id ],
        elements: {
            ...list.elements,
            [x.id]: x
        }
    };
}

export const insert = <T extends ElementWithId>(list: IKeyedList<T>, x: T): IKeyedList<T>  => {
    return {
        keyList: [ x.id, ...list.keyList ],
        elements: {
            ...list.elements,
            [x.id]: x
        }
    };
}

export const removeById = <T extends ElementWithId>(list: IKeyedList<T>, id: string): IKeyedList<T>  => {
    return {
        keyList: list.keyList.filter(xid => xid !== id),
        elements: Object
          .values(list.elements)
          .reduce((prev, curr) => {
            return (curr.id === id)
              ? ({ ...prev })
              : ({ ...prev, [curr.id]: curr });
          }, {})
    };
}

export const remove = <T extends ElementWithId>(list: IKeyedList<T>, x: T): IKeyedList<T> => 
    removeById(list, x.id);

export const map = <T extends ElementWithId>(list: IKeyedList<T>
      , mapper: (x: T, index: number, xs: IKeyedList<T>) => T): T[]  => {
    var i = 0;
    return list.keyList.map(key => {
        const elem = list.elements[key] as T;
        return mapper(elem, i++, list)
    });
};

export const mapToList = <T extends ElementWithId>(list: IKeyedList<T>
      , mapper: (x: T, index: number, xs: IKeyedList<T>) => T): IKeyedList<T> =>
  fromArray<T>(map<T>(list, mapper));