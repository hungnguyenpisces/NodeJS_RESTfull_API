const orderDetailMock = {
  orderNumber: 21,
  productCode: 'S18_01',
  quantityOrdered: 4259,
  priceEach: '51.61',
  orderLineNumber: 3,
};

const orderDetailUpdate = {
  body: {
    orderNumber: 21,
    productCode: 'S18_01',
  },
  params: {
    quantityOrdered: 4259,
    priceEach: '51.61',
    orderLineNumber: 3,
  },
};

export { orderDetailMock, orderDetailUpdate };
