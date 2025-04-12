const axios = require('axios');

const API_KEY = process.env.SM_API_KEY || ''; // YoYoMedia API key from environment secrets
const API_URL = 'https://yoyomedia.in/api/v2';

async function getBalance() {
  try {
    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: "balance"
    });
    return response.data;
  } catch (error) {
    console.error('Balance check error:', error?.response?.data || error.message);
    throw error;
  }
}

async function addOrder(service, link, quantity) {
  try {
    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: "add",
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

async function getServices() {
  try {
    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: "services"
    });
    return response.data;
  } catch (error) {
    console.error('Services error:', error?.response?.data || error.message);
    throw error;
  }
}
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
    
    // Log raw response for debugging
    console.log('Raw API response:', JSON.stringify(response.data, null, 2));
    
    if (response.data) {
      // Handle both array and object responses
      let services = [];
      if (Array.isArray(response.data)) {
        services = response.data;
      } else if (typeof response.data === 'object') {
        services = Object.values(response.data);
      }
      
      return services.map(service => ({
        name: service.name || (service.Category ? `${service.Category} - ${service.services || ''}` : 'Unknown'),
        service: service.service || service.services || 'N/A',
        rate: parseFloat(service.rate) || 0,
        min: service.min || '0',
        max: service.max || '0',
        category: service.Category || 'Unknown'
      })).filter(service => service.name && service.service !== 'N/A');
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