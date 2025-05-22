import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AddIcon from '@mui/icons-material/Add';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',
      light: '#34495E',
      dark: '#1A252F',
    },
    secondary: {
      main: '#3498DB',
      light: '#5DADE2',
      dark: '#2980B9',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  const [invoices, setInvoices] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  const handleSaveInvoice = (invoice) => {
    let updatedInvoices;
    if (editingInvoice) {
      updatedInvoices = invoices.map((inv) =>
        inv.invoiceNumber === invoice.invoiceNumber ? invoice : inv
      );
    } else {
      updatedInvoices = [...invoices, invoice];
    }
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setShowForm(false);
    setEditingInvoice(null);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleDeleteInvoice = (invoiceNumber) => {
    const updatedInvoices = invoices.filter(
      (inv) => inv.invoiceNumber !== invoiceNumber
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingInvoice(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <ReceiptIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              XcelPay Invoice
            </Typography>
            {!showForm && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={handleNewInvoice}
              >
                New Invoice
              </Button>
            )}
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {showForm ? (editingInvoice ? 'Edit Invoice' : 'Create New Invoice') : 'Invoices'}
            </Typography>
            {!showForm && (
              <Typography variant="body1" color="text.secondary">
                Manage your invoices and create new ones with ease
              </Typography>
            )}
          </Box>

          {showForm ? (
            <InvoiceForm
              initialData={editingInvoice}
              onSave={handleSaveInvoice}
              onCancel={handleCancel}
              existingInvoices={invoices}
            />
          ) : (
            <InvoiceList
              invoices={invoices}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
            />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
