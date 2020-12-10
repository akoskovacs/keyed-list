import { keyedList } from '../index';
import { getById, getCount, getFirst, getLast, IdKeyedList } from '../KeyedList';

interface SomeData {
  id: string;
  name: string;
  age: number;
}

const generateData = (): SomeData[] => (
  [
    { id: '123', name: 'John', age: 51 },
    { id: '111', name: 'Alfred', age: 12 },
    { id: '98', name: 'Jon', age: 31 }
  ]
);

const assertJohnElement = (first?: SomeData) => {
  expect(first).toBeDefined();
  expect(first?.name).toBe('John');
  expect(first?.age).toBe(51);
};

const assertJohn = (list: IdKeyedList<SomeData>) => {
  const first = keyedList.getById(list, '123');
  assertJohnElement(first);
};

const assertAlfredElement = (second?: SomeData) => {
  expect(second).toBeDefined();
  expect(second?.name).toBe('Alfred');
  expect(second?.age).toBe(12);
};

const assertAlfred = (list: IdKeyedList<SomeData>) => {
  const second = keyedList.getById(list, '111');
  assertAlfredElement(second);
};

const assertJonElement = (last?: SomeData) => {
  expect(last).toBeDefined();
  expect(last?.name).toBe('Jon');
  expect(last?.age).toBe(31);
};

const assertJon = (list: IdKeyedList<SomeData>) => {
  const last = keyedList.getById(list, '98');
  assertJonElement(last);
};

const assertListElements = (list: IdKeyedList<SomeData>) => {
  assertJon(list);
  assertJohn(list);
  assertAlfred(list);
};

const assertData = (someData: SomeData[]) => {
  assertJohnElement(someData[0]);
  assertAlfredElement(someData[1]);
  assertJonElement(someData[2]);
};

test('shows that the array conversion is immutable', () => {
  const someData = generateData();
  const c = keyedList.fromArray(someData);

  expect((c.elements as any)['111'].name).toBe('Alfred');
  someData[1].name = 'Paul';
  expect((c.elements as any)['111'].name).toBe('Alfred');
});

test('shows that the retrieval of elements is immutable', () => {
  const someData = generateData();
  const c = keyedList.fromArray(someData);

  someData[1].age = 23;

  const second = keyedList.getById(c, '111');
  expect(second?.age).toBe(12);
  someData[1].age = 23;
  expect(second?.age).toBe(12);
});

test('shows that the retrieval of multiple elements is possible', () => {
  const someData = generateData();
  const c = keyedList.fromArray(someData);
  const byIds = keyedList.getByIds(c, [ '111', '123', '551' ]);
  expect(c).toBeDefined();
  expect(byIds).toBeDefined();
  expect(byIds.length).toBe(2);
  expect(byIds[0]).toStrictEqual(someData[1]);
  expect(byIds[1]).toStrictEqual(someData[0]);
  assertData(someData);
});

test('shows that the retrieval of an empty key array yields an empty array', () => {
  const someData = generateData();
  const c = keyedList.fromArray(someData);
  const byIds = keyedList.getByIds(c, []);
  expect(c).toBeDefined();
  expect(byIds).toBeDefined();
  expect(byIds).toStrictEqual([]);

  const notFound = keyedList.getByIds(c, [ '999', '121' ]);
  expect(notFound).toBeDefined();
  expect(notFound).toStrictEqual([]);
  assertData(someData);
});

test('shows that the conversion in both ways work', () => {
  const someData = generateData();
  const a = keyedList.fromArray(someData);
  const b = keyedList.toArray(a);
  expect(b).toBeDefined();
  expect(b).toStrictEqual(someData);
  assertData(someData);
});

test('shows that a property of an element can be immutably updated', () => {
  const someData = generateData();
  const list = keyedList.fromArray(someData);

  const newList = keyedList.update(list, {
    id: '111',
    name: 'Tom'
  });

  expect(list).toBeDefined();
  expect(newList).toBeDefined();

  assertListElements(list);

  assertJohn(newList)

  const second = keyedList.getById(newList, '111');
  expect(second).toBeDefined();
  expect(second?.name).toEqual('Tom');
  expect(second?.age).toBe(12);
  expect(newList).not.toBe(list);
  assertJon(newList);
  assertData(someData);
});

