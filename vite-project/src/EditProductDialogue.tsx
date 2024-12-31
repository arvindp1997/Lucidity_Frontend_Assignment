import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Product } from "./constant";

interface EditProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onSave: (updatedProduct: Product) => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({
  open,
  onClose,
  product,
  onSave,
}) => {
  const [category, setCategory] = useState(product.category);
  const [quantity, setQuantity] = useState(product.quantity);
  const [price, setPrice] = useState(parseInt(product.price.slice(1)));

  const value = !isNaN(quantity * price) ? quantity * price : 0;
  const finalValue = !isNaN(value) ? `$${value}` : "0";
  
  const handleSave = () => {
    const updatedProduct = {
      ...product,
      category,
      quantity,
      price: "$" + price,
      value: finalValue,
    };
    onSave(updatedProduct);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack
        direction="row"
        justifyContent="space-between"
        display="flex"
        padding={2}
      >
        <Typography fontSize={35} paddingLeft={2}>
          Edit product
        </Typography>
        <IconButton
          color='warning'
          onClick={onClose}
          sx={{ display: "flex", alignSelf: "flex-end" }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      <Typography fontSize={20} paddingLeft={4}>
        {product.name}
      </Typography>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <Box display="flex" flexDirection="row" gap={2}>
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              fullWidth
            />
          </Box>

          <Box display="flex" flexDirection="row" gap={2}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              fullWidth
            />

            <TextField label="Value" value={finalValue} disabled fullWidth />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='warning' >
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
