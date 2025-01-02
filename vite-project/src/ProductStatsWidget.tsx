import React from "react";
import { Stack, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { brown } from "@mui/material/colors";

interface ProductStat {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

interface ProductStatsWidgetProps {
  productStats: ProductStat[];
}

const ProductStatsWidget: React.FC<ProductStatsWidgetProps> = ({ productStats }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      direction={isSmallScreen ? "column" : "row"}
      justifyContent="space-between"
      spacing={isSmallScreen ? 2 : 4}
    >
      {productStats.map((item) => (
        <Box
          key={item.title}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={isSmallScreen ? 2 : 4}
          width={isSmallScreen ? "100%" : 350}
          height={isSmallScreen ? 100 : 120}
          sx={{
            backgroundColor: brown[900],
            borderRadius: "5%",
            padding: isSmallScreen ? "10px" : "20px",
          }}
        >
          {item.icon}
          <Stack direction="column" gap={1}>
            <Typography
              variant={isSmallScreen ? "body2" : "body1"}
              fontSize={isSmallScreen ? 14 : 16}
            >
              {item.title}
            </Typography>
            <Typography
              variant="h4"
              fontSize={isSmallScreen ? 24 : 40}
              sx={{ fontWeight: isSmallScreen ? 500 : 700 }}
            >
              {item.value}
            </Typography>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default ProductStatsWidget;
