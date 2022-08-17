const customerDataMock = {
  customerNumber: 1,
  customerName: 'Atelier graphique',
  contactLastName: 'Schmitt',
  contactFirstName: 'Carine',
  phone: '40.32.2555',
  addressLine1: '40.32.2555',
  addressLine2: null,
  city: 'Nantes',
  state: null,
  postalCode: '44000',
  country: 'France',
  salesRepEmployeeNumber: 1370,
  creditLimit: null,
  userNumber: '',
  roleNumber: 4,
};

const customerGraphFetchOrders = {
  customerNumber: 1,
  customerName: 'Atelier graphique',
  contactLastName: 'Schmitt',
  contactFirstName: 'Carine ',
  phone: '40.32.2555',
  addressLine1: '54, rue Royale',
  addressLine2: null,
  city: 'Nantes',
  state: null,
  postalCode: '44000',
  country: 'France',
  salesRepEmployeeNumber: 13,
  creditLimit: '21000.00',
  userNumber: 23,
  roleNumber: 4,
  isActive: 1,
  email: 'customer01@email.com',
  orders: [
    {
      orderNumber: 1,
      orderDate: '2003-01-05T17:00:00.000Z',
      requiredDate: '2003-01-12T17:00:00.000Z',
      shippedDate: '2003-01-09T17:00:00.000Z',
      status: 'Shipped',
      comments: null,
      customerNumber: 1,
    },
  ],
};

const customerTrancsInput = {
  email: 'customer5@abc.xyz.com',
  customerName: 'Customer2',
  contactLastName: 'Schmitt',
  contactFirstName: 'Carine',
  phone: '40.32.111',
  addressLine1: '40.32.1111',
  city: 'Nantes',
  country: 'xxx',
};

const customerTrancsSucces = {
  user: {
    email: 'customer5@abc.xyz.com',
    userNumber: 6,
  },
  customer: {
    customerName: 'Customer2',
    contactLastName: 'Schmitt',
    contactFirstName: 'Carine',
    phone: '40.32.111',
    addressLine1: '40.32.1111',
    city: 'Nantes',
    country: 'xxx',
    userNumber: 6,
    isActive: 1,
    customerNumber: 4,
  },
};

export {
  customerDataMock,
  customerTrancsInput,
  customerTrancsSucces,
  customerGraphFetchOrders,
};
