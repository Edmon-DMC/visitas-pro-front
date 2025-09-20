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
  EventNote, 
  Add, 
  Person, 
  Badge,
  CalendarToday,
  FilterList,
  Notes
} from "@mui/icons-material";

export default function VisitList() {
  const [visits, setVisits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ clienteId: "", empleadoId: "", observaciones: "" });
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData("/visitas").then(data => {
      setVisits(data);
      setFiltered(data);
    });
    fetchData("/clientes").then(setClients);
    fetchData("/empleados").then(setEmployees);
  }, []);

  const handleSubmit = async () => {
    if (!form.clienteId || !form.empleadoId) {
      toast.error("Se requiere Cliente y Empleado");
      return;
    }
    setLoading(true);
    try {
      const url = `/visitas?clienteId=${form.clienteId}&empleadoId=${form.empleadoId}&observaciones=${form.observaciones}`;
      const res = await fetch("http://localhost:8080/api" + url, { method: "POST" });
      const newVisit = await res.json();
      const updatedVisits = [...visits, newVisit];
      setVisits(updatedVisits);
      setFiltered(updatedVisits);
      setForm({ clienteId: "", empleadoId: "", observaciones: "" });
      toast.success("Visita agregada exitosamente");
    } catch (error) {
      toast.error("Error al agregar la visita");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!start || !end) {
      setFiltered(visits);
      return;
    }
    const s = new Date(start);
    const e = new Date(end);
    const filteredData = visits.filter(v => {
      const d = new Date(v.fecha);
      return d >= s && d <= e;
    });
    setFiltered(filteredData);
  };

  const clearFilter = () => {
    setStart("");
    setEnd("");
    setFiltered(visits);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
          <EventNote fontSize="large" />
         Gestión de visitas
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Seguimiento de visitas y citas de clientes
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EventNote fontSize="large" />
                <Box>
                  <Typography variant="h4">{visits.length}</Typography>
                  <Typography variant="body2">Visitas totales</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FilterList fontSize="large" />
                <Box>
                  <Typography variant="h4">{filtered.length}</Typography>
                  <Typography variant="body2">Resultados filtrados</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Person fontSize="large" />
                <Box>
                  <Typography variant="h4">{clients.length}</Typography>
                  <Typography variant="body2">Clientes activos</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Badge fontSize="large" />
                <Box>
                  <Typography variant="h4">{employees.length}</Typography>
                  <Typography variant="body2">Miembros del equipo</Typography>
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
                <EventNote />
                Visitar registros
              </Typography>

       
              <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterList />
                    Filtrar por rango de fechas
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField 
                      type="date" 
                      label="Fecha de inicio" 
                      InputLabelProps={{ shrink: true }}
                      value={start}
                      onChange={e => setStart(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField 
                      type="date" 
                      label="Fecha de finalización" 
                      InputLabelProps={{ shrink: true }}
                      value={end}
                      onChange={e => setEnd(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <Button 
                      variant="contained" 
                      onClick={handleFilter}
                      startIcon={<FilterList />}
                      sx={{ borderRadius: 2 }}
                    >
                      Aplicar filtro
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={clearFilter}
                      sx={{ borderRadius: 2 }}
                    >
                      Claro
                    </Button>
                  </Box>
                  {(start || end) && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Demostración {filtered.length} de {visits.length} visitas
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <ExportButtons
                data={filtered}
                columns={["id", "fecha", "observaciones"]}
                fileName="Visits"
              />

              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                        Fecha
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                        Cliente
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                        Empleado
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                        Observaciones
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((v, index) => (
                      <TableRow 
                        key={v.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                          '&:hover': { bgcolor: 'primary.light', opacity: 0.1 }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {formatDate(v.fecha)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${v.cliente?.nombre || ''} ${v.cliente?.apellido || ''}`}
                            variant="outlined" 
                            size="small"
                            icon={<Person />}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={v.empleado?.nombre || 'Unknown'}
                            variant="outlined" 
                            size="small"
                            icon={<Badge />}
                            color="secondary"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Notes fontSize="small" color="action" />
                            <Typography variant="body2">
                              {v.observaciones || 'No observations'}
                            </Typography>
                          </Box>
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
                color: 'primary.main'
              }}>
                <Add />
                Programar nueva visita
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Select 
                  value={form.clienteId} 
                  onChange={e => setForm({ ...form, clienteId: e.target.value })} 
                  displayEmpty
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value=""><em>Seleccionar Cliente</em></MenuItem>
                  {clients.map(c => (
                    <MenuItem key={c.id} value={c.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" />
                        {c.nombre} {c.apellido}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                
                <Select 
                  value={form.empleadoId} 
                  onChange={e => setForm({ ...form, empleadoId: e.target.value })} 
                  displayEmpty
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value=""><em>Seleccionar empleado</em></MenuItem>
                  {employees.map(e => (
                    <MenuItem key={e.id} value={e.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Badge fontSize="small" />
                        {e.nombre}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                
                <TextField 
                  label="Observaciones" 
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={form.observaciones}
                  onChange={e => setForm({ ...form, observaciones: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  placeholder="Añade cualquier nota u observación sobre la visita..."
                />
                
                <Button 
                  variant="contained" 
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
                  {loading ? 'Programando...' : 'Programar visita'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}