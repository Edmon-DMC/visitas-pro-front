import React, { useEffect, useState } from "react";
import { fetchData, postData } from "../api";
import { 
  Table, TableHead, TableRow, TableCell, TableBody, 
  TextField, Button, Paper, Box, Typography, Grid,
  Card, CardContent, Divider, Chip
} from "@mui/material";
import { toast } from "react-toastify";
import { PersonAdd, BadgeOutlined, Email, Phone, Work } from "@mui/icons-material";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "", cargo: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData("/empleados").then(setEmployees);
  }, []);

  const handleSubmit = async () => {
    if (!form.nombre || !form.correo) {
      toast.error("Name and Email are required");
      return;
    }
    setLoading(true);
    try {
      const newEmp = await postData("/empleados", form);
      setEmployees([...employees, newEmp]);
      setForm({ nombre: "", correo: "", telefono: "", cargo: "" });
      toast.success("Empleado agregado exitosamente");
    } catch (error) {
      toast.error("Error al agregar empleado");
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (cargo) => {
    const colors = {
      'Manager': 'primary',
      'Developer': 'secondary',
      'Designer': 'info',
      'Analyst': 'success',
      'default': 'default'
    };
    return colors[cargo] || colors.default;
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
          <BadgeOutlined fontSize="large" />
          Gestión de empleados
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Administra los miembros de tu equipo
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BadgeOutlined />
                Directorio de empleados ({employees.length})
              </Typography>
              
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'secondary.main', color: 'white' }}>
                        Nombre
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'secondary.main', color: 'white' }}>
                        Correo electrónico
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'secondary.main', color: 'white' }}>
                        Teléfono
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'secondary.main', color: 'white' }}>
                        Posición
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((e, index) => (
                      <TableRow 
                        key={e.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                          '&:hover': { bgcolor: 'secondary.light', opacity: 0.1 }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 'medium' }}>{e.nombre}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Email fontSize="small" color="action" />
                            {e.correo}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone fontSize="small" color="action" />
                            {e.telefono || '-'}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {e.cargo ? (
                            <Chip 
                              label={e.cargo} 
                              color={getRoleColor(e.cargo)}
                              variant="outlined"
                              size="small"
                              icon={<Work />}
                            />
                          ) : '-'}
                        </TableCell>
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
                Agregar nuevo empleado
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField 
                  label="Nombre completo" 
                  variant="outlined"
                  fullWidth
                  required
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField 
                  label="Dirección de correo electrónico" 
                  variant="outlined"
                  fullWidth
                  required
                  type="email"
                  value={form.correo}
                  onChange={e => setForm({ ...form, correo: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField 
                  label="Número de teléfono" 
                  variant="outlined"
                  fullWidth
                  value={form.telefono}
                  onChange={e => setForm({ ...form, telefono: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField 
                  label="Puesto de trabajo" 
                  variant="outlined"
                  fullWidth
                  value={form.cargo}
                  onChange={e => setForm({ ...form, cargo: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                
                <Button 
                  variant="contained" 
                  color="secondary"
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
                  {loading ? 'Añadiendo...' : 'Agregar empleado'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}