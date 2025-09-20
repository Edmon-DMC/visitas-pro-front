import React, { useEffect, useState } from "react";
import { fetchData } from "../api";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TextField, Button, Select, MenuItem, Paper, Box, Typography, Grid,
  Card, CardContent, Divider, Chip, Alert
} from "@mui/material";
import { toast } from "react-toastify";
import ExportButtons from "./ExportButtons";
import { 
  RoomService, 
  Add, 
  AttachMoney, 
  Person, 
  TrendingUp,
  Visibility
} from "@mui/icons-material";

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [visits, setVisits] = useState([]);
  const [form, setForm] = useState({ visitaId: "", descripcion: "", precio: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData("/servicios").then(setServices);
    fetchData("/visitas").then(setVisits);
  }, []);

  const handleSubmit = async () => {
    if (!form.visitaId || !form.descripcion || !form.precio) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const url = `/servicios?visitaId=${form.visitaId}&descripcion=${form.descripcion}&precio=${form.precio}`;
      const res = await fetch("http://localhost:8081/api" + url, { method: "POST" });
      const newService = await res.json();
      setServices([...services, newService]);
      setForm({ visitaId: "", descripcion: "", precio: "" });
      toast.success("Servicio agregado exitosamente");
    } catch (error) {
      toast.error("Error al agregar el servicio");
    } finally {
      setLoading(false);
    }
  };

  const total = services.reduce((sum, s) => sum + (parseFloat(s.precio) || 0), 0);

  const totalsByClient = services.reduce((acc, s) => {
    const client = s.visita?.cliente
      ? `${s.visita.cliente.nombre} ${s.visita.cliente.apellido}`
      : "Cliente desconocido";
    acc[client] = (acc[client] || 0) + (parseFloat(s.precio) || 0);
    return acc;
  }, {});

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          color: 'primary.main',
          fontWeight: 'bold'
        }}>
          <RoomService fontSize="large" />
          Gestión de Servicios
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Seguimiento de servicios e ingresos
        </Typography>
      </Box>

 
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <RoomService fontSize="large" />
                <Box>
                  <Typography variant="h4">{services.length}</Typography>
                  <Typography variant="body2">Servicios totales</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AttachMoney fontSize="large" />
                <Box>
                  <Typography variant="h4">${total.toFixed(2)}</Typography>
                  <Typography variant="body2">Ingresos totales</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Person fontSize="large" />
                <Box>
                  <Typography variant="h4">{Object.keys(totalsByClient).length}</Typography>
                  <Typography variant="body2">Clientes activos</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <RoomService />
                Lista de servicios
              </Typography>

              <ExportButtons
                data={services}
                columns={["id", "descripcion", "precio"]}
                fileName="Services"
              />

              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'info.main', color: 'white' }}>
                        ID de visita
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'info.main', color: 'white' }}>
                        Descripción
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'info.main', color: 'white' }}>
                        Precio
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services.map((s, index) => (
                      <TableRow 
                        key={s.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                          '&:hover': { bgcolor: 'info.light', opacity: 0.1 }
                        }}
                      >
                        <TableCell>
                          <Chip 
                            label={`Visita ${s.visita?.id}`} 
                            variant="outlined" 
                            size="small"
                            icon={<Visibility />}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>{s.descripcion}</TableCell>
                        <TableCell>
                          <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                            ${parseFloat(s.precio || 0).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>

   
              <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'success.dark',
                  fontWeight: 'bold'
                }}>
                  <TrendingUp />
                  Ingresos totales: ${total.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>


          <Card elevation={3} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person />
               Ingresos por cliente
              </Typography>
              
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'secondary.main', color: 'white' }}>
                        Cliente
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'secondary.main', color: 'white' }}>
                        Ingresos totales
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(totalsByClient)
                      .sort(([,a], [,b]) => b - a)
                      .map(([client, sum]) => (
                        <TableRow 
                          key={client}
                          sx={{ 
                            '&:hover': { bgcolor: 'secondary.light', opacity: 0.1 }
                          }}
                        >
                          <TableCell sx={{ fontWeight: 'medium' }}>{client}</TableCell>
                          <TableCell>
                            <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                              ${sum.toFixed(2)}
                            </Typography>
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
                color: 'info.main'
              }}>
                <Add />
                Agregar nuevo servicio
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Select 
                  value={form.visitaId} 
                  onChange={e => setForm({ ...form, visitaId: e.target.value })} 
                  displayEmpty
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value=""><em>Seleccionar Visita</em></MenuItem>
                  {visits.map(v => (
                    <MenuItem key={v.id} value={v.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Visibility fontSize="small" />
                        Visita {v.id} - {v.cliente?.nombre || 'Unknown'}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                
                <TextField 
                  label="Descripción del servicio" 
                  variant="outlined"
                  fullWidth
                  required
                  multiline
                  rows={2}
                  value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                
                <TextField 
                  label="Precio" 
                  variant="outlined"
                  fullWidth
                  required
                  type="number"
                  inputProps={{ step: "0.01", min: "0" }}
                  value={form.precio}
                  onChange={e => setForm({ ...form, precio: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: <AttachMoney color="action" />
                  }}
                />
                
                <Button 
                  variant="contained" 
                  color="info"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={<Add />}
                  sx={{ 
                    mt: 2, 
                    py: 1.5, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: 3
                  }}
                >
                  {loading ? 'Añadiendo...' : 'Agregar servicio'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}