import Sinon from 'sinon';
import { expect, assert } from 'chai';
import { getCustomerWithOrderCtrl } from '../../../src/controllers/customer.controller';
import Customer from '../../../src/models/customer.model';
import { customerGraphFetchOrders } from '../../mock_data/customer.mock';

describe('Test getCustomerWithOrderCtrl', () => {
  let req;
  let res;

  beforeEach(() => {
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
      locals: {
        user: {
          roleNumber: 2,
          customerNumber: null,
        },
      },
    };
  });

  afterEach(() => Sinon.restore());

  it('Case: getCustomerWithOrderCtrl successfully by manager', async () => {
    const withGraphFetched = Sinon.fake.returns(
      Promise.resolve([customerGraphFetchOrders]),
    );
    const join = Sinon.fake.returns({ withGraphFetched });
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });

    Sinon.replace(Customer, 'query', mockQuery);

    req = {
      params: {
        customerNumber: 1,
      },
    };

    const result = await getCustomerWithOrderCtrl(req, res);

    assert(withGraphFetched.calledOnce);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({ data: customerGraphFetchOrders });
  });

  it('Case: getCustomerWithOrderCtrl successfully by admin', async () => {
    res.locals.user.roleNumber = 1;
    const withGraphFetched = Sinon.fake.returns(
      Promise.resolve([customerGraphFetchOrders]),
    );
    const join = Sinon.fake.returns({ withGraphFetched });
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });

    Sinon.replace(Customer, 'query', mockQuery);

    req = {
      params: {
        customerNumber: 1,
      },
    };

    const result = await getCustomerWithOrderCtrl(req, res);

    assert(withGraphFetched.calledOnce);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({ data: customerGraphFetchOrders });
  });

  it('Case: getCustomerWithOrderCtrl successfully by staff', async () => {
    res.locals.user.roleNumber = 3;
    const withGraphFetched = Sinon.fake.returns(
      Promise.resolve([customerGraphFetchOrders]),
    );
    const join = Sinon.fake.returns({ withGraphFetched });
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });

    Sinon.replace(Customer, 'query', mockQuery);

    req = {
      params: {
        customerNumber: 1,
      },
    };

    const result = await getCustomerWithOrderCtrl(req, res);

    assert(withGraphFetched.calledOnce);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({ data: customerGraphFetchOrders });
  });

  it('Case: Customer not found', async () => {
    const withGraphFetched = Sinon.fake.returns(Promise.resolve([]));
    const join = Sinon.fake.returns({ withGraphFetched });
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });

    Sinon.replace(Customer, 'query', mockQuery);

    req = {
      params: {
        customerNumber: 1,
      },
    };

    const result = await getCustomerWithOrderCtrl(req, res);

    assert(withGraphFetched.calledOnce);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'No customer found',
      data: [],
    });
  });

  it('Case: You can not get order of other customer', async () => {
    res.locals.user.roleNumber = 4;
    res.locals.user.customerNumber = 2;
    const withGraphFetched = Sinon.fake.returns(Promise.resolve([]));
    const join = Sinon.fake.returns({ withGraphFetched });
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });

    Sinon.replace(Customer, 'query', mockQuery);

    req = {
      params: {
        customerNumber: 1,
      },
    };

    const result = await getCustomerWithOrderCtrl(req, res);

    expect(result.status).to.eql(401);
    expect(result.data).to.eql({
      message: 'You can not get order of other customer',
    });
  });

  it('Case: successfully by customer', async () => {
    res.locals.user.roleNumber = 4;
    res.locals.user.customerNumber = 1;
    const withGraphFetched = Sinon.fake.returns(
      Promise.resolve([customerGraphFetchOrders]),
    );
    const join = Sinon.fake.returns({ withGraphFetched });
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });

    Sinon.replace(Customer, 'query', mockQuery);

    req = {
      params: {
        customerNumber: 1,
      },
    };

    const result = await getCustomerWithOrderCtrl(req, res);

    assert(withGraphFetched.calledOnce);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({ data: customerGraphFetchOrders });
  });

  it('Case: ERROR @Customer.getRelations: Internal Server Error', async () => {
    const withGraphFetched = Sinon.fake.returns(Promise.reject(new Error()));
    const join = Sinon.fake.returns({ withGraphFetched });
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });

    Sinon.replace(Customer, 'query', mockQuery);

    req = {
      params: {
        customerNumber: 1,
      },
    };

    try {
      await getCustomerWithOrderCtrl(req, res);
    } catch (error) {
      assert(withGraphFetched.calledOnce);
      expect(error.message).to.eql(
        'ERROR @Customer.getRelations: Internal Server Error',
      );
    }
  });
});
