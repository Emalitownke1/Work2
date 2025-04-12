const axios = require('axios');

const API_KEY = 'fec208398d31ad017dddebcb740dc49ce8495ad5801396b5b260ce25b0292eab'; // YoYoMedia API key
const API_URL = 'https://yoyomedia.in/api/v2';

async function getBalance() {
  try {
    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: 'balance'
    });
    if (response.data && typeof response.data === 'object') {
      return {
        balance: response.data.balance || '0',
        currency: response.data.currency || 'USD'
      };
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
}

async function getServices() {
  try {
    const response = await axios.post(API_URL, {
      key: API_KEY, 
      action: 'services'
    });
    if (response.data && typeof response.data === 'object') {
      return Object.values(response.data);
    }
    return [];
  } catch (error) {
    console.error('Error getting services:', error);
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
    console.error('Error adding order:', error);
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
    console.error('Error getting order status:', error);
    throw error;
  }
}

module.exports = {
  getBalance,
  getServices, 
  addOrder,
  getOrderStatus
};