import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  MenuItem,
  Dialog,
  DialogContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PreviewIcon from '@mui/icons-material/Preview';
import { format } from 'date-fns';
import { usePDF } from 'react-to-pdf';
import CompanyInfo from './CompanyInfo';
import InvoicePDF from './InvoicePDF';
import {
  generateInvoiceNumber,
  calculateDueDate,
  validateInvoice,
  formatCurrency,
} from '../utils/invoiceUtils';

const TAX_RATES = [
  { value: 0, label: '0%' },
  { value: 0.05, label: '5%' },
  { value: 0.1, label: '10%' },
  { value: 0.15, label: '15%' },
  { value: 0.2, label: '20%' },
];

const PAYMENT_TERMS = [
  { value: 'immediate', label: 'Due Immediately' },
  { value: 'net15', label: 'Net 15' },
  { value: 'net30', label: 'Net 30' },
  { value: 'net45', label: 'Net 45' },
  { value: 'net60', label: 'Net 60' },
];

const InvoiceForm = ({ initialData, onSave, onCancel, existingInvoices = [] }) => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientTaxId: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    taxRate: 0.1,
    paymentTerms: 'net30',
    notes: '',
    terms: '',
    companyInfo: {
      companyName: '',
      taxId: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      bankAccount: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [showPreview, setShowPreview] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: 'invoice.pdf' });

  useEffect(() => {
    if (initialData) {
      setInvoiceData(initialData);
    } else {
      // Generate new invoice number for new invoices
      const newInvoiceNumber = generateInvoiceNumber(existingInvoices);
      setInvoiceData(prev => ({
        ...prev,
        invoiceNumber: newInvoiceNumber,
      }));
    }
  }, [initialData, existingInvoices]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCompanyInfoChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [name]: value,
      },
    }));
    // Clear error when field is edited
    if (errors[`company${name}`]) {
      setErrors(prev => ({ ...prev, [`company${name}`]: undefined }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    setInvoiceData((prev) => ({
      ...prev,
      items: newItems,
    }));
    // Clear error when field is edited
    if (errors[`item${index}${field}`]) {
      setErrors(prev => ({ ...prev, [`item${index}${field}`]: undefined }));
    }
  };

  const handlePaymentTermsChange = (e) => {
    const { value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      paymentTerms: value,
      dueDate: calculateDueDate(prev.date, value),
    }));
  };

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * invoiceData.taxRate;
    return subtotal + tax;
  };

  const handleSave = () => {
    const validation = validateInvoice(invoiceData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setNotification({
        open: true,
        message: 'Please fix the errors in the form',
        severity: 'error',
      });
      return;
    }

    const invoiceToSave = {
      ...invoiceData,
      total: calculateTotal(),
      subtotal: calculateSubtotal(),
      tax: calculateSubtotal() * invoiceData.taxRate,
    };

    onSave(invoiceToSave);
    setNotification({
      open: true,
      message: 'Invoice saved successfully!',
      severity: 'success',
    });
  };

  const handleExportPDF = () => {
    toPDF();
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Invoice Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={togglePreview}
                  sx={{ mr: 2 }}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save Invoice
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Company Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <CompanyInfo
              companyInfo={invoiceData.companyInfo}
              onChange={handleCompanyInfoChange}
              errors={errors}
            />
          </Paper>
        </Grid>

        {/* Client Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Client Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Client Name"
                  name="clientName"
                  value={invoiceData.clientName}
                  onChange={handleInputChange}
                  error={!!errors.clientName}
                  helperText={errors.clientName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Client Email"
                  name="clientEmail"
                  type="email"
                  value={invoiceData.clientEmail}
                  onChange={handleInputChange}
                  error={!!errors.clientEmail}
                  helperText={errors.clientEmail}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Client Phone"
                  name="clientPhone"
                  value={invoiceData.clientPhone}
                  onChange={handleInputChange}
                  error={!!errors.clientPhone}
                  helperText={errors.clientPhone}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Client Address"
                  name="clientAddress"
                  multiline
                  rows={2}
                  value={invoiceData.clientAddress}
                  onChange={handleInputChange}
                  error={!!errors.clientAddress}
                  helperText={errors.clientAddress}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Client Tax ID"
                  name="clientTaxId"
                  value={invoiceData.clientTaxId}
                  onChange={handleInputChange}
                  error={!!errors.clientTaxId}
                  helperText={errors.clientTaxId}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Invoice Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Invoice Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Invoice Number"
                  name="invoiceNumber"
                  value={invoiceData.invoiceNumber}
                  onChange={handleInputChange}
                  error={!!errors.invoiceNumber}
                  helperText={errors.invoiceNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={invoiceData.date}
                  onChange={handleInputChange}
                  error={!!errors.date}
                  helperText={errors.date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Payment Terms"
                  name="paymentTerms"
                  value={invoiceData.paymentTerms}
                  onChange={handlePaymentTermsChange}
                  error={!!errors.paymentTerms}
                  helperText={errors.paymentTerms}
                >
                  {PAYMENT_TERMS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={handleInputChange}
                  error={!!errors.dueDate}
                  helperText={errors.dueDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Items Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Items
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addItem}
                size="small"
              >
                Add Item
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          error={!!errors[`item${index}description`]}
                          helperText={errors[`item${index}description`]}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                          error={!!errors[`item${index}quantity`]}
                          helperText={errors[`item${index}quantity`]}
                          inputProps={{ min: 1 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                          error={!!errors[`item${index}price`]}
                          helperText={errors[`item${index}price`]}
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.quantity * item.price)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => removeItem(index)}
                          disabled={invoiceData.items.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Totals and Notes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notes & Terms
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  multiline
                  rows={3}
                  value={invoiceData.notes}
                  onChange={handleInputChange}
                  error={!!errors.notes}
                  helperText={errors.notes}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Terms & Conditions"
                  name="terms"
                  multiline
                  rows={3}
                  value={invoiceData.terms}
                  onChange={handleInputChange}
                  error={!!errors.terms}
                  helperText={errors.terms}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Totals */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Totals
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>{formatCurrency(calculateSubtotal())}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax Rate:</Typography>
                  <TextField
                    select
                    value={invoiceData.taxRate}
                    onChange={(e) => handleInputChange({ target: { name: 'taxRate', value: e.target.value } })}
                    sx={{ width: '120px' }}
                  >
                    {TAX_RATES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax Amount:</Typography>
                  <Typography>{formatCurrency(calculateSubtotal() * invoiceData.taxRate)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">{formatCurrency(calculateTotal())}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={togglePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <div ref={targetRef}>
            <InvoicePDF invoiceData={invoiceData} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoiceForm; 