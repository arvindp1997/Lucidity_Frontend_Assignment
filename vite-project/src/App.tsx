import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Chip, IconButton, Switch, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import { brown } from "@mui/material/colors";
import DataTable, { createTheme as tableCreateTheme } from "react-data-table-component";
import { productsApiResponse, Product, Prod , PRODUCT_API_ENDPOINT} from "./constant";
import EditProductDialog from "./EditProductDialogue";

const tableColumnChipStyle = { color: "orange", background: "black" };
const actionColumnChipStyle = { ...tableColumnChipStyle, marginLeft: "20px" };
const addUniqueIdsToProducts = (products: Prod[]) => {
  return products.map((product, index) => ({
    ...product,
    id: `product-${index + 1}`,
    isProductDisabled: false,
  }));
};

function App() {
  const [productData, setProductData] = useState(addUniqueIdsToProducts(productsApiResponse));
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
        icon: <ShoppingCartIcon />,
        title: "Total product",
        value: totalProduct,
      },
      {
        icon: <CurrencyExchangeIcon />,
        title: "Total store value",
        value: `$${totalStoreValue}`,
      },
      {
        icon: <RemoveShoppingCartIcon />,
        title: "Out of stocks",
        value: outOfStock,
      },
      { icon: <CategoryIcon />, title: "No of category", value: noOfCategory },
    ];
  }, [productData]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  tableCreateTheme("dark", {
    background: {
      default: "#242323",
    },
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          PRODUCT_API_ENDPOINT
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setProductData(addUniqueIdsToProducts(result));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const toggleViewMode = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setViewUser(event.target.checked);
  }, [])

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
  }, [])

  const handleProductDelete = useCallback(
    (productId: string) => {
      const updatedProductsData = productData.filter((prod) => prod.id !== productId);
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

  const columns = useMemo(() =>
    [
      {
        name: <Chip label="Name" sx={tableColumnChipStyle} />,
        selector: (row: Product) => row.name,
      },
      {
        name: <Chip label="Category" sx={tableColumnChipStyle} />,
        cell: (row: Product) => (
          <Typography variant="body1" sx={{ marginLeft: "10px" }}>
            {row.category}
          </Typography>
        ),
      },
      {
        name: <Chip label="Price" sx={tableColumnChipStyle} />,
        cell: (row: Product) => (
          <Typography variant="body1" sx={{ marginLeft: "10px" }}>
            {row.price}
          </Typography>
        ),
      },
      {
        name: <Chip label="Quantity" sx={tableColumnChipStyle} />,
        cell: (row: Product) => (
          <Typography variant="body1" sx={{ marginLeft: "10px" }}>
            {row.quantity}
          </Typography>
        ),
      },
      {
        name: <Chip label="Value" sx={tableColumnChipStyle} />,
        cell: (row: Product) => (
          <Typography variant="body1" sx={{ marginLeft: "10px" }}>
            {row.value}
          </Typography>
        ),
      },
      {
        name: <Chip label="ACTION" sx={actionColumnChipStyle} />,
        cell: (row: Product) => (
          <Stack direction="row" gap={1}>
            <IconButton
              disabled={isViewUser || row.isProductDisabled}
              onClick={() => handleProductUpdate(row)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={isViewUser}
              onClick={() => toggleProduct(row.id)}
            >
              {row.isProductDisabled ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
            <IconButton
              disabled={isViewUser}
              onClick={() => handleProductDelete(row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ),
      },
    ] , [handleProductDelete, handleProductUpdate, isViewUser, toggleProduct]) 

  if (loading)
    return (
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <CircularProgress />
      </Box>
    );

  // if (error) return <p>Error: {error}</p>;



  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack direction="column" spacing={4} sx={{ margin: "10px" }}>
        <Stack direction="row" gap={6} alignSelf="flex-end" alignItems="center">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography variant="body1">admin</Typography>
            <Switch
              checked={isViewUser}
              onChange={toggleViewMode}
              inputProps={{ "aria-label": "controlled" }}
            />
            <Typography variant="body1">user</Typography>
          </Box>
          <IconButton>
            <LogoutIcon />
          </IconButton>
        </Stack>
        <Typography variant="h3">Inventory stats</Typography>
        <Stack direction="row" justifyContent="space-between">
          {productStats.map((item) => (
            <Box
              key={item.title}
              display="flex"
              flexDirection="row"
              gap={4}
              width={350}
              height={120}
              sx={{
                backgroundColor: brown[900],
                borderRadius: "5%",
                padding: "20px",
              }}
            >
              {item.icon}
              <Stack direction="column" gap={2}>
                <Typography>{item.title}</Typography>
                <Typography variant="h4" fontSize={40}>
                  {item.value}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Stack>
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

export default App;
