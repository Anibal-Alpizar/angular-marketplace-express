# Marketplace Project - Buy and Sell Management

This web application project, developed using Angular and Node.js, aims to manage a marketplace. The application enables users to register, authenticate, buy and sell products, and rate other users.

## Requirements

- Node.js v18.16.0 or higher
- Angular v16 or higher
- MySQL database
- Asynchronous flow management

## Installation and Execution

### Backend (Node.js - Server Folder)

1. Install server dependencies:

   ```bash
   cd server
   npm install
   ```

2. Run the server:

   ``
   npm run devㅤ
   ``

### Frontend (Angular - Client Folder)

1. Install client dependencies:

   ```bash
   cd client
   npm install
   ```

2. Run the application:

   ``
   ng serve
   ``

4. Open your browser and visit [http://localhost:4200](http://localhost:4200) to view the application.

## Key Features

- **User Management**: Users can register and authenticate with various roles (administrator, vendor, customer), providing essential details such as full name, identification, email, and more.

- **Product Management**: Vendors can create and update products, including detailed information, images, categories, and status. Customers can explore and filter the product list.

- **Purchase Management**: Customers can add products to their cart, view purchase summaries, and make payments using registered payment methods.

- **Order Management**: Orders progress through states like pending, in progress, delivered, and completed. Vendors can update product statuses, and customers can view purchase histories.

- **Rating Management**: Users can rate each other after purchases, with ratings averaged to display an overall score.

- **Dashboard**: Administrators and vendors access dashboards with pertinent statistics on purchases, products, and ratings.

## Technologies Used

- Backend: Node.js, Express.js
- Frontend: Angular
- Database: MySQL

## Authors

This project was collaboratively developed by [Anibal Alpizar](https://github.com/Anibal-Alpizar) and [Carlos Bonilla](https://github.com/cabonillamo).

## Contributing

Contributions to this project are welcomed. Feel free to open issues for bug reports, feature requests, or general feedback. If you wish to contribute code, please fork the repository, create a new branch, make your changes, and submit a pull request.
