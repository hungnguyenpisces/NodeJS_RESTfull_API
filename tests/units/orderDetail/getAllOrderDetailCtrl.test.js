import Sinon from 'sinon';
import { expect, assert } from 'chai';
import { getAllOrderDetailCtrl } from '../../../src/controllers/orderDetail.controller';
import OrderDetail from '../../../src/models/orderDetail.model';
import { orderDetailMock } from '../../mock_data/orderDetail.mock';

describe('Test get all orderdetails', async () => {
  let req = {
    query: {},
  };
  let res;

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

  afterEach(() => Sinon.restore());

  it('Case: No query search, getAllOrderDetailCtrl successfully', async () => {
    const where = Sinon.fake.returns(Promise.resolve([orderDetailMock]));
    const mockData = () => ({ where });

    Sinon.replace(OrderDetail, 'query', mockData);

    const result = await getAllOrderDetailCtrl(req, res);

    assert(where.called);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      total: 1,
      data: [orderDetailMock],
    });
  });

  it('Case: No query search, No OrderDetails found', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const mockData = () => ({ where });

    Sinon.replace(OrderDetail, 'query', mockData);

    try {
      await getAllOrderDetailCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.message).to.eql(
        'ERROR @OrderDetail.get: No OrderDetails found',
      );
    }
  });

  it('Case: No query search, Internal Server Error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const mockData = () => ({ where });

    Sinon.replace(OrderDetail, 'query', mockData);

    try {
      await getAllOrderDetailCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.message).to.eql(
        'ERROR @OrderDetail.get: Internal Server Error',
      );
    }
  });

  it('Case: Query search, getAllOrderDetailCtrl successfully', async () => {
    const where = Sinon.fake.returns(Promise.resolve([orderDetailMock]));
    const dataOrderDetail = () => ({ where });

    Sinon.replace(OrderDetail, 'query', dataOrderDetail);

    req = {
      query: {
        productCode: 'S18_01',
        quantityOrdered: 4259,
      },
    };

    const result = await getAllOrderDetailCtrl(req, res);

    assert(where.called);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      total: 1,
      data: [orderDetailMock],
    });
  });

  it('Case: Query search, No orderdetail found', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const dataOrderDetail = () => ({ where });

    Sinon.replace(OrderDetail, 'query', dataOrderDetail);

    req = {
      query: { status: 'zzz' },
    };

    try {
      await getAllOrderDetailCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.message).to.eql(
        'ERROR @OrderDetail.get: No OrderDetails found',
      );
    }
  });

  it('Case: Query search, Internal Server Error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const dataOrderDetail = () => ({ where });

    Sinon.replace(OrderDetail, 'query', dataOrderDetail);

    req = {
      query: { status: 'Shipped' },
    };

    try {
      await getAllOrderDetailCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.message).to.eql(
        'ERROR @OrderDetail.get: Internal Server Error',
      );
    }
  });
});
