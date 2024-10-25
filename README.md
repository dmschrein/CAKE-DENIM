# CAKE-DENIM

[Getting Started Tutorial](https://www.youtube.com/watch?v=ddKQ8sZo_v8&t=657s)

[Project requirements](#project-requirements)

[Installation Instructions](#installation-instructions)

## Project requirements

- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Node.js](https://nodejs.org/en)

# Clone the repository

First, clone the repository to your local machine and navigate into the project directory.

```bash
git clone https://github.com/dmschrein/CAKE-DENIM.git

cd CAKE-DENIM
```

# Launch the Frontend

## Step 1: Install the dependencies for Client

Navigate to the client directory and install all the required dependencies using npm.

This will install all packages listed in package.json. If you encounter any errors, ensure you have the latest versions of Node.js and npm installed.

```bash
cd client
npm install
```

## Step 2: Launch the Frontend Development Server

This will start the Next.js development server, which allows you to see live updates as you make changes.

```bash
npm run dev
```

## Step 3: Access the Website

Once the development server is running, open your web browser and go to:

```
http://localhost:3000/home
```

This link will direct you to the local instance of the CAKE-DENIM website, which is now running on your machine. You should see the homepage load in your browser.

# Setup Backend

## Generate the prisma database

```
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

## Test Backend Routes

### Test for Registered Customer

```
curl -X POST http://localhost:8000/api/stripe/payments \
     -H "Content-Type: application/json" \
     -d '{
          "email": "test3@test.com",
          "paymentMethodId": "pm_card_visa",
          "amount": 5000,
          "currency": "usd",
          "orderId": "order123"
        }'
```

### Test for Guest Customer

```
curl -X POST http://localhost:8000/api/stripe/payments \
     -H "Content-Type: application/json" \
     -d '{
          "email": "test2@newemail.com",
          "paymentMethodId": "pm_card_visa",
          "amount": 5000,
          "currency": "usd",
          "orderId": "order123"
        }'
```
