import { expect, assert } from 'chai';
import Sinon from 'sinon';
import { momoPaymentReturnCtrl } from '../../../src/controllers/payment.controller';
import Payment from '../../../src/models/payment.model';

let res;

describe('momoPaymentReturnCtrl', () => {
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
    const whereUpdateMock = Sinon.fake.returns(Promise.resolve(1));
    const queryPaymentMock = () => {
      return {
        patch: () => {
          return {
            where: whereUpdateMock,
          };
        },
      };
    };
    Sinon.replace(Payment, 'query', queryPaymentMock);

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

    const result = await momoPaymentReturnCtrl(req, res);

    assert(whereUpdateMock.calledOnce);

    expect(result.status).to.equal(301);
    expect(result.link).to.eql('https://www.google.com.vn/');
  });

  it('Update payment failed', async () => {
    const whereUpdateMock = Sinon.fake.returns(Promise.resolve(0));
    const queryPaymentMock = () => {
      return {
        patch: () => {
          return {
            where: whereUpdateMock,
          };
        },
      };
    };
    Sinon.replace(Payment, 'query', queryPaymentMock);

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

    const result = await momoPaymentReturnCtrl(req, res);

    assert(whereUpdateMock.calledOnce);

    expect(result.status).to.equal(301);
    expect(result.link).to.eql('https://www.facebook.com/');
  });

  it('Internal Server Error', async () => {
    const whereUpdateMock = Sinon.fake.returns(Promise.reject(new Error()));
    const queryPaymentMock = () => {
      return {
        patch: () => {
          return {
            where: whereUpdateMock,
          };
        },
      };
    };
    Sinon.replace(Payment, 'query', queryPaymentMock);

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

    const result = await momoPaymentReturnCtrl(req, res);

    assert(whereUpdateMock.calledOnce);

    expect(result.status).to.equal(301);
    expect(result.link).to.eql('https://www.facebook.com/');
  });
});
