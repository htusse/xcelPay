import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/invoiceUtils';

const InvoiceList = ({ invoices, onEdit, onDelete }) => {
  const getStatusColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'error';
    if (diffDays <= 7) return 'warning';
    return 'success';
  };

  const getStatusLabel = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    return `Due in ${diffDays} days`;
  };

  if (invoices.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Invoices Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create your first invoice by clicking the "New Invoice" button above.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Invoice #</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.invoiceNumber}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {invoice.invoiceNumber}
                </Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {invoice.clientName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {invoice.clientEmail}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                {format(new Date(invoice.date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(invoice.total)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(invoice.dueDate)}
                  color={getStatusColor(invoice.dueDate)}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Tooltip title="Edit Invoice">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(invoice)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Invoice">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(invoice.invoiceNumber)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvoiceList; 