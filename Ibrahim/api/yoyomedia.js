const axios = require('axios');

const API_KEY = process.env.SM_API_KEY || '';
const API_URL = 'https://yoyomedia.in/api/v2';

async function connect(data) {
  try {
    const response = await axios.post(API_URL, 
      Object.entries(data)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&'),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error;
  }
}

async function getBalance() {
  return connect({
    key: API_KEY,
    action: 'balance'
  });
}

async function getServices() {
  return connect({
    key: API_KEY,
    action: 'services'
  });
}

async function addOrder(data) {
  return connect({
    key: API_KEY,
    action: 'add',
    ...data
  });
}

async function getOrderStatus(orderId) {
  return connect({
    key: API_KEY,
    action: 'status',
    order: Array.isArray(orderId) ? orderId.join(',') : orderId
  });
}

module.exports = {
  getBalance,
  getServices,
  addOrder,
  getOrderStatus
};