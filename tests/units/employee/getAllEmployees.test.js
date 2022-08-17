import { expect, assert } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import Employee from '../../../src/models/employee.model';
import { getAllEmployeesCtrl } from '../../../src/controllers/employee.controller';
import { mockGetAll } from '../../mock_data/employee.mock';

let res;
describe('Test function getAllEmployees', () => {
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
  it('Successfully! return all employees', async () => {
    const join = Sinon.fake.returns(Promise.resolve(mockGetAll));
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });
    Sinon.replace(Employee, 'query', mockQuery);
    const req = {};
    const result = await getAllEmployeesCtrl(req, res);
    assert(select.calledOnce);
    assert(where.calledWith(req.query));
    assert(join.called);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      total: 5,
      data: mockGetAll,
    });
  });
  it('Fail! "No employees found"', async () => {
    const join = Sinon.fake.returns(Promise.resolve([]));
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });
    const req = {};
    Sinon.replace(Employee, 'query', mockQuery);
    const result = await getAllEmployeesCtrl(req, res);
    assert(select.calledOnce);
    assert(where.calledWith(req.query));
    assert(join.called);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'No employees found',
      data: [],
    });
  });
  it('Fail! throw Error "ERROR @Employee.get: Internal Server Error"', async () => {
    const join = Sinon.fake.returns(Promise.reject(new Error()));
    const where = Sinon.fake.returns({ join });
    const select = Sinon.fake.returns({ where });
    const mockQuery = () => ({
      select,
    });
    const req = {};
    Sinon.replace(Employee, 'query', mockQuery);
    try {
      await getAllEmployeesCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      assert(select.calledOnce);
      assert(where.calledWith(req.query));
      assert(join.called);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql(
        'ERROR @Employee.get: Internal Server Error',
      );
    }
  });
});
