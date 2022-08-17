import hashPassword from '../../../src/helpers/hashPassword';

const userMock = {
  email: '17521051@gm.uit.edu.vn',
  password: hashPassword('Abcd@1234'),
  verifyToken: 'verifyToken',
  userNumber: 1,
};

const customerMock = {
  userNumber: 1,
  customerName: 'ThanhND76',
  contactLastName: 'Nguyen',
  contactFirstName: 'Dang Thanh',
  phone: '0123456789',
  addressLine1: 'Address Line 1',
  city: 'Hanoi',
  postalCode: '100000',
  country: 'Vietnam',
  creditLimit: 123,
  customerNumber: 1,
};

export { userMock, customerMock };
