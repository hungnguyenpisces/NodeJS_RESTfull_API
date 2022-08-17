import { expect, assert } from 'chai';
import Sinon from 'sinon';
import validateUpdate from '../../../src/middlewares/payment/updatePayment';
import Order from '../../../src/models/order.model';
import { ordersMock } from '../../mock_data/order.mock';

let next;

describe('checkUserUpdateMw', () => {
  before(() => {
    next = Sinon.spy();
  });
  afterEach(() => {
    Sinon.restore();
  });

  it('Customer: Success', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(ordersMock),
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

    const req = {
      params: {
        orderNumber: 1,
      },
      body: {
        paymentMethod: 'Momo',
      },
    };

    const res = { locals: { user: { roleNumber: 4, customerNumber: 1 } } };

    await validateUpdate.checkUser(req, res, next);
    assert(withGraphFetchedFake.calledOnce);
    expect(next.calledOnce);
  });

  it('Employee: Success', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(ordersMock),
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

    const req = {
      params: {
        orderNumber: 1,
      },
      body: {
        paymentMethod: 'COD',
        paymentDate: '2021-12-12',
        isPaid: 1,
      },
    };

    const res = { locals: { user: { roleNumber: 1 } } };

    await validateUpdate.checkUser(req, res, next);
    assert(withGraphFetchedFake.calledOnce);
    expect(next.calledOnce);
  });

  it('Customer: You can only change the paymentMethod', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(
      Promise.resolve(ordersMock),
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

    const req = {
      params: {
        orderNumber: 1,
      },
      body: {
        isPaid: 1,
      },
    };

    const res = { locals: { user: { roleNumber: 4, customerNumber: 1 } } };

    try {
      await validateUpdate.checkUser(req, res, next);
    } catch (error) {
      expect(error.statusCode).to.eql(403);
      expect(error.message).to.eql('You can only change the paymentMethod');
    }
  });

  it('Customer: You have no orders with orderNumber', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(Promise.resolve([]));

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

    const req = {
      params: {
        orderNumber: 2,
      },
      body: {
        paymentMethod: 'COD',
      },
    };

    const res = { locals: { user: { roleNumber: 4, customerNumber: 1 } } };

    try {
      await validateUpdate.checkUser(req, res, next);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.statusCode).to.eql(400);
      expect(error.message).to.eql(
        `You have no orders with orderNumber ${req.params.orderNumber}`,
      );
    }
  });

  it('Employee: orderNumber is incorrect', async () => {
    const withGraphFetchedFake = Sinon.fake.returns(Promise.resolve([]));

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

    const req = {
      params: {
        orderNumber: 2,
      },
      body: {
        paymentMethod: 'COD',
        paymentDate: '2021-12-12',
        isPaid: 1,
      },
    };

    const res = { locals: { user: { roleNumber: 1 } } };

    try {
      await validateUpdate.checkUser(req, res, next);
    } catch (error) {
      assert(withGraphFetchedFake.calledOnce);
      expect(error.statusCode).to.eql(400);
      expect(error.message).to.eql(
        `orderNumber ${req.params.orderNumber} is incorrect`,
      );
    }
  });
});
