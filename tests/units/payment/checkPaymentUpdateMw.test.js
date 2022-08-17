import { expect, assert } from 'chai';
import Sinon from 'sinon';
import validateUpdate from '../../../src/middlewares/payment/updatePayment';
import Payment from '../../../src/models/payment.model';
import {
  paymentMock,
  paymentIsPaidMock,
} from '../../mock_data/payment/checkPaymentMw.mock';

let res;
let next;

describe('checkPaymentUpdateMw', () => {
  before(() => {
    res = { locals: { user: null } };
    next = Sinon.spy();
  });
  afterEach(() => {
    Sinon.restore();
  });

  it('Success', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve(paymentMock));

    const queryMock = () => {
      return {
        where: whereMock,
      };
    };

    Sinon.replace(Payment, 'query', queryMock);

    const req = {
      params: {
        orderNumber: 1234,
      },
      body: {
        paymentMethod: 'Momo',
        amount: 2000,
      },
    };

    await validateUpdate.checkPayment(req, res, next);
    assert(whereMock.calledOnce);
    expect(next.calledOnce);
  });

  it('Payment not found', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve([]));

    const queryMock = () => {
      return {
        where: whereMock,
      };
    };

    Sinon.replace(Payment, 'query', queryMock);

    const req = {
      params: {
        orderNumber: 1234,
      },
      body: {
        paymentMethod: 'Momo',
        amount: 2000,
      },
    };

    try {
      await validateUpdate.checkPayment(req, res, next);
    } catch (error) {
      expect(error.statusCode).to.eql(400);
      expect(error.message).to.eql('The customerNumber field is not required');
    }
  });

  it('Internal Server Error', async () => {
    const whereMock = Sinon.fake.returns(Promise.reject(new Error()));

    const queryMock = () => {
      return {
        where: whereMock,
      };
    };

    Sinon.replace(Payment, 'query', queryMock);

    const req = {
      params: {
        orderNumber: 1234,
      },
      body: {
        paymentMethod: 'Momo',
        amount: 2000,
      },
    };

    try {
      await validateUpdate.checkPayment(req, res, next);
    } catch (error) {
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.eql(
        'ERROR @Payment.getOne: Internal Server Error',
      );
    }
  });

  it('This order has already been paid', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve(paymentIsPaidMock));

    const queryMock = () => {
      return {
        where: whereMock,
      };
    };

    Sinon.replace(Payment, 'query', queryMock);

    const req = {
      params: {
        orderNumber: 1234,
      },
      body: {
        paymentMethod: 'Momo',
        amount: 2000,
      },
    };

    try {
      await validateUpdate.checkPayment(req, res, next);
    } catch (error) {
      expect(error.statusCode).to.eql(400);
      expect(error.message).to.eql('This order has already been paid');
    }
  });
});
