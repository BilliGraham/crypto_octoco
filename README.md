# Cryptocurrency_Price

## Overview

This is a React application built with TypeScript that displays live cryptocurrency prices using the CoinGecko API. The app shows the top 10 cryptocurrencies by market cap and allows users to view detailed information about each cryptocurrency.

## Features

- Dashboard showing top 10 cryptocurrencies by market cap
- Detailed view for each cryptocurrency
- Prices displayed in ZAR (South African Rand)
- Responsive design

## Technologies Used

- React
- TypeScript
- React Router
- CoinGecko API
- Axios for API requests
- CSS Modules for styling

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/crypto_octoco.git
   ```

2. Navigate to the project directory:
   ```bash
   cd crypto_octoco
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## API Usage

The app uses the free CoinGecko API with the following endpoints:
- `/coins/markets` - for getting the top cryptocurrencies
- `/coins/{id}` - for getting detailed information about a specific cryptocurrency

## Notes

- The app is configured to display prices in ZAR (South African Rand)
- API responses are cached to minimize unnecessary requests
- Error boundaries are implemented to handle API failures gracefully
- AI was used to assist with comment generation, some of the unit testing and README
