import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ClientList from "./components/ClientList";
import EmployeeList from "./components/EmployeeList";
import VisitList from "./components/VisitList";
import ServiceList from "./components/ServiceList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";
import {
  People,
  Work,
  Event,
  Build
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 'bold',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

function NavigationTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const routes = [
    { path: '/clients', label: 'Clientes', icon: <People /> },
    { path: '/employees', label: 'Empleados', icon: <Work /> },
    { path: '/visits', label: 'Visitas', icon: <Event /> },
    { path: '/services', label: 'Servicios', icon: <Build /> },
  ];

  const currentTab = routes.findIndex(route => route.path === location.pathname);

  const handleTabChange = (event, newValue) => {
    navigate(routes[newValue].path);
  };

  return (
    <Paper elevation={2} sx={{ mt: 2, borderRadius: 2 }}>
      <Tabs
        value={currentTab >= 0 ? currentTab : 0}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          '& .MuiTab-root': {
            minHeight: 64,
            fontSize: '1rem',
            fontWeight: 500,
            textTransform: 'none',
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        {routes.map((route, index) => (
          <Tab
            key={route.path}
            label={route.label}
            icon={route.icon}
            iconPosition="start"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
            }}
          />
        ))}
      </Tabs>
    </Paper>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

          <AppBar
            position="sticky"
            elevation={4}
            sx={{
              bgcolor: 'primary.main',
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14)',
            }}
          >
            <Toolbar>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  flexGrow: 1,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                VisitasPro
              </Typography>
            </Toolbar>
          </AppBar>


          <Container maxWidth="xl" sx={{ px: 3 }}>
            <NavigationTabs />
          </Container>


          <Container maxWidth="xl" sx={{ py: 2, px: 0 }}>
            <Routes>
              <Route path="/clients" element={<ClientList />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/visits" element={<VisitList />} />
              <Route path="/services" element={<ServiceList />} />
              <Route path="/" element={<ClientList />} />
            </Routes>
          </Container>


          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            toastStyle={{
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;