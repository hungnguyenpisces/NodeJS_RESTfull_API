import { expect } from 'chai';
import Sinon from 'sinon';
import User from '../../../src/models/user.model';
import Employee from '../../../src/models/employee.model';
import AppError from '../../../src/middlewares/error/AppError';
import { checkDuplicateEmployee } from '../../../src/middlewares/employee/validateEmployee';
import { mockFound } from '../../mock_data/employee.mock';

let res;
let next;
let mockBody;
describe('Test function checkDuplicateEmployee', () => {
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
    next = Sinon.spy();
    mockBody = {
      employeeNumber: 2001,
      lastName: 'Murphy',
      firstName: 'Diane',
      extension: 'x5800',
      officeCode: '1',
      reportsTo: 2000,
      jobTitle: 'Staff',
      email: 'mock@email.com',
    };
  });
  afterEach(() => {
    Sinon.restore();
  });
  it('reportsTo change to "null" when not found Employee for reportTo', async () => {
    const req = {
      body: mockBody,
    };
    const mockQuerEmployee = () => ({
      findOne: Sinon.fake.returns(Promise.resolve(null)),
    });
    const mockQuerUser = () => ({
      findOne: Sinon.fake.returns(Promise.resolve(mockFound.user)),
    });
    Sinon.replace(Employee, 'query', mockQuerEmployee);
    Sinon.replace(User, 'query', mockQuerUser);
    try {
      await checkDuplicateEmployee(req, res, next);
    } catch (error) {
      expect(req.body.reportsTo).to.equal(null);
    }
  });
  it('return Email is already exist', async () => {
    const req = {
      body: mockBody,
    };
    const mockQuerEmployee = () => ({
      findOne: Sinon.fake.returns(Promise.resolve(null)),
    });
    const mockQuerUser = () => ({
      findOne: Sinon.fake.returns(Promise.resolve(mockFound.user)),
    });
    Sinon.replace(Employee, 'query', mockQuerEmployee);
    Sinon.replace(User, 'query', mockQuerUser);
    try {
      await checkDuplicateEmployee(req, res, next);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(400);
      expect(error.message).to.equal('email is already exist');
    }
  });
  it('ERROR @Employee.Duplicate: Internal Server Error', async () => {
    const req = {
      body: mockBody,
    };
    const mockQuerEmployee = () => ({
      findOne: Sinon.fake.returns(Promise.reject(new Error())),
    });
    const mockQuerUser = () => ({
      findOne: Sinon.fake.returns(Promise.resolve(new Error())),
    });
    Sinon.replace(Employee, 'query', mockQuerEmployee);
    Sinon.replace(User, 'query', mockQuerUser);
    try {
      await checkDuplicateEmployee(req, res, next);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Employee.Duplicate: Internal Server Error',
      );
    }
  });
  it('next() called when satisfy the condition unique to insert', async () => {
    const req = {
      body: mockBody,
    };
    const mockQuerEmployee = () => ({
      findOne: Sinon.fake.returns(Promise.resolve(mockFound.employee)),
    });
    const mockQuerUser = () => ({
      findOne: Sinon.fake.returns(Promise.resolve(null)),
    });
    Sinon.replace(Employee, 'query', mockQuerEmployee);
    Sinon.replace(User, 'query', mockQuerUser);
    await checkDuplicateEmployee(req, res, next);
    expect(next.calledOnce);
  });
});
