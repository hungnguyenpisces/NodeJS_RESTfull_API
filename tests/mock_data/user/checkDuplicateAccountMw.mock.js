import hashPassword from '../../../src/helpers/hashPassword';

const userMock = [
  {
    email: '17521051@gm.uit.edu.vn',
    password: hashPassword('Abcd@1234'),
    userNumber: 1,
    isVerified: 1,
    verifyToken: 'verifyToken',
  },
];

export default userMock;
