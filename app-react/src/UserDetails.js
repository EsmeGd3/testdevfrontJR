import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTodos, fetchPostsWithComments } from './store/usersSlice';
import {
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Alert,
} from '@mui/material';
// componentes de los detalles de cada usuario seleccionado
function UserDetails() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.selectedUser);
  const posts = useSelector((state) => state.users.posts);
  const todos = useSelector((state) => state.users.todos);

  const [showPosts, setShowPosts] = useState(false);
  const [showTodos, setShowTodos] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCompleted, setNewCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) return null;

  const handlePostsClick = () => {
    dispatch(fetchPostsWithComments(user.id));
    setShowPosts(true);
    setShowTodos(false);
  };

  const handleTodosClick = async () => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/todos`);
    let todosData = await res.json();
    todosData = todosData.sort((a, b) => b.id - a.id);
    dispatch(setTodos(todosData));
    setShowTodos(true);
    setShowPosts(false);
  };

  const handleAddTodo = async () => {
    if (!newTitle.trim()) {
      setMessage('El título no puede estar vacío');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: newTitle,
          completed: newCompleted,
        }),
      });
      const data = await res.json();
      setMessage(`Tarea creada con ID ${data.id}`);
      dispatch(setTodos([{ ...data }, ...todos]));
      setNewTitle('');
      setNewCompleted(false);
    } catch (error) {
      setMessage('Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        mx: 'auto',
        maxWidth: 700,
        p: 3,
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        bgcolor: '#fafafa',
        fontFamily: "'Roboto', sans-serif",
        color: '#333',
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight="600" align="center" sx={{ mb: 3 }}>
         {user.name}
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        <strong>Usuario:</strong> {user.username}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        <strong>Email:</strong> {user.email}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          onClick={handlePostsClick}
          sx={{
            borderRadius: 20,
            px: 4,
            py: 1.2,
            color: '#555',
            borderColor: '#ddd',
            '&:hover': {
              borderColor: '#bbb',
              backgroundColor: '#f0f0f0',
            },
            fontWeight: 600,
          }}
        >
          Posts
        </Button>
        <Button
          variant="outlined"
          onClick={handleTodosClick}
          sx={{
            borderRadius: 20,
            px: 4,
            py: 1.2,
            color: '#555',
            borderColor: '#ddd',
            '&:hover': {
              borderColor: '#bbb',
              backgroundColor: '#f0f0f0',
            },
            fontWeight: 600,
          }}
        >
          Todos
        </Button>
      </Box>

      {showPosts && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="600" color="#444">
            Posts:
          </Typography>
          {posts.map((post) => (
            // estilo para la seccion de los posts y sus comentarios
            <Paper
              key={post.id}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.3s ease',
                '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.1)' },
              }}
              elevation={0}
            >
              <Typography variant="h6" fontWeight="700" sx={{ mb: 1.5, color: '#333' }}>
                📝 {post.title}
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
                {post.body}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f9f9f9',
                  border: '1px solid #eee',
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#666' }}>
                  💬 Comentarios:
                </Typography>
                {post.comments?.length ? (
                  <List dense sx={{ pl: 1 }}>
                    {post.comments.map((comment) => (
                      <ListItem
                        key={comment.id}
                        alignItems="flex-start"
                        sx={{
                          mb: 1.5,
                          px: 1,
                          py: 1,
                          borderLeft: '4px solid #1976d2',
                          bgcolor: '#fff',
                          borderRadius: 1,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography fontWeight={600} sx={{ fontSize: 14, color: '#333' }}>
                              {comment.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" sx={{ color: '#555', fontSize: 13 }}>
                              {comment.body}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                    Sin comentarios disponibles.
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {showTodos && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="600" color="#444">
            Tareas:
          </Typography>

          {/* Formulario para agregar nueva tarea */}
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: 'center',
              bgcolor: '#f5f5f5',
              p: 2,
              borderRadius: 2,
            }}
          >
            {/* campo para el titulo */}
            <TextField
              label="Título"
              variant="outlined"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              fullWidth
              size="small"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newCompleted}
                  onChange={(e) => setNewCompleted(e.target.checked)}
                  color="primary"
                />
              }
              label="Completada"
            />
            <Button
              variant="contained"
              onClick={handleAddTodo}
              disabled={loading}
              sx={{
                borderRadius: 20,
                px: 4,
                py: 1.2,
                fontWeight: 600,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#155a9c',
                },
              }}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>

          {message && (
            <Alert
              severity={message.includes('Error') ? 'error' : 'success'}
              sx={{ mb: 3 }}
            >
              {message}
            </Alert>
          )}

          {/* Título con indicador de orden basado de mayor a menor por id*/}
          <Typography
            variant="h6"
            gutterBottom
            fontWeight="600"
            color="#444"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            Tareas
            <Typography
              component="span"
              variant="caption"
              sx={{
                fontWeight: 500,
                color: '#888',
                fontStyle: 'italic',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 0.3,
              }}
            >
              (ordenadas ↓)
            </Typography>
          </Typography>

          <List
            sx={{
              bgcolor: '#fff',
              borderRadius: 2,
              boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
            }}
          >
            {todos.map((todo) => (
              <ListItem
                key={todo.id}
                sx={{
                  borderBottom: '1px solid #eee',
                  px: 3,
                  py: 1,
                  bgcolor: todo.completed ? '#e6f4ea' : '#fef7f5',
                  borderRadius: 1.5,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={
                    <>
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600,
                          color: '#999',
                          mr: 1,
                          userSelect: 'none',
                          fontSize: '0.85rem',
                        }}
                      >
                        #{todo.id}
                      </Typography>
                      {todo.title}
                    </>
                  }
                  secondary={todo.completed ? '✅ Completada' : '❌ Pendiente'}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default UserDetails;
