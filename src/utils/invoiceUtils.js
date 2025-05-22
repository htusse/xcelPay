import { format } from 'date-fns';

// Generate a new invoice number based on the current year and sequence
export const generateInvoiceNumber = (existingInvoices) => {
  const currentYear = new Date().getFullYear();
  const yearPrefix = currentYear.toString().slice(-2);
  
  // Find the highest sequence number for the current year
  const currentYearInvoices = existingInvoices.filter(inv => 
    inv.invoiceNumber.startsWith(`INV-${yearPrefix}`)
  );
  
  let maxSequence = 0;
  currentYearInvoices.forEach(inv => {
    const sequence = parseInt(inv.invoiceNumber.split('-')[2]);
    if (sequence > maxSequence) {
      maxSequence = sequence;
    }
  });
  
  const nextSequence = maxSequence + 1;
  return `INV-${yearPrefix}-${nextSequence.toString().padStart(4, '0')}`;
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number format
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

// Validate tax ID format (basic validation)
export const validateTaxId = (taxId) => {
  const taxIdRegex = /^[A-Z0-9]{8,}$/;
  return taxIdRegex.test(taxId);
};

// Calculate due date based on payment terms
export const calculateDueDate = (date, paymentTerms) => {
  const invoiceDate = new Date(date);
  let daysToAdd = 0;
  
  switch (paymentTerms) {
    case 'immediate':
      daysToAdd = 0;
      break;
    case 'net15':
      daysToAdd = 15;
      break;
    case 'net30':
      daysToAdd = 30;
      break;
    case 'net45':
      daysToAdd = 45;
      break;
    case 'net60':
      daysToAdd = 60;
      break;
    default:
      daysToAdd = 30;
  }
  
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + daysToAdd);
  return format(dueDate, 'yyyy-MM-dd');
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Validate invoice data
export const validateInvoice = (invoice) => {
  const errors = {};

  if (!invoice.invoiceNumber) {
    errors.invoiceNumber = 'Invoice number is required';
  }

  if (!invoice.date) {
    errors.date = 'Date is required';
  }

  if (!invoice.dueDate) {
    errors.dueDate = 'Due date is required';
  }

  if (!invoice.clientName) {
    errors.clientName = 'Client name is required';
  }

  if (!invoice.clientEmail) {
    errors.clientEmail = 'Client email is required';
  } else if (!validateEmail(invoice.clientEmail)) {
    errors.clientEmail = 'Invalid email format';
  }

  if (invoice.clientPhone && !validatePhone(invoice.clientPhone)) {
    errors.clientPhone = 'Invalid phone number format';
  }

  if (invoice.clientTaxId && !validateTaxId(invoice.clientTaxId)) {
    errors.clientTaxId = 'Invalid tax ID format';
  }

  if (!invoice.companyInfo.companyName) {
    errors.companyName = 'Company name is required';
  }

  if (!invoice.companyInfo.taxId) {
    errors.companyTaxId = 'Company tax ID is required';
  } else if (!validateTaxId(invoice.companyInfo.taxId)) {
    errors.companyTaxId = 'Invalid tax ID format';
  }

  if (invoice.items.length === 0) {
    errors.items = 'At least one item is required';
  } else {
    invoice.items.forEach((item, index) => {
      if (!item.description) {
        errors[`item${index}Description`] = 'Item description is required';
      }
      if (item.quantity <= 0) {
        errors[`item${index}Quantity`] = 'Quantity must be greater than 0';
      }
      if (item.price < 0) {
        errors[`item${index}Price`] = 'Price cannot be negative';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}; 