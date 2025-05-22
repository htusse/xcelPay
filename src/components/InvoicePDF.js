import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { format, isValid } from 'date-fns';

const InvoicePDF = ({ invoiceData }) => {
  const styles = {
    container: {
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '40px',
    },
    companyInfo: {
      marginBottom: '20px',
    },
    clientInfo: {
      marginBottom: '40px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '40px',
    },
    tableHeader: {
      backgroundColor: '#f5f5f5',
      borderBottom: '2px solid #ddd',
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
    },
    totals: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginTop: '20px',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '300px',
      marginBottom: '10px',
    },
    footer: {
      marginTop: '60px',
      borderTop: '1px solid #ddd',
      paddingTop: '20px',
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMMM dd, yyyy') : 'Invalid Date';
  };

  if (!invoiceData) {
    return null;
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" gutterBottom>
            INVOICE
          </Typography>
          <Typography variant="h6" color="text.secondary">
            #{invoiceData.invoiceNumber}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1">
            Date: {formatDate(invoiceData.date)}
          </Typography>
          <Typography variant="body1">
            Due Date: {formatDate(invoiceData.dueDate)}
          </Typography>
        </Box>
      </Box>

      <Box sx={styles.companyInfo}>
        <Typography variant="h6" gutterBottom>
          From:
        </Typography>
        <Typography variant="body1">{invoiceData.companyInfo?.companyName}</Typography>
        <Typography variant="body1">{invoiceData.companyInfo?.address}</Typography>
        <Typography variant="body1">
          Tax ID: {invoiceData.companyInfo?.taxId}
        </Typography>
        <Typography variant="body1">
          Phone: {invoiceData.companyInfo?.phone}
        </Typography>
        <Typography variant="body1">
          Email: {invoiceData.companyInfo?.email}
        </Typography>
      </Box>

      <Box sx={styles.clientInfo}>
        <Typography variant="h6" gutterBottom>
          Bill To:
        </Typography>
        <Typography variant="body1">{invoiceData.clientName}</Typography>
        <Typography variant="body1">{invoiceData.clientAddress}</Typography>
        <Typography variant="body1">
          Tax ID: {invoiceData.clientTaxId}
        </Typography>
        <Typography variant="body1">
          Email: {invoiceData.clientEmail}
        </Typography>
        <Typography variant="body1">
          Phone: {invoiceData.clientPhone}
        </Typography>
      </Box>

      <Table sx={styles.table}>
        <TableHead>
          <TableRow sx={styles.tableHeader}>
            <TableCell sx={styles.tableCell}>Description</TableCell>
            <TableCell sx={styles.tableCell} align="right">Quantity</TableCell>
            <TableCell sx={styles.tableCell} align="right">Price</TableCell>
            <TableCell sx={styles.tableCell} align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoiceData.items?.map((item, index) => (
            <TableRow key={index}>
              <TableCell sx={styles.tableCell}>{item.description}</TableCell>
              <TableCell sx={styles.tableCell} align="right">
                {item.quantity}
              </TableCell>
              <TableCell sx={styles.tableCell} align="right">
                ${item.price.toFixed(2)}
              </TableCell>
              <TableCell sx={styles.tableCell} align="right">
                ${(item.quantity * item.price).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={styles.totals}>
        <Box sx={styles.totalRow}>
          <Typography variant="body1">Subtotal:</Typography>
          <Typography variant="body1">
            ${invoiceData.subtotal?.toFixed(2) || '0.00'}
          </Typography>
        </Box>
        <Box sx={styles.totalRow}>
          <Typography variant="body1">
            Tax ({(invoiceData.taxRate * 100).toFixed(0)}%):
          </Typography>
          <Typography variant="body1">
            ${invoiceData.tax?.toFixed(2) || '0.00'}
          </Typography>
        </Box>
        <Box sx={styles.totalRow}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">${invoiceData.total?.toFixed(2) || '0.00'}</Typography>
        </Box>
      </Box>

      {invoiceData.notes && (
        <Box sx={{ marginTop: '40px' }}>
          <Typography variant="h6" gutterBottom>
            Notes:
          </Typography>
          <Typography variant="body1">{invoiceData.notes}</Typography>
        </Box>
      )}

      {invoiceData.terms && (
        <Box sx={styles.footer}>
          <Typography variant="h6" gutterBottom>
            Terms & Conditions:
          </Typography>
          <Typography variant="body1">{invoiceData.terms}</Typography>
        </Box>
      )}

      <Box sx={styles.footer}>
        <Typography variant="body2" color="text.secondary">
          Payment Terms: {invoiceData.paymentTerms}
        </Typography>
        {invoiceData.companyInfo?.bankAccount && (
          <Typography variant="body2" color="text.secondary">
            Bank Account: {invoiceData.companyInfo.bankAccount}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default InvoicePDF; 