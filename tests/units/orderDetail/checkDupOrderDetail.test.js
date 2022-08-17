import { expect, assert } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import OrderDetail from '../../../src/models/orderDetail.model';
import { checkDupOrderDetail } from '../../../src/middlewares/order/validateOderDetail';
import { orderDetailMock } from '../../mock_data/orderDetail.mock';

let res;
describe('Test function checkDupOrderDetail', () => {
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

  it('Case: OrderDetail is already exist', async () => {
    const findById = Sinon.fake.returns(Promise.resolve(orderDetailMock));
    const mockQuery = () => ({
      findById,
    });

    Sinon.replace(OrderDetail, 'query', mockQuery);

    const next = Sinon.spy();
    const req = {
      body: {
        orderNumber: 21,
        productCode: 'S18_01',
      },
    };

    try {
      await checkDupOrderDetail(req, res, next);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      assert(findById.called);
      assert(findById.calledWith(req.body.orderNumber));
      expect(error.message).to.equal('OrderDetail is already exist');
    }
  });

  it('Case: OrderDetail is not exist, next() called', async () => {
    const findById = Sinon.fake.returns(Promise.resolve(null));
    const mockQuery = () => ({
      findById,
    });

    Sinon.replace(OrderDetail, 'query', mockQuery);

    const next = Sinon.spy();
    const req = {
      body: {
        orderNumber: 90,
        productCode: 'S18_01',
      },
    };

    await checkDupOrderDetail(req, res, next);
    assert(findById.called);
    assert(findById.calledWith(req.body.orderNumber));
    assert(next.calledOnce);
  });

  it('Case: ERROR @OrderDetail.checkDupOrderDetail: Internal Server Error', async () => {
    const findById = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({
      findById,
    });

    Sinon.replace(OrderDetail, 'query', mockQuery);

    const next = Sinon.spy();
    const req = {
      body: {
        orderNumber: 21,
        productCode: 'S18_01',
      },
    };

    try {
      await checkDupOrderDetail(req, res, next);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      assert(findById.called);
      assert(findById.calledWith(req.body.orderNumber));
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @OrderDetail.checkDupOrderDetail: Internal Server Error',
      );
    }
  });
});
