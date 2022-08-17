import { expect, assert } from 'chai';
import Sinon from 'sinon';
import Customer from '../../../src/models/customer.model';
import { customerDataMock } from '../../mock_data/customer.mock';
import { checkDupCustomer } from '../../../src/middlewares/customer/validateCustomer';

describe('Test checkDupCustomer', () => {
  let req;
  let res;
  const next = Sinon.spy();

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

  it('Case: Customer already exist', async () => {
    const where = Sinon.fake.returns(Promise.resolve([customerDataMock]));
    const mockQuery = () => ({
      where,
    });

    Sinon.replace(Customer, 'query', mockQuery);

    req = {
      body: {
        customerNumber: 1,
      },
    };
    try {
      await checkDupCustomer(req, res, next);
    } catch (error) {
      assert(where.called);
      assert(where.calledWith(req.body.customerNumber));
      expect(error.message).to.eql('Customer already exists');
    }
  });

  it('Case: Not duplicated', async () => {
    const where = Sinon.fake.returns(Promise.resolve(null));
    const mockQuery = () => ({
      where,
    });

    Sinon.replace(Customer, 'query', mockQuery);

    req = {
      body: {
        customerNumber: 2,
      },
    };

    await checkDupCustomer(req, res, next);

    assert(where.called);
    assert(where.calledWith(req.body.customerNumber));
    expect(next.calledOnce);
  });

  it('Case: Internal Server Error', async () => {
    const where = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({
      where,
    });

    Sinon.replace(Customer, 'query', mockQuery);

    req = {
      body: {
        customerNumber: 2,
      },
    };
    try {
      await checkDupCustomer(req, res, next);
    } catch (error) {
      assert(where.called);
      assert(where.calledWith(req.body.customerNumber));
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal('Internal Server Error');
    }
  });
});
