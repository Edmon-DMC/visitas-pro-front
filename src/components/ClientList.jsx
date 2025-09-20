import React, { useEffect, useState } from "react";
import { fetchData, postData } from "../api";
import { 
  Table, TableHead, TableRow, TableCell, TableBody, 
  TextField, Button, Paper, Box, Typography, Grid,
  Card, CardContent, Divider
} from "@mui/material";
import { toast } from "react-toastify";
import { PersonAdd, People } from "@mui/icons-material";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ nombre: "", apellido: "", cedula: "", telefono: "", direccion: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData("/clientes").then(setClients);
  }, []);

  const handleSubmit = async () => {
    if (!form.nombre || !form.apellido) {
      toast.error("Name and Lastname are required");
      return;
    }
    setLoading(true);
    try {
      const newClient = await postData("/clientes", form);
      setClients([...clients, newClient]);
      setForm({ nombre: "", apellido: "", cedula: "", telefono: "", direccion: "" });
      toast.success("Cliente agregado exitosamente");
    } catch (error) {
      toast.error("Error al agregar cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          color: 'primary.main',
          fontWeight: 'bold'
        }}>
          <People fontSize="large" />
          Gestión de Clientes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gestiona tu base de datos de clientes
        </Typography>
      </Box>

      <Grid container spacing={3}>

        <Grid item xs={12} lg={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <People />
                Lista de clientes ({clients.length})
              </Typography>
              
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                        Nombre
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                        Apellido
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                        Documento de identidad
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                        Teléfono
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                        DIRECCIÓN
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clients.map((c, index) => (
                      <TableRow 
                        key={c.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                          '&:hover': { bgcolor: 'primary.light', opacity: 0.1 }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 'medium' }}>{c.nombre}</TableCell>
                        <TableCell>{c.apellido}</TableCell>
                        <TableCell>{c.cedula || '-'}</TableCell>
                        <TableCell>{c.telefono || '-'}</TableCell>
                        <TableCell>{c.direccion || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} lg={4}>
          <Card elevation={3} sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'secondary.main'
              }}>
                <PersonAdd />
                Agregar nuevo cliente
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField 
                  label="Nombre" 
                  variant="outlined"
                  fullWidth
                  required
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField 
                  label="Apellido" 
                  variant="outlined"
                  fullWidth
                  required
                  value={form.apellido}
                  onChange={e => setForm({ ...form, apellido: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField 
                  label="Documento de identidad" 
                  variant="outlined"
                  fullWidth
                  value={form.cedula}
                  onChange={e => setForm({ ...form, cedula: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField 
                  label="Teléfono" 
                  variant="outlined"
                  fullWidth
                  value={form.telefono}
                  onChange={e => setForm({ ...form, telefono: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField 
                  label="DIRECCIÓN" 
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  value={form.direccion}
                  onChange={e => setForm({ ...form, direccion: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={<PersonAdd />}
                  sx={{ 
                    mt: 2, 
                    py: 1.5, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: 3
                  }}
                >
                  {loading ? 'Añadiendo...' : 'Agregar cliente'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}