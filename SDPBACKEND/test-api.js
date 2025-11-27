const axios = require('axios');

const API_BASE = 'http://localhost:2006/api';

async function testAPI() {
  console.log('Testing Backend API Endpoints...\n');
  
  try {
    // Test 1: Get Users
    console.log('1. Testing GET /users');
    const usersResponse = await axios.get(`${API_BASE}/users`);
    console.log('✅ Users API working:', usersResponse.data.length, 'users found');
    console.log('Sample user:', usersResponse.data[0]);
    console.log('');
    
    // Test 2: Get Products
    console.log('2. Testing GET /products');
    const productsResponse = await axios.get(`${API_BASE}/products`);
    console.log('✅ Products API working:', productsResponse.data.length, 'products found');
    console.log('Sample product:', productsResponse.data[0]);
    console.log('');
    
    // Test 3: Get Suppliers
    console.log('3. Testing GET /suppliers');
    const suppliersResponse = await axios.get(`${API_BASE}/suppliers`);
    console.log('✅ Suppliers API working:', suppliersResponse.data.length, 'suppliers found');
    console.log('Sample supplier:', suppliersResponse.data[0]);
    console.log('');
    
    // Test 4: Login
    console.log('4. Testing POST /auth/login');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'password123',
      role: 'ADMIN'
    });
    console.log('✅ Login API working');
    console.log('Token:', loginResponse.data.token);
    console.log('User:', loginResponse.data.user);
    console.log('');
    
    // Test 5: Verify Token
    console.log('5. Testing GET /auth/me');
    const meResponse = await axios.get(`${API_BASE}/auth/me?username=admin`);
    console.log('✅ Verify Token API working');
    console.log('User info:', meResponse.data);
    console.log('');
    
    console.log('🎉 All API endpoints are working correctly!');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.response?.data || error.message);
  }
}

testAPI();
