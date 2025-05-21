import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//conexxiones a las apis que nos indica el readme
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await res.json();
  return data.slice(0, 10);
});

export const fetchPostsWithComments = createAsyncThunk(
  'users/fetchPostsWithComments',
  async (userId) => {
    const postsRes = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
    const posts = await postsRes.json();

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
        const comments = await commentsRes.json();
        return { ...post, comments };
      })
    );

    return postsWithComments;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    selectedUser: null,
    posts: [],
    todos: [],
  },
  reducers: {
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    setPosts(state, action) {
      state.posts = action.payload;
    },
    setTodos(state, action) {
      state.todos = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(fetchPostsWithComments.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
  },
});

export const { setSelectedUser, setPosts, setTodos } = usersSlice.actions;
export default usersSlice.reducer;
