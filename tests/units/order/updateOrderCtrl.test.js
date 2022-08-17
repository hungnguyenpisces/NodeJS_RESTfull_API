import Sinon from 'sinon';
import { expect, assert } from 'chai';
import { updateOrderCtrl } from '../../../src/controllers/order.controller';
import Order from '../../../src/models/order.model';
import { ordersMock } from '../../mock_data/order.mock';

describe('Test updateOrderCtrl', () => {
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

  it('Case: updateOrderCtrl successfully', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve(ordersMock));
    const dataOrder = () => ({ patchAndFetchById });

    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 1,
      },
      body: {
        status: 'Shipped',
        comments: null,
      },
    };

    const result = await updateOrderCtrl(req, res);

    assert(patchAndFetchById.called);
    assert(patchAndFetchById.calledWith(1, req.body));
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'Success',
      data: ordersMock,
    });
  });

  it('Case: ERROR @Order.update: Order not found', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve(null));
    const dataOrder = () => ({ patchAndFetchById });

    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 999,
      },
      body: {
        status: 'Shipped',
        comments: null,
      },
    };

    try {
      await updateOrderCtrl(req, res);
    } catch (error) {
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith(999, req.body));
      expect(error.message).to.eql('ERROR @Order.update: Order not found');
    }
  });

  it('Case: ERROR @Order.update: Internal Server Error', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.reject(new Error()));
    const dataOrder = () => ({ patchAndFetchById });

    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 11,
      },
      body: {
        status: 'Shipped',
        comments: null,
      },
    };

    try {
      await updateOrderCtrl(req, res);
    } catch (error) {
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith(11, req.body));
      expect(error.message).to.eql(
        'ERROR @Order.update: Internal Server Error',
      );
    }
  });
});
