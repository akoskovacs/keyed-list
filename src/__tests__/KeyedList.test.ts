import { keyedList } from '../index';

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

test('shows that the array conversion is immutable', () => {
  const someData = generateData();
  const c = keyedList.fromArray<SomeData>(someData);

  expect((c.elements as any)['111'].name).toBe('Alfred');
  someData[1].name = 'Paul';
  expect((c.elements as any)['111'].name).toBe('Alfred');
});

test('shows that the retrieval of elements is immutable', () => {
  const someData = generateData();
  const c = keyedList.fromArray<SomeData>(someData);

  someData[1].age = 23;

  const second = keyedList.getById<SomeData>(c, '111');
  expect(second?.age).toBe(12);
  someData[1].age = 23;
  expect(second?.age).toBe(12);
});

test('shows that the conversion in both ways work', () => {
  const someData = generateData();
  const a = keyedList.fromArray<SomeData>(someData);
  const b = keyedList.toArray<SomeData>(a);
  expect(b).toBeDefined();
  expect(b).toStrictEqual(someData);
});

test('shows that an array can be converted and retrieved', () => {
  const someData = generateData();
  const c = keyedList.fromArray<SomeData>(someData);

  const last = keyedList.getById<SomeData>(c, '98');
  expect(last).toBeDefined();
  expect(last?.name).toBe('Jon');
  expect(last?.age).toBe(51);

  const first = keyedList.getById<SomeData>(c, '123');
  expect(first).toBeDefined();
  expect(first?.name).toBe('John');
  expect(first?.age).toBe(31);

  const second = keyedList.getById<SomeData>(c, '111');
  expect(second).toBeDefined();
  expect(second?.name).toBe('Alfred');
  expect(second?.age).toBe(12);
});

test('shows that an array can be mapped in order', () => {
  const someData = generateData();
  const c = keyedList.fromArray<SomeData>(someData);

  var gotData: SomeData[] = [];
  var gotIndicies: number[] = [];
  var gotLists: keyedList.IKeyedList<SomeData>[] = [];
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