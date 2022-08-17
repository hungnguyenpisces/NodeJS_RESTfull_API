import { expect, assert } from 'chai';
import Sinon from 'sinon';
import { mockFound } from '../../mock_data/employee.mock';
import { checkSaleRepInput } from '../../../src/middlewares/customer/validateCustomer';
import Employee from '../../../src/models/employee.model';

describe('Test checkSaleRepInput', () => {
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

  it('Case: No salesRepEmployeeNumber in req.body', async () => {
    req = {
      body: {},
    };

    await checkSaleRepInput(req, res, next);

    assert(next.calledOnce);
  });

  it('Case: Employee exists, next() called', async () => {
    const findById = Sinon.fake.returns(Promise.resolve(mockFound.employee));
    const mockQuery = () => ({
      findById,
    });

    Sinon.replace(Employee, 'query', mockQuery);

    req = {
      body: {
        salesRepEmployeeNumber: 2008,
      },
    };

    await checkSaleRepInput(req, res, next);

    assert(findById.calledWith(req.body.salesRepEmployeeNumber));
    assert(next.called);
  });

  it('Case: Employee 20 not found', async () => {
    const findById = Sinon.fake.returns(Promise.resolve(null));
    const mockQuery = () => ({
      findById,
    });

    Sinon.replace(Employee, 'query', mockQuery);

    req = {
      body: {
        salesRepEmployeeNumber: 20,
      },
    };

    try {
      await checkSaleRepInput(req, res, next);
    } catch (error) {
      assert(findById.called);
      assert(findById.calledWith(req.body.salesRepEmployeeNumber));
      expect(error.statusCode).to.eql(404);
      expect(error.message).to.equal('Employee 20 not found');
    }
  });

  it('Case: Something went wrong while checking salesRepEmployeeNumber', async () => {
    const findById = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({
      findById,
    });

    Sinon.replace(Employee, 'query', mockQuery);

    req = {
      body: {
        salesRepEmployeeNumber: 2,
      },
    };

    try {
      await checkSaleRepInput(req, res, next);
    } catch (error) {
      assert(findById.called);
      assert(findById.calledWith(req.body.salesRepEmployeeNumber));
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'Something went wrong while checking salesRepEmployeeNumber',
      );
    }
  });
});
