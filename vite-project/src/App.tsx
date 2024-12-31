import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Chip, IconButton, Switch, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from "@mui/icons-material/Delete";
import { brown } from "@mui/material/colors";
import DataTable, { createTheme as ct } from "react-data-table-component";

const TableColumnChipStyle = { color: "orange", background: "black" };
const columns = [
  {
    name: <Chip label="Name" sx={TableColumnChipStyle} />,
    selector: (row) => row.name,
  },
  {
    name: <Chip label="Category" sx={TableColumnChipStyle} />,
    selector: (row) => row.category,
  },
  {
    name: <Chip label="Price" sx={TableColumnChipStyle} />,
    selector: (row) => row.price,
  },
  {
    name: <Chip label="Quantity" sx={TableColumnChipStyle} />,
    selector: (row) => row.quantity,
  },
  {
    name: <Chip label="Value" sx={TableColumnChipStyle} />,
    selector: (row) => row.value,
  },
  {
    name: <Chip label="ACTION" sx={TableColumnChipStyle} />,
    selector: (row) => (
      <Stack direction="row" gap={1}>
        <IconButton>
          <EditIcon />
        </IconButton>
        <IconButton>
          <VisibilityIcon />
        </IconButton>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Stack>
    ),
  },
];

const initialProductStats = [
  { icon: <ShoppingCartIcon />, title: "Total product", value: 0 },
  { icon: <CurrencyExchangeIcon />, title: "Total store value", value: 0 },
  { icon: <RemoveShoppingCartIcon />, title: "Out of stocks", value: 0 },
  { icon: <CategoryIcon />, title: "No of category", value: 0 },
];

function App() {
  const [data, setData] = useState([
    {
      name: "Bluetooth",
      category: "Electronic",
      value: "$150",
      quantity: 5,
      price: "$30",
    },
    {
      name: "Edifier M43560",
      category: "Electronic",
      value: "0",
      quantity: 0,
      price: "$0",
    },
    {
      name: "Sony 4k ultra 55 inch TV",
      category: "Electronic",
      value: "$1190",
      quantity: 17,
      price: "$70",
    },
    {
      name: "Samsumg 55 inch TV",
      category: "Electronic",
      value: "$600",
      quantity: 50,
      price: "$12",
    },
    {
      name: "samsumg S34 Ultra",
      category: "phone",
      value: "$0",
      quantity: 0,
      price: "$0",
    },
  ]); // Added API response in initial state of data cause API was giving 429 Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checked, setChecked] = React.useState(true);
  const [productStats, setProductStats] = useState(initialProductStats);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  ct("dark", {
    background: {
      default: '#242323',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://dev-0tf0hinghgjl39z.api.raw-labs.com/inventory"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return  (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
  // if (error) return <p>Error: {error}</p>;

  console.log("data", data);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack direction="column" spacing={2} sx={{ margin: "10px" }}>
        <Stack direction="row" gap={6} alignSelf="flex-end" alignItems="center">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography variant="body1">admin</Typography>
            <Switch
              checked={checked}
              onChange={handleChange}
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
        <DataTable columns={columns} data={data} theme="dark" />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
