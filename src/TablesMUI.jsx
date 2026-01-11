import React, { useState, useCallback } from 'react';
import axios from 'axios';
import {
  Container, Typography, Box, Paper, Alert, Chip,
  Stack, Button, CircularProgress, TextField
} from '@mui/material';
import { Search as SearchIcon, Refresh } from '@mui/icons-material';
import SelectionTable from './SelectionTable';

const TablesMUI = () => {

  const [productsData, setProductsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [productSearch, setProductSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = useCallback(async () => {
    setLoadingSearch(true);
    setMessage('');
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/data1`),
        axios.get(`http://localhost:5000/api/data2`)
      ]);

      console.log('🐛 RAW DATA:', {
        products: productsRes.data.length,
        categories: categoriesRes.data.length
      });

      const productTerm = productSearch.toLowerCase().trim();
      const categoryTerm = categorySearch.toLowerCase().trim();

  
      const filteredProducts = productsRes.data.filter(item => {
        if (!productTerm) return true;
        const searchString = JSON.stringify(item).toLowerCase();
        return searchString.includes(productTerm);
      });

      const filteredCategories = categoriesRes.data.filter(item => {
        if (!categoryTerm) return true;
        const searchString = JSON.stringify(item).toLowerCase();
        return searchString.includes(categoryTerm);
      });

      console.log('🐛 FILTERED:', {
        products: filteredProducts.length,
        categories: filteredCategories.length
      });

      setProductsData(filteredProducts);
      setCategoriesData(filteredCategories);
      setMessage(`✅ Loaded ${filteredProducts.length} products + ${filteredCategories.length} categories`);

    } catch (error) {
      console.error('❌ SEARCH ERROR:', error);
      setMessage('❌ Search failed');
      setProductsData([]);
      setCategoriesData([]);
    } finally {
      setLoadingSearch(false);
    }
  }, [productSearch, categorySearch]);

  const handleSubmit = async () => {
    const total = selectedProducts.length + selectedCategories.length;
    if (total === 0) {
      setMessage('❌ Select items first');
      return;
    }

    setLoadingSubmit(true);
    try {
      const payload = {
        data1: selectedProducts.map(id => productsData.find(item => item.id === id)),
        data2: selectedCategories.map(id => categoriesData.find(item => item.id === id)),
        totalCount: total,
        productSearch,
        categorySearch
      };

      const response = await axios.post('http://localhost:5000/api/submit', payload);
      setMessage(`✅ Success! ${total} items submitted (ID: ${response.data.submissionId})`);
      setSelectedProducts([]);
      setSelectedCategories([]);
    } catch (error) {
      setMessage('❌ Submit failed');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const toggleProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const totalSelected = selectedProducts.length + selectedCategories.length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper sx={{ p: 6, textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" gutterBottom>🚀 Tables Example</Typography>
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
          Fill both fields → Click ONE Search button → Select → Submit
        </Typography>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ maxWidth: 800, mx: 'auto', alignItems: 'flex-end' }}
        >
          <TextField
            label="📦 Products Filter"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="iPhone, Apple, active..."
            size="large"
            sx={{ flex: 1 }}
          />

          <TextField
            label="🏷️ Categories Filter"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            placeholder="Premium, Amazon, Active..."
            size="large"
            sx={{ flex: 1 }}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleSearch}
            disabled={loadingSearch}
            startIcon={loadingSearch ? <CircularProgress size={24} /> : <SearchIcon />}
            sx={{ px: 6, minWidth: 150 }}
          >
            {loadingSearch ? 'Searching...' : '🔍 SEARCH'}
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              setProductSearch('');
              setCategorySearch('');
              setProductsData([]);
              setCategoriesData([]);
              setSelectedProducts([]);
              setSelectedCategories([]);
              setMessage('');
            }}
            startIcon={<Refresh />}
            disabled={loadingSearch}
          >
            Reset
          </Button>
        </Stack>

        <Typography variant="h5" sx={{ mt: 3 }}>
          Available: {productsData.length + categoriesData.length} |
          Selected: <Chip label={totalSelected} color="primary" size="large" sx={{ ml: 2 }} />
        </Typography>
      </Paper>
      <Stack spacing={4}>
        <SelectionTable
          title="📦 Products Selection"
          data={productsData}
          selectedItems={selectedProducts}
          onToggleItem={toggleProduct}
        />
        <SelectionTable
          title="🏷️ Categories Selection"
          data={categoriesData}
          selectedItems={selectedCategories}
          onToggleItem={toggleCategory}
        />
      </Stack>
      <Paper sx={{ p: 6, mt: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Submit {totalSelected} Items
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loadingSubmit || totalSelected === 0}
          startIcon={loadingSubmit ? <CircularProgress size={24} /> : null}
          sx={{
            px: 10, py: 4,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            minWidth: 500,
            boxShadow: 4
          }}
        >
          {loadingSubmit ? '⏳ Submitting...' : `🚀 SUBMIT ${totalSelected} ITEMS`}
        </Button>
      </Paper>

      {message && (
        <Alert
          severity={message.includes('Success') || message.includes('Loaded') ? 'success' : 'error'}
          sx={{ mt: 6, p: 3 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default TablesMUI;
