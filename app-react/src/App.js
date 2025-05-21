import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, setSelectedUser } from './store/usersSlice';
import UserDetails from './UserDetails';
// importamos lo necesario de material UI
import { List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';

function App() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.list);
  const selectedUser = useSelector((state) => state.users.selectedUser);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUserClick = (user) => {
    dispatch(setSelectedUser(user));
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <Typography variant="h6" align="center" gutterBottom sx={{ color: '#323', fontWeight: '100' }}>
        Prueba téctica Test dev Frontend Jr
      </Typography>
      <hr/>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#333', fontWeight: '600' }}>
        Lista de Usuarios
      </Typography>

      <Paper
        elevation={2}
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          borderRadius: 2,
          bgcolor: '#fafafa',
          border: '1px solid #ddd',
        }}
      >
        <List>
          {users.map((user) => (
            <ListItemButton
              key={user.id}
              onClick={() => handleUserClick(user)}
              selected={selectedUser?.id === user.id}
              sx={{
                borderRadius: 1,
                mb: 1,
                mx: 1,
                transition: 'background-color 0.3s ease',
                '&.Mui-selected': {
                  bgcolor: '#c8e6c9',
                  color: '#2e7d32',
                },
                '&:hover': {
                  bgcolor: '#e0f2f1',
                },
              }}
            >
              <ListItemText
                primary={user.name}
                secondary={user.email}
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      {/* mostramos los detalles del usuario seleccionado */}
      <UserDetails />
    </div>
    
  );
}

export default App;