test('shows that multiple properties of an element can be immutably updated', () => {
  const someData = generateData();
  const list = keyedList.fromArray(someData);

  const newList = keyedList.update(list, {
    id: '111',
    name: 'Tom',
    age: 21
  });

  expect(list).toBeDefined();
  expect(newList).toBeDefined();

  assertListElements(list);

  assertJohn(newList)

  const second = keyedList.getById(newList, '111');
  expect(second).toBeDefined();
  expect(second?.name).toEqual('Tom');
  expect(second?.age).toBe(21);
  assertJon(newList);
  assertData(someData);
});

test('shows that the first element of the list can be retrived', () => {
  const someData = generateData();
  const list = keyedList.fromArray(someData);

  const first = getFirst(list);
  assertJohnElement(first);

  assertAlfred(list);
  assertJon(list);
  assertData(someData);
});

test('shows that the last element of the list can be retrived', () => {
  const someData = generateData();
  const list = keyedList.fromArray(someData);

  const last = getLast(list);
  assertJonElement(last);

  assertJohn(list);
  assertAlfred(list);
  assertData(someData);
});

test('shows that elements can be retrived by index', () => {
  const someData = generateData();
  const empty = keyedList.fromArray();
  const list = keyedList.fromArray(someData);

  const none = keyedList.getByIndex(empty, 0);
  const none1 = keyedList.getByIndex(empty, 1);

  const first = keyedList.getByIndex(list, 0);
  const second = keyedList.getByIndex(list, 1);
  const third = keyedList.getByIndex(list, 2);


  expect(none).not.toBeDefined();
  expect(none1).not.toBeDefined();

  assertJohnElement(first);
  assertAlfredElement(second);
  assertJonElement(third);

  assertJohn(list);
  assertAlfred(list);
  assertData(someData);
});

test('shows that appending to the end of the list is possible and immutable', () => {
  const someData = generateData();
  const list = keyedList.fromArray(someData);

  const newList = keyedList.append(list, {
    id: '555',
    name: 'Jean',
    age: 16
  });
  const last = keyedList.getLast(newList);
  expect(last).toBeDefined();
  expect(last?.id).toBe('555');
  expect(last?.name).toBe('Jean');
  expect(last?.age).toBe(16);

  const count = keyedList.getCount(list);
  const newCount = keyedList.getCount(newList);
  expect(count).toBe(3);
  expect(newCount).toBe(4);

  assertData(someData);
  assertListElements(list);
  assertListElements(newList);
});

test('shows that inserting to the beginning of the list is possible and immutable', () => {
  const someData = generateData();
  const list = keyedList.fromArray(someData);

  const newList = keyedList.insert(list, {
    id: '555',
    name: 'Jean',
    age: 16
  });
  const first = keyedList.getFirst(newList);
  expect(first).toBeDefined();
  expect(first?.id).toBe('555');
  expect(first?.name).toBe('Jean');
  expect(first?.age).toBe(16);

  const count = keyedList.getCount(list);
  const newCount = keyedList.getCount(newList);
  expect(count).toBe(3);
  expect(newCount).toBe(4);

  assertData(someData);
  assertListElements(list);
  assertListElements(newList);
});

test('shows that counting works on empty, single and multiple element lists', () => {
  const someData = generateData();
  const empty = keyedList.fromArray();
  const single = keyedList.fromArray([{
    id: '111',
    name: 'Luka',
    age: 30
  }]);

  const list = keyedList.fromArray(someData);

  expect(getCount(empty)).toBe(0);
  expect(getCount(single)).toBe(1);
  expect(getCount(list)).toBe(3);
  assertData(someData);
});

test('shows that removal of and element by its id works on empty and is immutable', () => {
  const someData = generateData();
  const list = keyedList.fromArray(someData);

  const oneRemoved = keyedList.removeById(list, '111');

  const allRemoved = keyedList.removeById(
    keyedList.removeById(oneRemoved, '98'), '123');

  expect(getCount(list)).toBe(3);
  expect(getCount(oneRemoved)).toBe(2);
  assertJohn(oneRemoved);
  assertJon(oneRemoved);

  expect(allRemoved).toBeDefined();
  expect(getCount(allRemoved)).toBe(0);
  expect(getById(allRemoved, '123')).not.toBeDefined();
  expect(getById(allRemoved, '111')).not.toBeDefined();
  expect(getById(allRemoved, '98')).not.toBeDefined();

  assertData(someData);
});

