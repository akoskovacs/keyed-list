export type KeyValueType = string;

export type ElementWithKey<K> = Record<K & KeyValueType, KeyValueType>;
export type ElementWithId = ElementWithKey<'id'>;
export type ElementsWithId<T extends ElementWithId> = { [id: string]: T; };

export interface IdKeyedList<T extends ElementWithId> {
    keys: Array<KeyValueType>;
    elements: ElementsWithId<T>;
}

/**
 * Create a keyed list from an array. The array elements, must
 * have unique "id" properties
 * 
 * ```typescript
 * const persons = [
 *   { id: '1', name: 'Peter' },
 *   { id: '2', name: 'John'  },
 *   { id: '3', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const john = keyedList.getById(list, '2');
 * ```
 */
export const fromArray = <T extends ElementWithId>(array: T[] = []): IdKeyedList<T> => {
    const keys = array.map(x => x.id);
    return {
        keys: keys,
        elements: array.reduce((prev, curr) =>
            ({ ...prev, [curr.id]: { ...curr } })
            , {})
    };
};

/**
 * Convert the keyed list to an array.
 * 
 * ```typescript
 * const exampleFirstElem = (list: IdKeyedList<Person>) => {
 *      const asArray = keyedList.toArray(persons);
 *      return asArray[0].length > 0 ? asArray[0] : undefined;
 * }
 * ```
 */
export const toArray = <T extends ElementWithId>(list: IdKeyedList<T>): T[] =>
    list.keys.map(k => ({ ...list.elements[k] }));

/**
 * Gets an element by the key, which is the id property of the object here.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const steve = keyedList.getById(list, '331');
 * ```
 */
export const getById = <T extends ElementWithId>(list: IdKeyedList<T>, id: string): T | undefined => list.elements[id];

/**
 * Get all the ids of the list.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const ids = keyedList.getIds(list);
 * // ids == [ '100', '211', '331' ]
 * 
 * ```
 */
export const getIds = <T extends ElementWithId>(list: IdKeyedList<T>): string[] =>
    ([ ...list.keys ]);

/**
 * Gets multiple elements by their ids.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const newList = keyedList.getByIds(list, [ '100', '331', '500' ]); // 500 is not found not in the list [
 * //  { id: '100', name: 'Peter' },
 * //  { id: '331', name: 'Steve' }
 * //];
 * 
 * ```
 */
export const getByIds = <T extends ElementWithId>(list: IdKeyedList<T>, ids: Array<string>): T[] => {
    const newElements: T[] = [];
    ids.map(id => {
        const x = list.elements[id];
        if (x) {
            newElements.push({ ...x });
        }
    });
    return newElements;
};

/**
 * Gets the id at a given index.
*/
export const getIdByIndex =  <T extends ElementWithId>(list: IdKeyedList<T>, index: number): string | undefined => {
    if (index >= 0)
        return list.keys[index];
    return undefined;
};

/**
 * Update element.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const newList = keyedList.update(list, '100', {
 *  name: 'Tom'
 * }); // [
 * //  { id: '100', name: 'Tom' },
 * //  { id: '211', name: 'John' },
 * //  { id: '331', name: 'Steve' }
 * //];
 * 
 * ```
 */
export const update = <T extends ElementWithId>(list: IdKeyedList<T>, elemProps: Partial<T> & ElementWithId | T): IdKeyedList<T> => ({
    ...list,
    elements: {
        ...list.elements,
        [elemProps.id]: Object.assign({}, list.elements[elemProps.id], elemProps)
    }
});


/**
 * Returns the first element of the list.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const peter = keyedList.getFirst(list);
 * ```
 */
export const getFirst = <T extends ElementWithId>(list: IdKeyedList<T>): T | undefined => {
    return list.elements[list.keys[0]];
}

/**
 * Returns the last element of the list.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const steve = keyedList.getLast(list);
 * ```
 */
export const getLast = <T extends ElementWithId>(list: IdKeyedList<T>): T | undefined => {
    return list.elements[list.keys[list.keys.length - 1]];
}

/**
 * Returns the element of the given index.
 * The indicies are starting from 0, just like for arrays.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const john = keyedList.getByIndex(list, 2);
 * ```
 */
export const getByIndex = <T extends ElementWithId>(list: IdKeyedList<T>, index: number): T | undefined => {
    const idByIndex = list.keys[index];
    return idByIndex ? list.elements[idByIndex] : undefined;
}

/**
 * Adds a new item to the end of the list.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const newList = keyedList.append(list, {
 *  id: '411',
 *  name: 'Emily'
 * });
 * 
 * const asArray = keyedList.toArray(newList); // = [
 * //  { id: '100', name: 'Peter' },
 * //  { id: '211', name: 'John'  },
 * //  { id: '331', name: 'Steve' },
 * //  { id: '411', name: 'Emily' }
 * // ]; 
 * ```
 * 
 */
