const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - FIXED CORS for ALL localhost ports
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Data directory
const DATA_DIR = './data';
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// 🔥 COMPLETE 20 ROWS × 20 COLUMNS DATA GENERATOR
async function initData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('📁 Data directory ready');
  } catch (err) {
    console.log('📁 Data directory already exists');
  }

  // 🔥 PRODUCTS: EXACTLY 20 ROWS × 20 COLUMNS
  try {
    await fs.access(PRODUCTS_FILE);
    console.log('✅ Products file exists');
  } catch {
    const products = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `iPhone Pro ${i + 1}`,
      brand: ['Apple', 'Samsung', 'Google', 'Sony', 'Dell'][i % 5],
      category: ['Electronics', 'Mobile', 'Laptop', 'Tablet', 'Wearable'][i % 5],
      subcategory: `Subcategory ${i % 4 + 1}`,
      status: ['active', 'pending', 'out-of-stock', 'low-stock', 'discontinued'][i % 5],
      stock_quantity: Math.floor(Math.random() * 500) + 10,
      reserved_stock: Math.floor(Math.random() * 50),
      available_stock: Math.floor(Math.random() * 450),
      price: Math.floor(Math.random() * 2000) + 100,
      sale_price: Math.floor(Math.random() * 500) + 50,
      discount_percent: Math.floor(Math.random() * 40),
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      review_count: Math.floor(Math.random() * 1000),
      weight_kg: Number((Math.random() * 5 + 0.1).toFixed(2)),
      dimensions: `${Math.floor(Math.random()*20+10)}x${Math.floor(Math.random()*15+8)}x${Math.floor(Math.random()*5+2)}cm`,
      warranty_months: Math.floor(Math.random() * 36) + 12,
      sku: `SKU${String(i + 1).padStart(4, '0')}`,
      barcode: `BAR${String((i + 1) * 123456).padStart(12, '0')}`,
      created_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      updated_date: new Date().toISOString().split('T')[0]
    }));

    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    console.log(`✅ Generated ${products.length} PRODUCTS (20 ROWS × 20 COLUMNS)`);
  }

  // 🔥 CATEGORIES: EXACTLY 20 ROWS × 20 COLUMNS  
  try {
    await fs.access(CATEGORIES_FILE);
    console.log('✅ Categories file exists');
  } catch {
    const categories = Array.from({ length: 20 }, (_, i) => ({
      id: `CAT${String(i + 1).padStart(3, '0')}`,
      category_name: `Category ${i + 1}`,
      supplier_name: ['Amazon', 'Walmart', 'Target', 'BestBuy', 'eBay'][i % 5],
      product_type: ['Premium', 'Standard', 'Budget', 'Luxury', 'Basic'][i % 5],
      base_price: Math.floor(Math.random() * 1000) + 20,
      list_price: Math.floor(Math.random() * 1200) + 30,
      selling_price: Math.floor(Math.random() * 800) + 15,
      discount_amount: Math.floor(Math.random() * 200),
      discount_percent: Math.floor(Math.random() * 50),
      margin_percent: Math.floor(Math.random() * 40) + 10,
      tax_rate: Number((Math.random() * 15 + 5).toFixed(2)),
      stock_qty: Math.floor(Math.random() * 2000),
      min_stock: Math.floor(Math.random() * 100),
      max_stock: Math.floor(Math.random() * 5000),
      reorder_qty: Math.floor(Math.random() * 500),
      weight_g: Math.floor(Math.random() * 5000) + 100,
      volume_cm3: Math.floor(Math.random() * 10000) + 1000,
      active_status: i % 3 !== 2,
      created_date: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      updated_date: new Date().toISOString().split('T')[0]
    }));

    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
    console.log(`✅ Generated ${categories.length} CATEGORIES (20 ROWS × 20 COLUMNS)`);
  }

  // Initialize empty submissions
  try {
    await fs.access(SUBMISSIONS_FILE);
  } catch {
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
    console.log('✅ Submissions file initialized');
  }
}

