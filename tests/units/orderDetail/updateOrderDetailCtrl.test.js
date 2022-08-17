import Sinon from 'sinon';
import { expect, assert } from 'chai';
import { updateOrderDetailCtrl } from '../../../src/controllers/orderDetail.controller';
import OrderDetail from '../../../src/models/orderDetail.model';
import {
  orderDetailMock,
  orderDetailUpdate,
} from '../../mock_data/orderDetail.mock';

describe('Test updateOrderDetailCtrl', () => {
  let req;
  let res;

  before(() => {
    req = {};
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

  it('Case: updateOrderDetailCtrl successfully', async () => {
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(orderDetailMock),
    );
    const dataOrderDetail = () => ({ patchAndFetchById });

    Sinon.replace(OrderDetail, 'query', dataOrderDetail);

    req = {
      params: orderDetailUpdate.params,
      body: orderDetailUpdate.body,
    };

    const result = await updateOrderDetailCtrl(req, res);

    assert(patchAndFetchById.called);
    assert(patchAndFetchById.calledWith(req.params, req.body));
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'Success',
      data: orderDetailMock,
    });
  });

  it('Case: ERROR @OrderDetail.update: OrderDetail not found', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve(null));
    const dataOrderDetail = () => ({ patchAndFetchById });

    Sinon.replace(OrderDetail, 'query', dataOrderDetail);

    req = {
      params: orderDetailUpdate.params,
      body: orderDetailUpdate.body,
    };

    try {
      await updateOrderDetailCtrl(req, res);
    } catch (error) {
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith(req.params, req.body));
      expect(error.message).to.eql(
        'ERROR @OrderDetail.update: OrderDetail not found',
      );
    }
  });

  it('Case: ERROR @OrderDetail.update: Internal Server Error', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.reject(new Error()));
    const dataOrderDetail = () => ({ patchAndFetchById });

    Sinon.replace(OrderDetail, 'query', dataOrderDetail);

    req = {
      params: orderDetailUpdate.params,
      body: orderDetailUpdate.body,
    };

    try {
      await updateOrderDetailCtrl(req, res);
    } catch (error) {
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith(req.params, req.body));
      expect(error.message).to.eql(
        'ERROR @OrderDetail.update: Internal Server Error',
      );
    }
  });
});
