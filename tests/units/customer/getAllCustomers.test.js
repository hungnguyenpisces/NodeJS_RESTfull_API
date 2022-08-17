import Sinon from 'sinon';
import { expect, assert } from 'chai';
import { getAllCustomersCtrl } from '../../../src/controllers/customer.controller';
import Customer from '../../../src/models/customer.model';
import customerDataMock from '../../mock_data/customer.mock';

describe('Test get all customers', async () => {
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

  it('Case: No query search, getAllCustomerCtrler successfully', async () => {
    const where = Sinon.fake.returns(Promise.resolve([customerDataMock]));
    const mockData = () => ({ where });

    Sinon.replace(Customer, 'query', mockData);

    const result = await getAllCustomersCtrl(req, res);

    assert(where.called);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      total: 1,
      data: [customerDataMock],
    });
  });

  it('Case: No query search, No Customers found', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const mockData = () => ({ where });

    Sinon.replace(Customer, 'query', mockData);

    const result = await getAllCustomersCtrl(req, res);
    assert(where.called);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'No customers found',
      data: [],
    });
  });

  it('Case: No query search, Internal Server Error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const mockData = () => ({ where });

    Sinon.replace(Customer, 'query', mockData);

    try {
      await getAllCustomersCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.message).to.eql(
        'ERROR @Customer.get: Internal Server Error',
      );
    }
  });

  it('Case: Query search, getAllCustomerCtrler successfully', async () => {
    const where = Sinon.fake.returns(Promise.resolve([customerDataMock]));
    const dataCustomer = () => ({ where });

    Sinon.replace(Customer, 'query', dataCustomer);

    req = {
      query: { contactLastName: 'Schmitt' },
    };

    const result = await getAllCustomersCtrl(req, res);

    assert(where.called);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      total: 1,
      data: [customerDataMock],
    });
  });

  it('Case: Query search, No customers found', async () => {
    const where = Sinon.fake.returns(Promise.resolve([]));
    const dataCustomer = () => ({ where });

    Sinon.replace(Customer, 'query', dataCustomer);

    req = {
      query: { contactLastName: 'Schmittzzz' },
    };

    const result = await getAllCustomersCtrl(req, res);
    assert(where.called);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'No customers found',
      data: [],
    });
  });

  it('Case: Query search, Internal Server Error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const dataCustomer = () => ({ where });

    Sinon.replace(Customer, 'query', dataCustomer);

    req = {
      query: { contactLastName: 'Schmittzzz' },
    };

    try {
      await getAllCustomersCtrl(req, res);
    } catch (error) {
      assert(where.called);
      expect(error.message).to.eql(
        'ERROR @Customer.get: Internal Server Error',
      );
    }
  });
});
