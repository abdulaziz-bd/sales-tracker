# Mobile Shop Sales Tracker

## About

Mobile Shop Sales Tracker is a desktop application built with Electron and React. It's designed to manage sales, inventory, and financial operations for a telecom accessories shop. The application provides features such as sales tracking, expense management, product management, and reporting.

## Features

- User authentication with role-based access (Admin and Employee)
- Product management (Add, view, and manage products)
- Sales processing with cash drawer integration
- Expense tracking
- Service recording (Hardware and Software services)
- Financial reporting
- Multilingual support (English and Bengali)

## Tech Stack

- Electron
- React
- Material-UI
- SQLite (via better-sqlite3)
- i18next for internationalization

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Setup and Installation

1. Clone the repository:

   ```
   git clone https://github.com/abdulaziz-bd/sales-tracker.git
   cd sales-tracker
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. To build the application for production:

   ```
   npm run make
   ```

## Usage

After starting the application, you'll be presented with a login screen. Use the following credentials for initial access:

- Admin:
  - Username: admin
  - Password: admin123

(Make sure to change these credentials after first login)

## Testing Cash Drawer Functionality

For testing purposes, a cash drawer simulator is included in the dashboard. This allows you to simulate opening and closing the cash drawer without actual hardware.

## Customization

- To add or modify product categories, use the category management feature in the admin dashboard.
- To change the shop details or modify the report format, update the relevant components in the `src/components` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub issue tracker or contact.
Md Abdul Aziz
[@Aziz, Md Abdul](abdulazizbd17@gmail.com)

## Version History

- 0.1
  - Initial Release
