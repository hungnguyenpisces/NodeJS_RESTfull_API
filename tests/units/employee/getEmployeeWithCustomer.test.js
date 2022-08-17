import { expect, assert } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import Employee from '../../../src/models/employee.model';
import { getEmployeeWithCustomerCtrl } from '../../../src/controllers/employee.controller';
import { mockGraphFetched } from '../../mock_data/employee.mock';

let res;
describe('Test function getEmployeeWithCustomer', () => {
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
  it('Successfully! return one employee with Customer list', async () => {
    const withGraphFetched = Sinon.fake.returns(
      Promise.resolve(mockGraphFetched),
    );
    const join = Sinon.fake.returns({ withGraphFetched });
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });

    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 1611,
      },
    };
    const result = await getEmployeeWithCustomerCtrl(req, res);
    assert(select.calledOnce);
    assert(where.calledWith(req.params));
    assert(join.calledOnce);
    assert(withGraphFetched.calledOnce);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({ data: mockGraphFetched[0] });
  });
  it('Fail! "No employee found"', async () => {
    const withGraphFetched = Sinon.fake.returns(Promise.resolve([]));
    const join = Sinon.fake.returns({ withGraphFetched });
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });

    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 1611,
      },
    };
    const result = await getEmployeeWithCustomerCtrl(req, res);
    assert(select.calledOnce);
    assert(where.calledWith(req.params));
    assert(join.calledOnce);
    assert(withGraphFetched.calledOnce);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'No employee found',
      data: [],
    });
  });
  it('Fail! throw Error "ERROR @Employee.getRelations: Internal Server Error"', async () => {
    const withGraphFetched = Sinon.fake.returns(Promise.reject(new Error()));
    const join = Sinon.fake.returns({ withGraphFetched });
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });

    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 1611,
      },
    };
    try {
      await getEmployeeWithCustomerCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      assert(select.calledOnce);
      assert(where.calledWith(req.params));
      assert(join.calledOnce);
      assert(withGraphFetched.calledOnce);

      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql(
        'ERROR @Employee.getRelations: Internal Server Error',
      );
    }
  });
});
