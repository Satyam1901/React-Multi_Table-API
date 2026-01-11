import React, { useState } from 'react';
import axios from 'axios';
import {
    Box, Paper, TextField, Button, Typography,
    CircularProgress, Stack, List, ListItem, ListItemText, Alert
} from '@mui/material';
import { Search } from '@mui/icons-material';
const Worklist = ({ title, apiEndpoint, onDataLoad }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const loadData = async () => {
        if (!searchTerm.trim()) {
            setData([]);
            onDataLoad?.([]);
            return;
        }
        setLoading(true);
        setError('');

        try {
            // Add search param to API call
            const params = new URLSearchParams({ q: searchTerm });
            const response = await axios.get(`${apiEndpoint}?${params}`);
            const filteredData = response.data.filter(item =>
                JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
            );
            setData(filteredData);
            onDataLoad?.(filteredData);
        } catch (error) {
            setError('No data found');
            setData([]);
            onDataLoad?.([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>{title}</Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'end' }}>
                <TextField
                    label="🔍 Search to Load Data"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && loadData()}
                    fullWidth
                    placeholder="Type to search products/categories..."
                    size="small"
                />
                <Button
                    variant="contained"
                    onClick={loadData}
                    startIcon={<Search />}
                    disabled={loading || !searchTerm.trim()}
                    size="small"
                >
                    {loading ? <CircularProgress size={20} /> : 'Search & Load'}
                </Button>
            </Stack>

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            {data.length === 0 && !loading && searchTerm && (
                <Alert severity="info">No results found for "{searchTerm}"</Alert>
            )}

            {data.length === 0 && !loading && !searchTerm && (
                <Alert severity="info">👆 Search above to load data</Alert>
            )}

            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {data.map((item) => (
                    <ListItem key={item.id} divider>
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <Typography fontWeight="bold">
                                        {item.name || item.category_name || `ID: ${item.id}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.brand || item.supplier_name}
                                    </Typography>
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default Worklist;
