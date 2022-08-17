import { expect } from 'chai';
import Sinon from 'sinon';
import jwt from 'jsonwebtoken';
import auth from '../../../src/middlewares/user/auth';
import {
  payloadMock,
  payloadWithoutRoleNumberMock,
} from '../../mock_data/user/authMw.mock';

let res;
let next;

describe('authMiddleware', () => {
  before(() => {
    res = { locals: { user: null } };
    next = Sinon.spy();
  });
  afterEach(() => {
    Sinon.restore();
  });

  it('Success', async () => {
    const verifyMock = Sinon.fake.returns(payloadMock);
    Sinon.replace(jwt, 'verify', verifyMock);
    const req = {
      headers: {
        authorization: 'Bearer accessToken',
      },
    };
    const middleware = auth([1, 2, 3]);
    middleware(req, res, next);
    expect(next.calledOnce);
  });

  it('req.headers.authorization is not exist', async () => {
    const verifyMock = Sinon.fake.returns(payloadMock);
    Sinon.replace(jwt, 'verify', verifyMock);
    const req = {
      headers: {
        // authorization: 'Bearer accessToken',
      },
    };

    try {
      const middleware = auth([1, 2, 3]);
      middleware(req, res, next);
    } catch (error) {
      expect(error.statusCode).to.eql(401);
      expect(error.message).to.eql('Unauthorized.');
    }
  });

  it('payload without roleNumber', async () => {
    const verifyMock = Sinon.fake.returns(payloadWithoutRoleNumberMock);
    Sinon.replace(jwt, 'verify', verifyMock);
    const req = {
      headers: {
        authorization: 'Bearer accessToken',
      },
    };

    try {
      const middleware = auth([1, 2, 3]);
      middleware(req, res, next);
    } catch (error) {
      expect(error.statusCode).to.eql(401);
      expect(error.message).to.eql('Unauthorized.');
    }
  });

  it('Forbidden', async () => {
    const verifyMock = Sinon.fake.returns(payloadMock);
    Sinon.replace(jwt, 'verify', verifyMock);
    const req = {
      headers: {
        authorization: 'Bearer accessToken',
      },
    };

    try {
      const middleware = auth([1, 2]);
      middleware(req, res, next);
    } catch (error) {
      expect(error.statusCode).to.eql(403);
      expect(error.message).to.eql('Forbidden.');
    }
  });
});
