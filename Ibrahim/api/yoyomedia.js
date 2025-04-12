const axios = require('axios');

const API_KEY = process.env.SM_API_KEY || '';
const API_URL = 'https://yoyomedia.in/api/v2';

// Test function to verify API connection
async function testApiConnection() {
  try {
    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: 'balance'
    });
    console.log('API Test Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Test Error:', error?.response?.data || error.message);
    throw error;
  }
}

async function getBalance() {
  try {
    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: 'balance'
    });
    return response.data;
  } catch (error) {
    console.error('Balance check error:', error?.response?.data || error.message);
    throw error;
  }
}

async function getServices() {
  try {
    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: 'services'
    });
    return response.data;
  } catch (error) {
    console.error('Services error:', error?.response?.data || error.message);
    throw error;
  }
}

async function addOrder(service, link, quantity) {
  try {
    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: 'add',
      service,
      link,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Order error:', error?.response?.data || error.message);
    throw error;
  }
}

async function getOrderStatus(orderId) {
  try {
    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: 'status',
      order: orderId
    });
    return response.data;
  } catch (error) {
    console.error('Status check error:', error?.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  getBalance,
  getServices,
  addOrder,
  getOrderStatus,
  testApiConnection
};