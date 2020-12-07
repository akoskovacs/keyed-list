import { keyedList } from '../index';
import { IdKeyedList } from '../KeyedList';

interface SomeData {
  id: string;
  name: string;
  age: number;
}

const generateData = (): SomeData[] => (
  [
    { id: '123', name: 'John', age: 31 },
    { id: '111', name: 'Alfred', age: 12 },
    { id: '98', name: 'Jon', age: 51 }
  ]
);

const assertFirst = (list: IdKeyedList<SomeData>) => {
  const first = keyedList.getById(list, '123');
  expect(first).toBeDefined();
  expect(first?.name).toBe('John');
  expect(first?.age).toBe(31);
};

const assertSecond = (list: IdKeyedList<SomeData>) => {
  const second = keyedList.getById(list, '111');
  expect(second).toBeDefined();
  expect(second?.name).toBe('Alfred');
  expect(second?.age).toBe(12);
};

const assertLast = (list: IdKeyedList<SomeData>) => {
  const last = keyedList.getById(list, '98');
  expect(last).toBeDefined();
  expect(last?.name).toBe('Jon');
  expect(last?.age).toBe(51);
};

const assertListElements = (list: IdKeyedList<SomeData>) => {
  assertLast(list);
  assertFirst(list);
  assertSecond(list);
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
});

test('shows that the conversion in both ways work', () => {
  const someData = generateData();
  const a = keyedList.fromArray(someData);
  const b = keyedList.toArray(a);
  expect(b).toBeDefined();
  expect(b).toStrictEqual(someData);
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

  assertFirst(newList)

  const second = keyedList.getById(newList, '111');
  expect(second).toBeDefined();
  expect(second?.name).toEqual('Tom');
  expect(second?.age).toBe(12);
  expect(newList).not.toBe(list);
  assertLast(newList);
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

  assertFirst(newList)

  const second = keyedList.getById(newList, '111');
  expect(second).toBeDefined();
  expect(second?.name).toEqual('Tom');
  expect(second?.age).toBe(21);
  assertLast(newList);
});

test('shows that an array can be converted and retrieved', () => {
  const someData = generateData();
  const c = keyedList.fromArray(someData);

  assertListElements(c);
});

test('shows that elements can be retrieved', () => {
  const someData = generateData();
  const c = keyedList.fromArray(someData);

  const last = keyedList.getById(c, '98');
  expect(last).toBeDefined();
  expect(last?.name).toBe('Jon');
  expect(last?.age).toBe(51);
  expect(last).not.toBe(someData[0]);
});

test('shows that an array can be converted in either direction', () => {
  const someData = generateData();
  const c = keyedList.fromArray(someData);
  const a = keyedList.toArray(c);

  expect(c).toBeDefined();
  expect(a).toBeDefined();
  expect(someData).toStrictEqual(a);
  expect(someData).not.toBe(a);
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
});