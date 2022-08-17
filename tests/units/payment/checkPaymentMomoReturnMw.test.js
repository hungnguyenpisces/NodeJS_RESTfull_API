import { expect, assert } from 'chai';
import Sinon from 'sinon';
import validateMomoReturn from '../../../src/middlewares/payment/momoPaymentReturn';
import Payment from '../../../src/models/payment.model';
import { paymentMock } from '../../mock_data/payment/checkPaymentMw.mock';

let res;
let next;

describe('checkPaymentMomoReturnMw', () => {
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
      query: {
        partnerCode: 'MOMOXLEE20210804',
        orderId: '1234-1640511860782',
        requestId: 'MOMOXLEE202108041640511860782',
        amount: '2000',
        orderInfo: 'Payment for order 1234',
        orderType: 'momo_wallet',
        transId: '2630299797',
        resultCode: '0',
        message: 'Successful.',
        payType: 'qr',
        responseTime: '1640511892248',
        extraData: '',
        signature: 'secureHash',
      },
    };

    await validateMomoReturn.checkPayment(req, res, next);
    assert(whereMock.calledOnce);
    expect(next.calledOnce);
  });

  it('orderNumber is incorrect', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve([]));

    const queryMock = () => {
      return {
        where: whereMock,
      };
    };

    Sinon.replace(Payment, 'query', queryMock);

    const req = {
      query: {
        partnerCode: 'MOMOXLEE20210804',
        orderId: '1235-1640511860782',
        requestId: 'MOMOXLEE202108041640511860782',
        amount: '2000',
        orderInfo: 'Payment for order 1234',
        orderType: 'momo_wallet',
        transId: '2630299797',
        resultCode: '0',
        message: 'Successful.',
        payType: 'qr',
        responseTime: '1640511892248',
        extraData: '',
        signature: 'secureHash',
      },
    };

    try {
      await validateMomoReturn.checkPayment(req, res, next);
    } catch (error) {
      assert(whereMock.calledOnce);
      expect(error.statusCode).to.eql(401);
      expect(error.message).to.eql('orderNumber is incorrect');
    }
  });

  it('Signature is incorrect', async () => {
    const whereMock = Sinon.fake.returns(Promise.resolve(paymentMock));

    const queryMock = () => {
      return {
        where: whereMock,
      };
    };

    Sinon.replace(Payment, 'query', queryMock);

    const req = {
      query: {
        partnerCode: 'MOMOXLEE20210804',
        orderId: '1234-1640511860782',
        requestId: 'MOMOXLEE202108041640511860782',
        amount: '2000',
        orderInfo: 'Payment for order 1234',
        orderType: 'momo_wallet',
        transId: '2630299797',
        resultCode: '0',
        message: 'Successful.',
        payType: 'qr',
        responseTime: '1640511892248',
        extraData: '',
        signature: 'secureHash@1234',
      },
    };

    try {
      await validateMomoReturn.checkPayment(req, res, next);
    } catch (error) {
      assert(whereMock.calledOnce);
      expect(error.statusCode).to.eql(401);
      expect(error.message).to.eql('Signature is incorrect');
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
      query: {
        partnerCode: 'MOMOXLEE20210804',
        orderId: '1234-1640511860782',
        requestId: 'MOMOXLEE202108041640511860782',
        amount: '2000',
        orderInfo: 'Payment for order 1234',
        orderType: 'momo_wallet',
        transId: '2630299797',
        resultCode: '0',
        message: 'Successful.',
        payType: 'qr',
        responseTime: '1640511892248',
        extraData: '',
        signature: 'secureHash',
      },
    };

    try {
      await validateMomoReturn.checkPayment(req, res, next);
    } catch (error) {
      assert(whereMock.calledOnce);
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.eql(
        'ERROR @Payment.getOne: Internal Server Error',
      );
    }
  });
});
