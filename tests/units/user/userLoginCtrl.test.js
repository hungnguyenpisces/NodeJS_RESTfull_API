import { expect, assert } from 'chai';
import Sinon from 'sinon';
import { userLoginCtrl } from '../../../src/controllers/user.controller';
import * as generateAccessToken from '../../../src/helpers/generateAccessToken';

let res;

describe('userLoginCtrl', () => {
  before(() => {
    res = {
      locals: {
        user: {
          email: '17521051@gm.uit.edu.vn',
          roleNumber: 1,
        },
      },
      status: (code) => {
        return {
          json: (arg) => {
            return {
              status: code,
              data: arg.data,
            };
          },
        };
      },
    };
  });
  afterEach(() => {
    Sinon.restore();
  });
  it('Success', async () => {
    const req = {
      body: {
        email: '17521051@gm.uit.edu.vn',
        password: 'Abcd@1234',
      },
    };

    const generateAccessTokenMock = Sinon.fake.returns('accessToken');
    Sinon.replace(generateAccessToken, 'default', generateAccessTokenMock);

    const result = await userLoginCtrl(req, res);

    assert(generateAccessTokenMock.calledOnce);

    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      accessToken: 'accessToken',
    });
  });
});
