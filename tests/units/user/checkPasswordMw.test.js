import { expect, assert } from 'chai';
import Sinon from 'sinon';
import User from '../../../src/models/user.model';
import {
  userCustomerMock,
  userCustomerNotVerifiedMock,
  userCustomerNotActiveMock,
  userEmployeeMock,
  userEmployeeNotActiveMock,
} from '../../mock_data/user/checkPasswordMw.mock';
import validateLogin from '../../../src/middlewares/user/validateLogin';

let res;
let next;

describe('checkPasswordMiddleware', () => {
  before(() => {
    res = { locals: { user: null } };
    next = Sinon.spy();
  });
  afterEach(() => {
    Sinon.restore();
  });

  // Customer
  it('Success (Customer login)', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(userCustomerMock),
    );

    const queryMock = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17521051@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
      originalUrl: '/api/users/customer/login',
    };
    await validateLogin.checkPassword(req, res, next);
    assert(withGraphFetchedFake.calledOnce);
    expect(next.calledOnce);
  });

  it('Email is incorrect (Customer login)', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(Promise.resolve([]));

    const queryMock = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17520000@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
      originalUrl: '/api/users/customer/login',
    };
    try {
      await validateLogin.checkPassword(req, res, next);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.statusCode).to.eql(401);
      expect(error.message).to.eql('Email or password is incorrect');
    }
  });

  it('Unverified account.', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(userCustomerNotVerifiedMock),
    );

    const queryMock = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17520000@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
      originalUrl: '/api/users/customer/login',
    };
    try {
      await validateLogin.checkPassword(req, res, next);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.statusCode).to.eql(401);
      expect(error.message).to.eql('Unverified account.');
    }
  });

  it('The account is currently inactive (Customer login).', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(userCustomerNotActiveMock),
    );

    const queryMock = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17520000@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
      originalUrl: '/api/users/customer/login',
    };
    try {
      await validateLogin.checkPassword(req, res, next);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.statusCode).to.eql(401);
      expect(error.message).to.eql('The account is currently inactive');
    }
  });

  it('Password is incorrect (Customer login)', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(userCustomerMock),
    );

    const queryMock = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17520873@gm.uit.edu.vn',
        password: 'password',
      },
      originalUrl: '/api/users/customer/login',
    };
    try {
      await validateLogin.checkPassword(req, res, next);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.statusCode).to.eql(401);
      expect(error.message).to.eql('Email or password is incorrect');
    }
  });

  it('Internal Server Error (Customer login)', async () => {
    const withGraphFetchedFake = Sinon.fake.throws(new Error());

    const queryMock = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17520873@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
      originalUrl: '/api/users/customer/login',
    };
    try {
      await validateLogin.checkPassword(req, res, next);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.eql(
        'ERROR @User.getOneRelatedToCustomer: Internal Server Error',
      );
    }
  });

  // Employee
  it('Success (Employee login)', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(userEmployeeMock),
    );

    const queryMock = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17521051@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
      originalUrl: '/api/users/employee/login',
    };
    await validateLogin.checkPassword(req, res, next);
    assert(withGraphFetchedFake.calledOnce);
    expect(next.calledOnce);
  });

  it('Email is incorrect (Employee login)', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(Promise.resolve([]));

    const queryMock = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17520000@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
      originalUrl: '/api/users/employee/login',
    };
    try {
      await validateLogin.checkPassword(req, res, next);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.statusCode).to.eql(401);
      expect(error.message).to.eql('Email or password is incorrect');
    }
  });

  it('Password is incorrect (Employee login)', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(userEmployeeMock),
    );

    const queryMock = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17520873@gm.uit.edu.vn',
        password: 'password',
      },
      originalUrl: '/api/users/employee/login',
    };
    try {
      await validateLogin.checkPassword(req, res, next);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.statusCode).to.eql(401);
      expect(error.message).to.eql('Email or password is incorrect');
    }
  });

  it('The account is currently inactive (Employee login).', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(userEmployeeNotActiveMock),
    );

    const queryMock = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17520000@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
      originalUrl: '/api/users/employee/login',
    };
    try {
      await validateLogin.checkPassword(req, res, next);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.statusCode).to.eql(401);
      expect(error.message).to.eql('The account is currently inactive');
    }
  });

  it('Internal Server Error (Employee login)', async () => {
    const withGraphFetchedFake = Sinon.fake.throws(new Error());

    const queryMock = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17520873@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
      originalUrl: '/api/users/employee/login',
    };
    try {
      await validateLogin.checkPassword(req, res, next);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.eql(
        'ERROR @User.getOneRelatedToEmployee: Internal Server Error',
      );
    }
  });
});
