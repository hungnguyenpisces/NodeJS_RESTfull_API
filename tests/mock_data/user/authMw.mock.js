const payloadMock = {
  email: '17521051@gm.uit.edu.vn',
  roleNumber: 3,
  iat: 1640235452,
  exp: 1640494652,
};

const payloadWithoutRoleNumberMock = {
  email: '17521051@gm.uit.edu.vn',
  iat: 1640235452,
  exp: 1640494652,
};

export { payloadMock, payloadWithoutRoleNumberMock };
