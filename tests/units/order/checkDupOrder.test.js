import { expect, assert } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import Order from '../../../src/models/order.model';
import { checkDupOrder } from '../../../src/middlewares/order/validateOrder';
import { ordersMock } from '../../mock_data/order.mock';

let res;
describe('Test function checkDupOrder', () => {
  before(() => {
    res = {
      status: (code) => {
        return {
          json: (data) => {
            return {
              status: code,
              data,
            };
          },
        };
      },
    };
  });
  afterEach(() => {
    Sinon.restore();
  });
  it('Case: Order is already exist', async () => {
    const findById = Sinon.fake.returns(Promise.resolve(ordersMock));
    const mockQuery = () => ({
      findById,
    });
    Sinon.replace(Order, 'query', mockQuery);

    const next = Sinon.spy();
    const req = {
      body: {
        orderNumber: 1,
      },
    };
    try {
      await checkDupOrder(req, res, next);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      assert(findById.called);
      assert(findById.calledWith(req.body.orderNumber));
      expect(error.message).to.equal('Order is already exist');
    }
  });
  it('Case: orderNumber is not exist, next() called', async () => {
    const findById = Sinon.fake.returns(Promise.resolve(null));
    const mockQuery = () => ({
      findById,
    });
    Sinon.replace(Order, 'query', mockQuery);

    const next = Sinon.spy();
    const req = {
      body: {
        orderNumber: 111,
      },
    };
    await checkDupOrder(req, res, next);
    assert(findById.called);
    assert(findById.calledWith(req.body.orderNumber));
    assert(next.calledOnce);
  });
  it('Case: ERROR @Order.checkDupOrder: Internal Server Error', async () => {
    const findById = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({
      findById,
    });
    Sinon.replace(Order, 'query', mockQuery);

    const next = Sinon.spy();
    const req = {
      body: {
        orderNumber: 1,
      },
    };
    try {
      await checkDupOrder(req, res, next);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      assert(findById.called);
      assert(findById.calledWith(req.body.orderNumber));
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Order.checkDupOrder: Internal Server Error',
      );
    }
  });
});