// API ROUTES - ALL PROTECTED WITH ERROR HANDLING

// 1. GET /api/data1 - Products (20x20)
app.get('/api/data1', async (req, res) => {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    console.log(`📊 GET /api/data1: ${products.length} products served`);
    res.json(products);
  } catch (error) {
    console.error('❌ Products error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// 2. GET /api/data2 - Categories (20x20)
app.get('/api/data2', async (req, res) => {
  try {
    const data = await fs.readFile(CATEGORIES_FILE, 'utf8');
    const categories = JSON.parse(data);
    console.log(`📊 GET /api/data2: ${categories.length} categories served`);
    res.json(categories);
  } catch (error) {
    console.error('❌ Categories error:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// 3. POST /api/submit - Submit Selected Data
app.post('/api/submit', async (req, res) => {
  try {
    const submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      data1: req.body.data1 || [],
      data2: req.body.data2 || [],
      totalCount: req.body.totalCount || 0,
      status: 'send'
    };

    console.log(`📤 POST /api/submit: ${submission.totalCount} items`);

    // Read existing submissions
    let submissions = [];
    try {
      const data = await fs.readFile(SUBMISSIONS_FILE, 'utf8');
      submissions = JSON.parse(data);
    } catch {
      submissions = [];
    }

    // Add new submission (recent first)
    submissions.unshift(submission);

    // Limit to last 50 submissions (prevent file bloat)
    if (submissions.length > 50) {
      submissions = submissions.slice(0, 50);
    }

    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));

    res.json({
      success: true,
      message: 'Data submitted successfully!',
      submissionId: submission.id,
      totalItems: submission.totalCount,
      submissionsCount: submissions.length
    });
  } catch (error) {
    console.error('❌ Submit error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit data',
      message: error.message
    });
  }
});

// 4. GET /api/submissions - View all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const data = await fs.readFile(SUBMISSIONS_FILE, 'utf8');
    const submissions = JSON.parse(data);
    console.log(`📋 GET /api/submissions: ${submissions.length} total submissions`);
    res.json(submissions);
  } catch {
    res.json([]);
  }
});

// 5. DELETE /api/submissions/:id - Delete specific submission
app.delete('/api/submissions/:id', async (req, res) => {
  try {
    const data = await fs.readFile(SUBMISSIONS_FILE, 'utf8');
    let submissions = JSON.parse(data);
    const initialCount = submissions.length;
    submissions = submissions.filter(s => s.id !== req.params.id);
    
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
    console.log(`🗑️ Deleted submission. ${initialCount} → ${submissions.length}`);
    
    res.json({
      success: true,
      deleted: initialCount !== submissions.length,
      remaining: submissions.length
    });
  } catch {
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    dataFiles: {
      products: PRODUCTS_FILE,
      categories: CATEGORIES_FILE,
      submissions: SUBMISSIONS_FILE
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// Start server
const startServer = async () => {
  await initData();
  app.listen(PORT, () => {
    console.log('\n🚀 BACKEND SERVER STARTED! (20x20 DATASET) 🚀');
    console.log('='.repeat(70));
    console.log(`📊 PORT: ${PORT}`);
    console.log(`📊 PRODUCTS (20×20): GET  http://localhost:${PORT}/api/data1`);
    console.log(`📊 CATEGORIES (20×20): GET http://localhost:${PORT}/api/data2`);
    console.log(`📤 SUBMIT DATA: POST  http://localhost:${PORT}/api/submit`);
    console.log(`📋 VIEW SUBMISSIONS: GET http://localhost:${PORT}/api/submissions`);
    console.log(`✅ HEALTH CHECK: GET  http://localhost:${PORT}/api/health`);
    console.log(`🗑️  DELETE SUB: DELETE http://localhost:${PORT}/api/submissions/{id}`);
    console.log('='.repeat(70));
    console.log('💡 Test: curl http://localhost:5000/api/data1');
  });
};

startServer().catch(error => {
  console.error('💥 Server failed to start:', error);
  process.exit(1);
});
