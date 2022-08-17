const ordersMock = [
  {
    orderNumber: 1,
    orderDate: '2021-12-21',
    requiredDate: '2021-12-21',
    shippedDate: null,
    status: 'Shipped',
    comments: null,
    customerNumber: 1,
  },
];

const productMock = {
  productCode: 'S10_1632132',
  productName: '1969 Harley Davidson Ultimate Chopper11',
  productLine: 'nothing',
  productScale: '1:10',
  productVendor: 'Min Lin Diecast',
  productDescription:
    'This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.',
  quantityInStock: 7933,
  buyPrice: '48.81',
  MSRP: '95.70',
};

const newOrdersMock = {
  orderDate: '2021-12-21',
  requiredDate: '2021-12-21',
  shippedDate: null,
  status: 'Shipped',
  comments: null,
  customerNumber: 1,
};

const orderAndPaymentCashMock = {
  orderNumber: 11,
  customerNumber: 1,
  comments: null,
  orderDate: '2021-12-21',
  requiredDate: '2021-12-21',
  shippedDate: null,
  status: 'Shipped',
  orderLineNumber: 3,
  products: [
    {
      productCode: 'S18_01',
      quantityOrdered: 6,
    },
  ],
  payment: {
    amount: 9999,
    paymentDate: '2021-12-21',
    paymentMethod: 'Cash',
    secureHash: 'secureHash',
    isPaid: 0,
  },
};

const orderAndPaymentCODMock = {
  orderNumber: 11,
  customerNumber: 1,
  comments: null,
  orderDate: '2021-12-21',
  requiredDate: '2021-12-21',
  shippedDate: null,
  status: 'Shipped',
  orderLineNumber: 3,
  products: [
    {
      productCode: 'S18_01',
      quantityOrdered: 6,
    },
  ],
  payment: {
    amount: 9999,
    paymentDate: '2021-12-21',
    paymentMethod: 'COD',
    secureHash: 'secureHash',
    isPaid: 0,
  },
};

const orderAndPaymentMomoMock = {
  orderNumber: 11,
  customerNumber: 1,
  comments: null,
  orderDate: '2021-12-21',
  requiredDate: '2021-12-21',
  shippedDate: null,
  status: 'Shipped',
  orderLineNumber: 3,
  products: [
    {
      productCode: 'S18_01',
      quantityOrdered: 6,
    },
  ],
  payment: {
    amount: 9999,
    paymentDate: '2021-12-21',
    paymentMethod: 'Momo',
    orderNumber: 11,
    secureHash: 'secureHash',
    isPaid: 1,
  },
};

export {
  ordersMock,
  productMock,
  newOrdersMock,
  orderAndPaymentCashMock,
  orderAndPaymentCODMock,
  orderAndPaymentMomoMock,
};