export const append = <T extends ElementWithId>(list: IdKeyedList<T>,  x: T): IdKeyedList<T> => {
    return {
        keys: [ ...list.keys, x.id ],
        elements: {
            ...list.elements,
            [x.id]: x
        }
    };
}

/**
 * Adds a new item to the beginning of the list.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const newList = keyedList.append(list, {
 *  id: '411',
 *  name: 'Emily'
 * });
 * 
 * const asArray = keyedList.toArray(newList); // = [
 * //  { id: '411', name: 'Emily' },
 * //  { id: '100', name: 'Peter' },
 * //  { id: '211', name: 'John'  },
 * //  { id: '331', name: 'Steve' }
 * // ]; 
 * ```
 * 
 */
export const insert = <T extends ElementWithId>(list: IdKeyedList<T>, x: T): IdKeyedList<T> => {
    return {
        keys: [ x.id, ...list.keys ],
        elements: {
            ...list.elements,
            [x.id]: x
        }
    };
}

/**
 * Get element count of the list.
 */
export const getCount = <T extends ElementWithId>(list: IdKeyedList<T>): number =>
    list.keys.length;
 
/**
 * Removes the specified element.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const newList = keyedList.removeById(persons, '211')
 * 
 * const asArray = keyedList.toArray(newList); // = [
 * //  { id: '100', name: 'Peter' },
 * //  { id: '331', name: 'Steve' }
 * // ]; 
 * ```
 */
export const removeById = <T extends ElementWithId>(list: IdKeyedList<T>, id: string): IdKeyedList<T>  => {
    const newKeyes = list.keys.filter(xid => xid !== id)
    return {
        keys: newKeyes,
        elements: Object
          .values(list.elements)
          .reduce((prev, curr) => {
            return (curr.id === id)
              ? ({ ...prev })
              : ({ ...prev, [curr.id]: curr });
          }, {})
    };
}

/**
 * Removes the specified element.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const newList = keyedList.remove(persons, '211')
 * 
 * const asArray = keyedList.toArray(newList); // = [
 * //  { id: '100', name: 'Peter' },
 * //  { id: '331', name: 'Steve' }
 * // ]; 
 * ```
 */
export const remove = <T extends ElementWithId>(list: IdKeyedList<T>, x: T): IdKeyedList<T> => 
    removeById(list, x.id);

/**
 * Map through the list.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const nameArray = keyedList.map(persons, (person, index) => {
 *  console.log(`${ index + 1 }. - ${ person.name }`)
 *  return person.name;
 * });
 * ```
 */
export const map = <T extends ElementWithId>(list: IdKeyedList<T>
      , mapper: (x: T, index: number, xs: IdKeyedList<T>) => T) => {
    var i = 0;
    return list.keys.map(key => {
        const elem = { ...list.elements[key] };
        return mapper(elem, i++, list)
    });
};

/**
 * Map through the indices list.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const idArray = keyedList.mapIds(persons, (id, index) => {
 *  console.log(`${ index + 1 }. - ${ id }`)
 *  return id;
 * });
 * ```
 */
export const mapIds = <T extends ElementWithId>(list: IdKeyedList<T>
      , mapper: (id: string, index: number, xs: IdKeyedList<T>) => string) => {
    return list.keys.map((id, i) => mapper(id, i, list));
};

/**
 * Filter through the list.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * const nameArray = keyedList.filter(persons, (person, index) => {
 *  console.log(`${ index + 1 }. - ${ person.name }`)
 *  return person.name;
 * });
 * ```
 */
export const filter = <T extends ElementWithId>(list: IdKeyedList<T>, filterFunction: (x: T) => boolean) => {
    const keys = list.keys.filter(id => {
        const elem = list.elements[id];
        return filterFunction(elem);
    });
    return getByIds(list, keys);
};

/**
 * Sorts a list.
 * 
 * ```typescript
 * const persons = [
 *   { id: '100', name: 'Peter' },
 *   { id: '211', name: 'John'  },
 *   { id: '331', name: 'Steve' }
 * ];
 * const list = keyedList.fromArray(persons);
 * 
 * // Sort by age
 * const byAge = keyedList.sort(persons, (left, right) => left.age - right.age);
 * ```
 */
export const sort = <T extends ElementWithId>(list: IdKeyedList<T>, compareWith: (lval: T, rval: T) => number): IdKeyedList<T> => {
    const sortedElems = toArray(list).sort(compareWith);
    return {
        keys: sortedElems.map(x => x.id),
        elements: sortedElems.reduce((prev, elem) => {
            prev[elem.id] = elem;
            return prev;
        }, {} as ElementsWithId<T>)
    };
}