import CategoryIcon from "@mui/icons-material/Category";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Chip, IconButton, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, {
  createTheme as createDataTableTheme,
} from "react-data-table-component";
import {
  Prod,
  Product,
  PRODUCT_API_ENDPOINT,
  productsApiResponse,
} from "./constant";
import EditProductDialog from "./EditProductDialogue";
import Loader from "./Loader";
import Navbar from "./Navbar";
import ProductStatsWidget from "./ProductStatsWidget";

const tableColumnHeaderChipStyle = { color: "orange", background: "black" };
const actionColumnHeaderChipStyle = {
  ...tableColumnHeaderChipStyle,
  marginLeft: "20px",
};
const widgetIconStyle = { fontSize: 40 };

const addUniqueIdsToProducts = (products: Prod[]) => {
  return products.map((product, index) => ({
    ...product,
    id: `product-${index + 1}`,
    isProductDisabled: false,
  }));
};

function InventoryManagement() {
  const [productData, setProductData] = useState(
    addUniqueIdsToProducts(productsApiResponse)
  );
  // Calculate inventory stats
  const calculateProductStats = useMemo(() => {
    const filteredData = productData.filter((item) => !item.isProductDisabled); // Exclude disabled products

    const totalProduct = filteredData.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalStoreValue = filteredData.reduce(
      (sum, item) =>
        sum + parseInt(item.value[0] === "$" ? item.value.slice(1) : "0"),
      0
    );
    const outOfStock = filteredData.filter(
      (item) => item.quantity === 0
    ).length;
    const noOfCategory = new Set(filteredData.map((item) => item.category))
      .size;

    return [
      {
        icon: <ShoppingCartIcon style={widgetIconStyle} />,
        title: "Total product",
        value: totalProduct,
      },
      {
        icon: <CurrencyExchangeIcon style={widgetIconStyle} />,
        title: "Total store value",
        value: totalStoreValue.toLocaleString(),
      },
      {
        icon: <RemoveShoppingCartIcon style={widgetIconStyle} />,
        title: "Out of stocks",
        value: outOfStock,
      },
      {
        icon: <CategoryIcon style={widgetIconStyle} />,
        title: "No of category",
        value: noOfCategory,
      },
    ];
  }, [productData]);

  const [loading, setLoading] = useState(true);
  const [isViewUser, setViewUser] = useState(false);
  const [productStats, setProductStats] = useState(calculateProductStats);
  const [openEditProductDialog, setOpenEditProductDialog] = useState(false);
  const [currentProductToEdit, setCurrentProductToEdit] =
    useState<Product | null>(null);

  useEffect(() => {
    setProductStats(calculateProductStats);
  }, [calculateProductStats, productData]);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  createDataTableTheme("dark", {
    background: {
      default: "#242323",
    },
  });

  const fetchProductData = useCallback(async () => {
    try {
      const response = await fetch(PRODUCT_API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setProductData(addUniqueIdsToProducts(result));
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const toggleViewMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setViewUser(event.target.checked);
    },
    []
  );

  const handleProductUpdate = useCallback((product: Product) => {
    setCurrentProductToEdit(product);
    setOpenEditProductDialog(true);
  }, []);

  const handleSaveProduct = useCallback((updatedProduct: Product) => {
    setProductData((prevProducts: Product[]) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setOpenEditProductDialog(false);
  }, []);

  const handleProductDelete = useCallback(
    (productId: string) => {
      const updatedProductsData = productData.filter(
        (prod) => prod.id !== productId
      );
      setProductData(updatedProductsData);
    },
    [productData]
  );

  const toggleProduct = useCallback(
    (productId: string) => {
      const updatedProductsData = productData.map((prod) =>
        prod.id === productId
          ? { ...prod, isProductDisabled: !prod.isProductDisabled }
          : prod
      );
      setProductData(updatedProductsData);
    },
    [productData]
  );

  const columns = useMemo(
    () => [
      {
        name: <Chip label="Name" sx={tableColumnHeaderChipStyle} />,
        cell: (row: Product) => (
          <Typography variant="body1" sx={{ color:  row.isProductDisabled ? 'gray' : ''}}>
            {row.name}
          </Typography>
        ),
      },
      {
        name: <Chip label="Category" sx={tableColumnHeaderChipStyle} />,
        cell: (row: Product) => (
          <Typography variant="body1" sx={{ marginLeft: "10px" , color:  row.isProductDisabled ? 'gray' : ''}}>
            {row.category}
          </Typography>
        ),
      },
      {
        name: <Chip label="Price" sx={tableColumnHeaderChipStyle} />,
        cell: (row: Product) => (
          <Typography variant="body1" sx={{ marginLeft: "10px", color:  row.isProductDisabled ? 'gray' : '' }}>
            {row.price}
          </Typography>
        ),
      },
      {
        name: <Chip label="Quantity" sx={tableColumnHeaderChipStyle} />,
        cell: (row: Product) => (
          <Typography variant="body1" sx={{ marginLeft: "10px", color:  row.isProductDisabled ? 'gray' : '' }}>
            {row.quantity}
          </Typography>
        ),
      },
      {
        name: <Chip label="Value" sx={tableColumnHeaderChipStyle} />,
        cell: (row: Product) => (
          <Typography variant="body1" sx={{ marginLeft: "10px", color:  row.isProductDisabled ? 'gray' : '' }}>
            {row.value}
          </Typography>
        ),
      },
      {
        name: <Chip label="ACTION" sx={actionColumnHeaderChipStyle} />,
        cell: (row: Product) => (
          <Stack direction="row" gap={1}>
            <IconButton
              color="success"
              disabled={isViewUser || row.isProductDisabled}
              onClick={() => handleProductUpdate(row)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="primary"
              disabled={isViewUser}
              onClick={() => toggleProduct(row.id)}
            >
              {row.isProductDisabled ? (
                <VisibilityOffIcon />
              ) : (
                <VisibilityIcon />
              )}
            </IconButton>
            <IconButton
              color="warning"
              disabled={isViewUser}
              onClick={() => handleProductDelete(row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [handleProductDelete, handleProductUpdate, isViewUser, toggleProduct]
  );

  if (loading) return <Loader />;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack direction="column" spacing={4} sx={{ margin: "10px" }}>
        <Navbar isViewUser={isViewUser} toggleViewMode={toggleViewMode} />
        <Typography variant="h3">Inventory stats</Typography>
        <ProductStatsWidget productStats={productStats} />
        <DataTable columns={columns} data={productData} theme="dark" />
      </Stack>
      {openEditProductDialog && currentProductToEdit && (
        <EditProductDialog
          open={openEditProductDialog}
          onClose={() => setOpenEditProductDialog(false)}
          product={currentProductToEdit}
          onSave={handleSaveProduct}
        />
      )}
    </ThemeProvider>
  );
}

export default InventoryManagement;
