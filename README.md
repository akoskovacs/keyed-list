# keyed-list.ts

Efficiently store and retreive list elements based on their `id` key. This approach has the same benefits as having both an array and a hash for the same list.

With the array we can simply iterate through the elements or use them by their index. And with the hash, we can efficiently retrieve them, just by the `id`. Although, this implementation will only store the `id`s in the array to conserve space. But, this mechanism is completely transparent, the user don't have to think about it.

The immutability makes this library easy to use with React or other functional libraries and is also less error-prone. 

## Installation

The preferred way is to add it to the project locally as a dependency:
```sh
npm install --save @akoskovacs/keyed-list
```
Or via `yarn`:
```sh
yarn add @akoskovacs/keyed-list
```

## Usage

The list element must include a unqiue `id` property. The `id` can be a GUID given by an API. It then can be used to efficiently address the elements. Take this example:

```ts
import keyedList from '@akoskovacs/keyed-list';

interface PostItem {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
};

const posts: PostItem[] = [
  {
    id: '1234',
    author: 'John',
    votes: 4,
    content: 'Hello, world!',
    createdAt: new Date('2020-12-11 10:45:21')
  },
  {
    id: '2222',
    author: 'Steve',
    votes: 0,
    content: 'Second post',
    createdAt: new Date('2020-12-11 14:12:55')
  },
  {
    id: '4242',
    author: 'Peter',
    votes: 2,
    content: 'This is not the end',
    createdAt: new Date('2020-12-11 14:12:55')
  }
];
```

After the API gave back the elements the library can start manipulating the data, with the following functions:

| Function name     | Description                                          | Example                                                                                  |
|-------------------|------------------------------------------------------|------------------------------------------------------------------------------------------|
| ```fromArray```   | Create a list from an array                          | ```const list = keyedList.fromArray(posts);```                                           |
| ```toArray```     | Converts the list back into an array                 | ```const newPosts = keyedList.toArray(list);```                                          |
| ```getIds```      | Retrieve multiple elements by their ids              | ```const ids = keyedList.getIds(list);```                                                |
| ```getById```     | Retrieve the element by its id                       | ```const steve = keyedList.getById(list, '2222');```                                     |
| ```getByIds```    | Converts the list back into an array                 | ```const sp = keyedList.getByIds(list, ['4242, '2222']);```                              |
| ```getIdByIndex```| Retrieve the id by the element's numeric index       | ```const firstId = keyedList.getIdByIndex(list, 0);```                                   |
| ```getFirst```    | Gets the first element in the list                   | ```const first = keyedList.getFirst(list);```                                            |
| ```getLast```     | Gets the last elemenet in the list                   | ```const last = keyedList.getLast(list);```                                              |
| ```getByIndex```  | Gets the element by its index                        | ```const second = keyedList.getByIndex(list, 1);```                                      |
| ```getCount```    | Get the length of the list                           | ```const count = keyedList.getCount(list);```                                            |
| ```update```      | Update properties of given list element              | ```const newList = keyedList.update(list, { id: '4242', votes: 1 });```                  |
| ```append```      | Adds a new element to the end the list               | ```const newList = keyedList.append(list, { id: '5200', author: 'Riley' /* ... */});```  |
| ```insert```      | Insert a new element to the beginning of the list    | ```const newList = keyedList.insert(list, { id: '5200', author: 'Riley' /* ... */});```  |
| ```removeById```  | Removes an element by its id                         | ```const newList = keyedList.removeById(list, '2222');```                                |
| ```map```         | Iterates through the list elements                   | ```const nameArray = keyedList.map(list, p => p.author);```                              |
| ```mapIds```      | Iterates through the `id`s of the list               | ```const ids = keyedList.mapIds(list, id => id);```                                      |
| ```filter```      | Filters out elements which stasify a given condition | ```const nonZeroVotes = keyedList.filter(list, p => p.votes > 0);```                     |
| ```sort```        | Sorts the array, by a given comparison function      | ```const sortedList = keyedList.sort(list, (left, right) => left.votes - right.votes);```|

## A more complete example with React

`Posts.tsx`:
```tsx
/* ... API handlers ...*/

type PostItemList = keyedList.IdKeyedList<PostItem>;

const Posts = () => {
  const [posts, setPosts] = React.useState<PostItemList>(keyedList.fromArray());
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!isInitialized) {
      if (!initialPosts) {
        fetchAllPosts();
      }
      setIsInitialized(true);
    } else {
      fetchAllPosts();
    }
  }, []);

  const fetchAllPosts = () => {
    // fetchPosts does a GET request to load all posts into an array, then those are converted into a list
    fetchPosts(cs => setPosts(keyedList.fromArray(cs)));
  };

  const submitPost = () => {
    // savePost does the POST request for creating a new post, the new item then can be inserted to the list
    savePost(content, (c) => {
      setPosts(keyedList.insert(posts, c));
      setContent("");
    });
    return true;
  };

  const setPostContent = (id: string, content: string) => {
    // When the content is edited, the new content is updated through this call
    setPosts(keyedList.update(posts, { id, content }));
    return true;
  };

  const voteOnPost = (id: string) => {
    // When the post is voted on, the request will give back the number of all votes, so we can show it to the users
    votePost(id, (votes) => {
      setPosts(keyedList.update(posts, { id, vote: votes }));
    });
  };

  const doDelete = (id: string) => {
    if (confirm('Are you sure to delete this post?')) {
      setPosts(keyedList.removeById(posts, id));
    }
  };

  return (
    <>
      {
        keyedList.mapIds(id =>
          <Post
            id={ id }
            key={ id }
            editContent={ setPostContent }
            getById={ id => keyedList.getById(posts, id) }
            onVote={ id => voteOnPost }
            onDelete={ doDelete } />
        )
      }
    </>
  );
};

export default Posts;
```

`Post.tsx`:
```tsx
interface PostProps {
  id: Uuid;
  onEditContent?: (id: string, content: string) => void;
  onVote?: (id: string) => void;
  onDelete?: (id: string) => void;
  getById?: (id: string) => PostItem;
}


export const Post = ({ id, getById, setContent, onDelete }: PostProps) => {
  const post = (id && getById) ? getById(id) : undefined;

  if (!post)
    return undefined;

  return (
    <div className="post">
      <p><em>Posted by { post.author }</em></p>
      {
        onVote &&
          <button className="vote" onClick={ () => onVote(id) } />
      }
      <p className="post-content">
        { post.content }
      </p>
      {
        onEditContent &&
        /* create and editor for the content and call onEditContent when done */
      }
      {
        onDelete &&
          <button className="delete" onClick={ () => onDelete(id) } />
      }
    </div>
  );
};

```
