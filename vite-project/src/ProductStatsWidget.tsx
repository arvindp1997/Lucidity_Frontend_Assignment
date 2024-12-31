import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { brown } from '@mui/material/colors';

interface ProductStat {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

interface ProductStatsWidgetProps {
  productStats: ProductStat[];
}

const ProductStatsWidget: React.FC<ProductStatsWidgetProps> = ({ productStats }) => {
  return (
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
  );
};

export default ProductStatsWidget;
