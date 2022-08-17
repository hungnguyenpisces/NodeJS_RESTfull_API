import Sinon from 'sinon';
import { expect, assert } from 'chai';
import { softDeleteOrderCtrl } from '../../../src/controllers/order.controller';
import Order from '../../../src/models/order.model';
import { customerDataMock } from '../../mock_data/customer.mock';

describe('Test softDeleteOrderCtrl', () => {
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

  it('Case: softDeleteOrderCtrl successfully', async () => {
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(customerDataMock),
    );
    const dataOrder = () => ({ patchAndFetchById });

    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 1,
      },
    };

    const result = await softDeleteOrderCtrl(req, res);

    assert(patchAndFetchById.called);
    assert(patchAndFetchById.calledWith(1));
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({ message: 'Cancelled' });
  });

  it('Case: Order not found', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve({}));
    const dataOrder = () => ({ patchAndFetchById });

    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        customerNumber: 999,
      },
      body: {
        customerName: 'Atelier fixed',
        contactLastName: 'Schmitt',
        contactFirstName: 'Carine',
      },
    };

    const result = await softDeleteOrderCtrl(req, res);

    assert(patchAndFetchById.called);
    expect(result.data).to.eql({
      message: 'Order not found',
    });
  });

  it('Case: Internal Server Error', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.reject(new Error()));
    const dataOrder = () => ({ patchAndFetchById });

    Sinon.replace(Order, 'query', dataOrder);

    req = {
      params: {
        orderNumber: 1,
      },
    };

    try {
      await softDeleteOrderCtrl(req, res);
    } catch (error) {
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith(1));
      expect(error.message).to.eql(
        'ERROR @Order.update: Internal Server Error',
      );
    }
  });
});
