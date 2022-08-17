import { expect, assert } from 'chai';
import Sinon from 'sinon';
import { userVerifyCtrl } from '../../../src/controllers/user.controller';
import User from '../../../src/models/user.model';

let res;

describe('userVerifyCtrl', () => {
  before(() => {
    res = {
      redirect: (status, link) => {
        return {
          status,
          link,
        };
      },
    };
  });
  afterEach(() => {
    Sinon.restore();
  });
  it('Success', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve(1));
    const queryUserMock = () => {
      return {
        patch: () => {
          return {
            where: whereMock,
          };
        },
      };
    };
    Sinon.replace(User, 'query', queryUserMock);

    const req = {
      params: { verifyToken: 'verifyToken' },
    };

    const result = await userVerifyCtrl(req, res);

    assert(whereMock.calledOnce);

    expect(result.status).to.equal(301);
    expect(result.link).to.eql('https://www.google.com.vn/');
  });

  it('Update user fail', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve(0));
    const queryUserMock = () => {
      return {
        patch: () => {
          return {
            where: whereMock,
          };
        },
      };
    };
    Sinon.replace(User, 'query', queryUserMock);

    const req = {
      params: { verifyToken: 'verifyToken' },
    };

    const result = await userVerifyCtrl(req, res);

    assert(whereMock.calledOnce);

    expect(result.status).to.equal(301);
    expect(result.link).to.eql('https://www.facebook.com/');
  });

  it('Internal Server Error', async () => {
    const whereMock = Sinon.fake.throws(new Error());
    const queryUserMock = () => {
      return {
        patch: () => {
          return {
            where: whereMock,
          };
        },
      };
    };
    Sinon.replace(User, 'query', queryUserMock);

    const req = {
      params: { verifyToken: 'verifyToken' },
    };

    const result = await userVerifyCtrl(req, res);

    assert(whereMock.calledOnce);

    expect(result.status).to.equal(301);
    expect(result.link).to.eql('https://www.facebook.com/');
  });
});