test('shows that an array can be converted and retrieved', () => {
  const someData = generateData();
  const c = keyedList.fromArray(someData);

  assertListElements(c);
  assertData(someData);
});

test('shows that elements can be retrieved', () => {
  const someData = generateData();
  const c = keyedList.fromArray(someData);

  const last = keyedList.getById(c, '98');
  expect(last).toBeDefined();
  expect(last?.name).toBe('Jon');
  expect(last?.age).toBe(31);
  expect(last).not.toBe(someData[0]);
  assertData(someData);
});

test('shows that an array can be converted in either direction', () => {
  const someData = generateData();
  const c = keyedList.fromArray(someData);
  const a = keyedList.toArray(c);

  expect(c).toBeDefined();
  expect(a).toBeDefined();
  expect(someData).toStrictEqual(a);
  expect(someData).not.toBe(a);
  assertData(someData);
});

test('shows that an empty array can be converted in either direction', () => {
  const c = keyedList.fromArray();
  const a = keyedList.toArray(c);

  expect(c).toBeDefined();
  expect(a).toBeDefined();
  expect(c).toStrictEqual({
    keys: [],
    elements: {}
  });
  expect(a).toStrictEqual([]);
});

test('shows that elements can be retrieved by key', () => {
  const someData = generateData();
  const emptyList = keyedList.fromArray();
  const someList = keyedList.fromArray(someData);

  expect(emptyList).toBeDefined();
  expect(someList).toBeDefined();

  const emptyIds = keyedList.getIds(emptyList);
  expect(emptyList).toBeDefined();
  expect(emptyIds).toStrictEqual([]);

  const dataIds = keyedList.getIds(someList);
  expect(dataIds).toBeDefined();
  expect(dataIds).toStrictEqual(['123', '111', '98']);
  expect(dataIds).not.toBe(someList.keys);
  assertData(someData);
});

test('shows that keys can be retrieved', () => {
  const someData = generateData();
  const emptyList = keyedList.fromArray();
  const someList = keyedList.fromArray(someData);

  expect(emptyList).toBeDefined();
  expect(someList).toBeDefined();

  const emptyIds = keyedList.getIds(emptyList);
  expect(emptyList).toBeDefined();
  expect(emptyIds).toStrictEqual([]);

  const dataIds = keyedList.getIds(someList);
  expect(dataIds).toBeDefined();
  expect(dataIds).toStrictEqual(['123', '111', '98']);
  expect(dataIds).not.toBe(someList.keys);
  assertData(someData);
});

test('shows that an array can be mapped in order', () => {
  const someData = generateData();
  const c = keyedList.fromArray(someData);

  var gotData: SomeData[] = [];
  var gotIndicies: number[] = [];
  var gotLists: keyedList.IdKeyedList<SomeData>[] = [];
  const returned = keyedList.map<SomeData>(c, (x, i, l) => {
    gotData.push(x);
    gotIndicies.push(i);
    gotLists.push(l);
    return x;
  });

  expect(gotData).toStrictEqual(someData);
  expect(gotData).toStrictEqual(returned);
  expect(gotIndicies).toStrictEqual([0, 1, 2]);
  expect(gotLists).toStrictEqual([c, c, c]);
  assertData(someData);
});

test('shows that elements can be filtered into an array and the elements are immutable', () => {
  const someData = generateData();

  const list = keyedList.fromArray(someData);
  const youngerThan30 = keyedList.filter(list, x => x.age < 30);
  const olderThan30 = keyedList.filter(list, x => x.age >= 30);

  expect(youngerThan30).toBeDefined();
  expect(youngerThan30.length).toBe(1);
  assertAlfredElement(youngerThan30[0]);

  expect(olderThan30).toBeDefined();
  expect(olderThan30.length).toBe(2);
  assertJohnElement(olderThan30[0]);
  assertJonElement(olderThan30[1]);

  assertListElements(list);
  assertData(someData);
});

test('shows that elements can be sorted immutably, by a custom sort function', () => {
  const someData = generateData();

  const list = keyedList.fromArray(someData);
  const byAge = keyedList.sort(list, (left, right) => left.age - right.age);

  const first = keyedList.getFirst(byAge);
  const second = keyedList.getByIndex(byAge, 1);
  const third = keyedList.getLast(byAge);

  assertJonElement(second);
  assertAlfredElement(first);
  assertJohnElement(third);

  assertListElements(list);
  assertData(someData);
});