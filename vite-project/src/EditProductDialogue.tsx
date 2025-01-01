import React, { useMemo, useState } from "react";
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
  const [quantity, setQuantity] = useState(Math.max(0, product.quantity || 0));
  const [price, setPrice] = useState(
    Math.max(0, parseInt(product.price.slice(1)) || 0)
  );

  const finalValue = `$${quantity > 0 && price > 0 ? quantity * price : 0}`;

  const updatedProduct = useMemo(
    () => ({
      ...product,
      category: category.trim(),
      quantity,
      price: `$${price}`,
      value: finalValue,
    }),
    [category, quantity, price, finalValue, product]
  );

  const normalizeProduct = (product: Product) => ({
    ...product,
    value: product.value.startsWith("$") ? product.value : `$${product.value}`,
  });
  
  const onSaveDisabled = useMemo(() => {
    const normalizedOriginal = normalizeProduct(product);
    const normalizedUpdated = normalizeProduct(updatedProduct);
    return JSON.stringify(normalizedOriginal) === JSON.stringify(normalizedUpdated);
  }, [product, updatedProduct]);

  const handleSave = () => onSave(updatedProduct);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Stack direction="row" justifyContent="space-between" padding={2}>
        <Typography fontSize={35} paddingLeft={2}>
          Edit Product
        </Typography>
        <IconButton
          color="warning"
          onClick={onClose}
          sx={{ alignSelf: "flex-end" }}
          aria-label="Close edit dialog"
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
              onChange={(e) =>
                setPrice(Math.max(0, parseInt(e.target.value) || 0))
              }
              fullWidth
            />
          </Box>

          <Box display="flex" flexDirection="row" gap={2}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(0, parseInt(e.target.value, 10) || 0))
              }
              fullWidth
            />
            <TextField label="Value" value={finalValue} disabled fullWidth />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="warning">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={onSaveDisabled}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
