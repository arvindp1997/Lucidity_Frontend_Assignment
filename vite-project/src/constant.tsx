//I have saved API response as productsApiResponse , as API was giving 429 error -  Monthly api hit limit is exceeded
export const productsApiResponse = [
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
  ]

  export const PRODUCT_API_ENDPOINT = 'https://dev-0tf0hinghgjl39z.api.raw-labs.com/inventory';
  export  interface Prod {
    name: string;
    category: string;
    value: string;
    quantity: number;
    price: string;
  }
 export  interface Product {
    name: string;
    category: string;
    value: string;
    quantity: number;
    price: string;
    id: string;
    isProductDisabled: boolean;
  }