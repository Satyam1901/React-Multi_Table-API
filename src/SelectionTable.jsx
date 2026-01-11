import React from 'react';
import {
    Box, Paper, Typography, Chip, Alert,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const SelectionTable = ({ title, data, selectedItems, onToggleItem }) => {
    console.log(`${title} DATA:`, data.slice(0, 3));

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                {title} ({data.length} items | {selectedItems.length} selected)
            </Typography>

            {data.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No data - use search filters above
                </Alert>
            ) : (
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {data.map((item, index) => (
                        <ListItem
                            key={item.id || `item-${index}`}
                            divider
                            sx={{ py: 1 }}
                        >
                            <ListItemButton
                                onClick={() => onToggleItem(item.id || index)}
                                selected={selectedItems.includes(item.id || index)}
                                sx={{ py: 2, borderRadius: 1 }}
                            >
                                <ListItemIcon>
                                    {selectedItems.includes(item.id || index) ?
                                        <CheckBox color="primary" /> :
                                        <CheckBoxOutlineBlank />
                                    }
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography fontWeight="bold" noWrap>
                                                    {item.name || item.category_name || `Item ${item.id || index}`}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {item.brand || item.supplier_name || item.category || 'N/A'}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={`$${item.price || item.selling_price || 0}`}
                                                size="small"
                                                color="success"
                                            />
                                        </Box>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}

            {process.env.NODE_ENV === 'development' && (
                <Alert severity="info" sx={{ mt: 2, fontSize: '0.8rem' }}>
                    Debug: {data.length} items, {selectedItems.length} selected
                    <br />
                    First item keys: {data[0] ? Object.keys(data[0]).join(', ') : 'No data'}
                </Alert>
            )}
        </Paper>
    );
};

export default SelectionTable;
