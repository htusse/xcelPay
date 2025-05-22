import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Grid,
  Typography,
} from '@mui/material';

const CompanyInfo = ({ companyInfo, onChange, errors = {} }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Company Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Company Name"
            name="companyName"
            value={companyInfo?.companyName || ''}
            onChange={onChange}
            error={!!errors.companyName}
            helperText={errors.companyName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Tax ID / VAT Number"
            name="taxId"
            value={companyInfo?.taxId || ''}
            onChange={onChange}
            error={!!errors.taxId}
            helperText={errors.taxId}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Address"
            name="address"
            multiline
            rows={2}
            value={companyInfo?.address || ''}
            onChange={onChange}
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Phone"
            name="phone"
            value={companyInfo?.phone || ''}
            onChange={onChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Email"
            name="email"
            type="email"
            value={companyInfo?.email || ''}
            onChange={onChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={companyInfo?.website || ''}
            onChange={onChange}
            error={!!errors.website}
            helperText={errors.website}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Bank Account"
            name="bankAccount"
            value={companyInfo?.bankAccount || ''}
            onChange={onChange}
            error={!!errors.bankAccount}
            helperText={errors.bankAccount}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CompanyInfo; 