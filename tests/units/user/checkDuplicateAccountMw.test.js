import { expect, assert } from 'chai';
import Sinon from 'sinon';
import User from '../../../src/models/user.model';
import validateRegister from '../../../src/middlewares/user/validateRegister';
import userMock from '../../mock_data/user/checkDuplicateAccountMw.mock';

let res;
let next;

describe('checkDuplicateAccountMiddleware', () => {
  before(() => {
    res = { locals: { user: null } };
    next = Sinon.spy();
  });
  afterEach(() => {
    Sinon.restore();
  });

  it('Success', async () => {
    const whereFake = Sinon.fake.returns(Promise.resolve([]));

    const queryMock = () => {
      return {
        where: whereFake,
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17521051@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
    };
    await validateRegister.checkDuplicateAccount(req, res, next);
    assert(whereFake.calledOnce);
    expect(next.calledOnce);
  });

  it('Email is already in use', async () => {
    const whereFake = Sinon.fake.returns(Promise.resolve(userMock));

    const queryMock = () => {
      return {
        where: whereFake,
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17521051@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
    };

    try {
      await validateRegister.checkDuplicateAccount(req, res, next);
    } catch (error) {
      assert(whereFake.calledOnce);
      expect(error.statusCode).to.eql(400);
      expect(error.message).to.eql('Email is already in use.');
    }
  });

  it('Internal Server Error', async () => {
    const whereFake = Sinon.fake.throws(new Error());

    const queryMock = () => {
      return {
        where: whereFake,
      };
    };

    Sinon.replace(User, 'query', queryMock);

    const req = {
      body: {
        email: '17521051@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
    };

    try {
      await validateRegister.checkDuplicateAccount(req, res, next);
    } catch (error) {
      assert(whereFake.calledOnce);
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.eql('ERROR @User.get: Internal Server Error');
    }
  });
});
