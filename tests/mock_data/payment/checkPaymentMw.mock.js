const paymentMock = [
  {
    orderNumber: 1234,
    paymentMethod: 'Momo',
    paymentDate: '26-12-2021',
    isPaid: 0,
    secureHash: 'secureHash',
  },
];

const paymentIsPaidMock = [
  {
    orderNumber: 1234,
    paymentMethod: 'Momo',
    paymentDate: '26-12-2021',
    isPaid: 1,
    secureHash: 'secureHash',
  },
];
export { paymentMock, paymentIsPaidMock };
