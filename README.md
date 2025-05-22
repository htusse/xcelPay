# XcelPay Invoice

A modern, professional invoice management system built with React and Material-UI. Create, manage, and export professional invoices with ease.

![XcelPay Invoice](https://via.placeholder.com/800x400?text=XcelPay+Invoice)

## Features

- 🎨 Modern and professional UI design
- 📝 Create and edit invoices with a user-friendly interface
- 📊 Manage multiple invoices
- 💰 Calculate totals and taxes automatically
- 📱 Responsive design for all devices
- 📄 Export invoices to PDF
- 💾 Local storage for data persistence
- 🔍 Preview invoices before saving
- 🏢 Company and client information management
- 📅 Due date tracking and status indicators

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/xcel-pay.git
cd xcel-pay
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Usage

### Creating a New Invoice

1. Click the "New Invoice" button in the top right corner
2. Fill in the company information
3. Add client details
4. Add invoice items with descriptions, quantities, and prices
5. Set payment terms and tax rate
6. Add any additional notes or terms
7. Preview the invoice
8. Save the invoice

### Managing Invoices

- View all invoices in a list format
- Edit existing invoices
- Delete invoices
- Track payment status
- Export invoices to PDF

## Project Structure

```
src/
├── components/
│   ├── CompanyInfo.js
│   ├── InvoiceForm.js
│   ├── InvoiceList.js
│   └── InvoicePDF.js
├── utils/
│   └── invoiceUtils.js
├── App.js
└── index.js
```

## Technologies Used

- React
- Material-UI
- date-fns
- react-to-pdf

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the component library
- React team for the amazing framework
- All contributors who have helped shape this project

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/xcel-pay/issues) in the GitHub repository.

## Roadmap

- [ ] Add user authentication
- [ ] Implement cloud storage
- [ ] Add email functionality
- [ ] Create invoice templates
- [ ] Add payment integration
- [ ] Implement invoice analytics
- [ ] Add multi-language support
- [ ] Create mobile app version

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/xcel-pay](https://github.com/yourusername/xcel-pay)
