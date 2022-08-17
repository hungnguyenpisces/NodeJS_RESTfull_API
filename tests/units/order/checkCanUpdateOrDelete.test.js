import { expect } from 'chai';
import Sinon from 'sinon';
import Order from '../../../src/models/order.model';
import Payment from '../../../src/models/payment.model';
import {
  paymentMock,
  paymentIsPaidMock,
} from '../../mock_data/payment/checkPaymentMw.mock';
import { checkCanUpdateOrDelete } from '../../../src/middlewares/order/validateOrder';

let req;
let res;
let next;

describe('checkOrderUpdateMw', () => {
  before(() => {
    req = {};
    res = {};
    next = Sinon.spy();
  });

  afterEach(() => {
    Sinon.restore();
  });

  it('Success', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve({ status: 'Resolved' }),
    );
    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };
    const whereMock = Sinon.fake.returns(Promise.resolve(paymentMock));
    const queryMock = () => {
      return {
        where: whereMock,
      };
    };

    Sinon.replace(Payment, 'query', queryMock);
    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 1,
      },
    };

    await checkCanUpdateOrDelete(req, res, next);
    expect(next.calledOnce);
  });

  it('This order cannot be updated', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve([{ status: 'Shipped' }]),
    );
    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };
    const whereMock = Sinon.fake.returns(Promise.resolve(paymentMock));
    const queryMock = () => {
      return {
        where: whereMock,
      };
    };

    Sinon.replace(Payment, 'query', queryMock);
    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 1,
      },
    };

    try {
      await checkCanUpdateOrDelete(req, res, next);
    } catch (error) {
      expect(error.message).to.eql('This order cannot be updated');
    }
  });

  it('This order has already been paid', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve({ status: 'Resolved' }),
    );
    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };
    const whereMock = Sinon.fake.returns(Promise.resolve(paymentIsPaidMock));
    const queryMock = () => {
      return {
        where: whereMock,
      };
    };

    Sinon.replace(Payment, 'query', queryMock);
    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 1,
      },
    };

    try {
      await checkCanUpdateOrDelete(req, res, next);
    } catch (error) {
      expect(error.message).to.eql('This order has already been paid');
    }
  });

  it('ERROR @Order.getOne: Something went wrong', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.reject(new Error()),
    );
    const dataOrder = () => {
      return {
        where: () => {
          return {
            withGraphFetched: withGraphFetchedFake,
          };
        },
      };
    };

    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 1,
      },
    };
    try {
      await checkCanUpdateOrDelete(req, res, next);
    } catch (error) {
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.eql('ERROR @Order.getOne: Something went wrong');
    }
  });
});
