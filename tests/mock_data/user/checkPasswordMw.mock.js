import hashPassword from '../../../src/helpers/hashPassword';

const userCustomerMock = [
  {
    email: '17521051@gm.uit.edu.vn',
    password: hashPassword('Abcd@1234'),
    userNumber: 1,
    isVerified: 1,
    verifyToken: '',
    customer: {
      customerNumber: 1,
      customerName: 'ThanhND76',
      contactLastName: 'Nguyen',
      contactFirstName: 'Dang Thanh',
      phone: '0123456789',
      addressLine1: 'Address Line 1',
      addressLine2: null,
      city: 'Hanoi',
      state: null,
      postalCode: '100000',
      country: 'Vietnam',
      salesRepEmployeeNumber: null,
      creditLimit: '123.00',
      userNumber: 1,
      roleNumber: 4,
      isActive: 1,
    },
  },
];

const userCustomerNotVerifiedMock = [
  {
    email: '17521051@gm.uit.edu.vn',
    password: hashPassword('Abcd@1234'),
    userNumber: 1,
    isVerified: 0,
    verifyToken: '',
    customer: {
      customerNumber: 1,
      customerName: 'ThanhND76',
      contactLastName: 'Nguyen',
      contactFirstName: 'Dang Thanh',
      phone: '0123456789',
      addressLine1: 'Address Line 1',
      addressLine2: null,
      city: 'Hanoi',
      state: null,
      postalCode: '100000',
      country: 'Vietnam',
      salesRepEmployeeNumber: null,
      creditLimit: '123.00',
      userNumber: 1,
      roleNumber: 4,
      isActive: 1,
    },
  },
];

const userCustomerNotActiveMock = [
  {
    email: '17521051@gm.uit.edu.vn',
    password: hashPassword('Abcd@1234'),
    userNumber: 1,
    isVerified: 1,
    verifyToken: '',
    customer: {
      customerNumber: 1,
      customerName: 'ThanhND76',
      contactLastName: 'Nguyen',
      contactFirstName: 'Dang Thanh',
      phone: '0123456789',
      addressLine1: 'Address Line 1',
      addressLine2: null,
      city: 'Hanoi',
      state: null,
      postalCode: '100000',
      country: 'Vietnam',
      salesRepEmployeeNumber: null,
      creditLimit: '123.00',
      userNumber: 1,
      roleNumber: 4,
      isActive: 0,
    },
  },
];

const userEmployeeMock = [
  {
    email: '17521051@gm.uit.edu.vn',
    password: hashPassword('Abcd@1234'),
    userNumber: 1,
    isVerified: 1,
    verifyToken: '',
    employee: {
      employeeNumber: 1,
      lastName: 'Nguyen',
      firstName: 'Dang Thanh',
      extension: 'Abcd',
      officeCode: '1',
      reportsTo: null,
      jobTitle: 'President',
      userNumber: 1,
      roleNumber: 1,
      isActive: 1,
    },
  },
];

const userEmployeeNotActiveMock = [
  {
    email: '17521051@gm.uit.edu.vn',
    password: hashPassword('Abcd@1234'),
    userNumber: 1,
    isVerified: 1,
    verifyToken: '',
    employee: {
      employeeNumber: 1,
      lastName: 'Nguyen',
      firstName: 'Dang Thanh',
      extension: 'Abcd',
      officeCode: '1',
      reportsTo: null,
      jobTitle: 'President',
      userNumber: 1,
      roleNumber: 1,
      isActive: 0,
    },
  },
];

export {
  userCustomerMock,
  userCustomerNotVerifiedMock,
  userCustomerNotActiveMock,
  userEmployeeMock,
  userEmployeeNotActiveMock,
};
