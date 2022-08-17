import { expect, assert } from 'chai';
import Sinon from 'sinon';
import { updatePaymentCtrl } from '../../../src/controllers/payment.controller';
import Payment from '../../../src/models/payment.model';
import * as payWithMomo from '../../../src/services/payWithMomo';
import resultMomoMock from '../../mock_data/payment/updatePaymentCtrl.mock';

let res;

describe('updatePaymentCtrl', () => {
  before(() => {
    res = {
      status: (code) => {
        return {
          json: (arg) => {
            return {
              status: code,
              message: arg.message,
            };
          },
        };
      },
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

  it('Payment method: Cash (Success)', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve(1));
    const queryPaymentMock = () => {
      return {
        patch: () => {
          return {
            where: whereMock,
          };
        },
      };
    };
    Sinon.replace(Payment, 'query', queryPaymentMock);

    const req = {
      params: 1234,
      body: {
        paymentMethod: 'Cash',
        amount: 2000,
      },
    };

    const result = await updatePaymentCtrl(req, res);

    assert(whereMock.calledOnce);

    expect(result.status).to.equal(200);
    expect(result.message).to.eql('Payment updated successfully');
  });

  it('Payment method: COD (Success)', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve(1));
    const queryPaymentMock = () => {
      return {
        patch: () => {
          return {
            where: whereMock,
          };
        },
      };
    };
    Sinon.replace(Payment, 'query', queryPaymentMock);

    const req = {
      params: 1234,
      body: {
        paymentMethod: 'COD',
        amount: 2000,
      },
    };

    const result = await updatePaymentCtrl(req, res);

    assert(whereMock.calledOnce);

    expect(result.status).to.equal(200);
    expect(result.message).to.eql('Payment updated successfully');
  });

  it('Payment method: Momo (Success)', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve(1));
    const queryPaymentMock = () => {
      return {
        patch: () => {
          return {
            where: whereMock,
          };
        },
      };
    };
    Sinon.replace(Payment, 'query', queryPaymentMock);

    const payWithMomoMock = Sinon.fake.returns(resultMomoMock);
    Sinon.replace(payWithMomo, 'default', payWithMomoMock);

    const req = {
      params: 1234,
      body: {
        paymentMethod: 'Momo',
        amount: 2000,
      },
    };

    const result = await updatePaymentCtrl(req, res);

    assert(whereMock.calledOnce);
    assert(payWithMomoMock.calledOnce);

    expect(result.status).to.equal(301);
    expect(result.link).to.eql('https://test-payment.momo.vn/v2/gateway/pay');
  });

  it('Something went wrong while paying with Momo', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve(1));
    const queryPaymentMock = () => {
      return {
        patch: () => {
          return {
            where: whereMock,
          };
        },
      };
    };
    Sinon.replace(Payment, 'query', queryPaymentMock);

    const payWithMomoMock = Sinon.fake.throws(new Error());
    Sinon.replace(payWithMomo, 'default', payWithMomoMock);

    const req = {
      params: 1234,
      body: {
        paymentMethod: 'Momo',
        amount: 2000,
      },
    };

    try {
      await updatePaymentCtrl(req, res);
    } catch (error) {
      assert(whereMock.calledOnce);

      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql(
        'ERROR @updatePaymentCtrl: Something went wrong while paying with Momo',
      );
    }
  });

  it('Update payment failed', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve(0));
    const queryPaymentMock = () => {
      return {
        patch: () => {
          return {
            where: whereMock,
          };
        },
      };
    };
    Sinon.replace(Payment, 'query', queryPaymentMock);

    const req = {
      params: 1234,
      body: {
        paymentMethod: 'COD',
        amount: 2000,
      },
    };

    try {
      await updatePaymentCtrl(req, res);
    } catch (error) {
      assert(whereMock.calledOnce);

      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql('Update payment failed');
    }
  });

  it('Internal Server Error', async () => {
    const whereMock = Sinon.fake.returns(Promise.reject(new Error()));
    const queryPaymentMock = () => {
      return {
        patch: () => {
          return {
            where: whereMock,
          };
        },
      };
    };
    Sinon.replace(Payment, 'query', queryPaymentMock);

    const req = {
      params: 1234,
      body: {
        paymentMethod: 'COD',
        amount: 2000,
      },
    };

    try {
      await updatePaymentCtrl(req, res);
    } catch (error) {
      assert(whereMock.calledOnce);

      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql(
        'ERROR @Payment.update: Internal Server Error',
      );
    }
  });
});
