import { expect } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import User from '../../../src/models/user.model';
import Employee from '../../../src/models/employee.model';
import { createEmployeeCtrl } from '../../../src/controllers/employee.controller';
import { mockCreated } from '../../mock_data/employee.mock';

let res;
let mockBody;

describe('Test function createEmployee', () => {
  beforeEach(() => {
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
          roleNumber: 1,
          officeCode: '1',
        },
      },
    };
  });
  mockBody = {
    employeeNumber: 2000,
    lastName: 'Murphy',
    firstName: 'Diane',
    extension: 'x5800',
    officeCode: '1',
    reportsTo: 2002,
    jobTitle: 'Staff',
    email: 'mock@email.com',
  };
  afterEach(() => {
    Sinon.restore();
  });
  it('Successfully! return created employee & user with transaction', async () => {
    const mockQueryEmployee = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.employee)),
    });
    const mockQueryUser = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.user)),
    });
    Sinon.replace(Employee, 'query', mockQueryEmployee);
    Sinon.replace(User, 'query', mockQueryUser);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(Employee, 'transaction', transactionMock);

    const req = {
      body: mockBody,
    };
    const result = await createEmployeeCtrl(req, res);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Employee created successfully',
      data: mockCreated,
    });
  });
  it('Employee.transaction: Create user failed', async () => {
    const mockQueryEmployee = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.employee)),
    });
    const mockQueryUser = () => ({
      insert: Sinon.fake.returns(Promise.resolve(null)),
    });
    Sinon.replace(Employee, 'query', mockQueryEmployee);
    Sinon.replace(User, 'query', mockQueryUser);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(Employee, 'transaction', transactionMock);
    const req = {
      body: mockBody,
    };
    try {
      await createEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(400);
      expect(error.message).to.equal(
        'Employee.transaction: Create user failed',
      );
    }
  });
  it('Employee.transaction: Create employee failed"', async () => {
    const mockQueryEmployee = () => ({
      insert: Sinon.fake.returns(Promise.resolve(null)),
    });
    const mockQueryUser = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.user)),
    });
    Sinon.replace(Employee, 'query', mockQueryEmployee);
    Sinon.replace(User, 'query', mockQueryUser);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(Employee, 'transaction', transactionMock);
    const req = {
      body: mockBody,
    };
    try {
      await createEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(400);
      expect(error.message).to.equal(
        'Employee.transaction: Create employee failed',
      );
    }
  });
  it('Something wrong! Transaction return "null"', async () => {
    const mockQueryEmployee = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.employee)),
    });
    const mockQueryUser = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.user)),
    });
    Sinon.replace(Employee, 'query', mockQueryEmployee);
    Sinon.replace(User, 'query', mockQueryUser);

    const transactionMock = () => {
      return null;
    };

    Sinon.replace(Employee, 'transaction', transactionMock);
    const req = {
      body: mockBody,
    };
    try {
      await createEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(400);
      expect(error.message).to.equal(
        'Employee.transaction: Something wrong! Transaction return "null"',
      );
    }
  });
  it('ERROR @Employee.create: Internal Server Error in transaction', async () => {
    const mockQueryEmployee = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.employee)),
    });
    const mockQueryUser = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.user)),
    });
    Sinon.replace(Employee, 'query', mockQueryEmployee);
    Sinon.replace(User, 'query', mockQueryUser);

    const transactionMock = () => {
      throw new Error();
    };

    Sinon.replace(Employee, 'transaction', transactionMock);
    const req = {
      body: mockBody,
    };
    try {
      await createEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Employee.transaction: Internal Server Error',
      );
    }
  });
  it('Successfully! return created employee & user with transaction by Manager', async () => {
    res.locals.user.roleNumber = 2;
    const mockQueryEmployee = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.employee)),
    });
    const mockQueryUser = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.user)),
    });
    Sinon.replace(Employee, 'query', mockQueryEmployee);
    Sinon.replace(User, 'query', mockQueryUser);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(Employee, 'transaction', transactionMock);

    const req = {
      body: mockBody,
    };
    const result = await createEmployeeCtrl(req, res);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Employee created successfully',
      data: mockCreated,
    });
  });
  it('Employee.transaction: Create user failed by Manager', async () => {
    res.locals.user.roleNumber = 2;
    const mockQueryEmployee = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.employee)),
    });
    const mockQueryUser = () => ({
      insert: Sinon.fake.returns(Promise.resolve(null)),
    });
    Sinon.replace(Employee, 'query', mockQueryEmployee);
    Sinon.replace(User, 'query', mockQueryUser);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(Employee, 'transaction', transactionMock);
    const req = {
      body: mockBody,
    };
    try {
      await createEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(400);
      expect(error.message).to.equal(
        'Employee.transaction: Create user failed',
      );
    }
  });
  it('Employee.transaction: Create employee failed" by Manager', async () => {
    res.locals.user.roleNumber = 2;
    const mockQueryEmployee = () => ({
      insert: Sinon.fake.returns(Promise.resolve(null)),
    });
    const mockQueryUser = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.user)),
    });
    Sinon.replace(Employee, 'query', mockQueryEmployee);
    Sinon.replace(User, 'query', mockQueryUser);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(Employee, 'transaction', transactionMock);
    const req = {
      body: mockBody,
    };
    try {
      await createEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(400);
      expect(error.message).to.equal(
        'Employee.transaction: Create employee failed',
      );
    }
  });
  it('Something wrong! Transaction return "null" by Manager', async () => {
    res.locals.user.roleNumber = 2;
    const mockQueryEmployee = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.employee)),
    });
    const mockQueryUser = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.user)),
    });
    Sinon.replace(Employee, 'query', mockQueryEmployee);
    Sinon.replace(User, 'query', mockQueryUser);

    const transactionMock = () => {
      return null;
    };

    Sinon.replace(Employee, 'transaction', transactionMock);
    const req = {
      body: mockBody,
    };
    try {
      await createEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(400);
      expect(error.message).to.equal(
        'Employee.transaction: Something wrong! Transaction return "null"',
      );
    }
  });
  it('ERROR @Employee.create: Internal Server Error in transaction by Manager', async () => {
    res.locals.user.roleNumber = 2;
    const mockQueryEmployee = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.employee)),
    });
    const mockQueryUser = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.user)),
    });
    Sinon.replace(Employee, 'query', mockQueryEmployee);
    Sinon.replace(User, 'query', mockQueryUser);

    const transactionMock = () => {
      throw new Error();
    };

    Sinon.replace(Employee, 'transaction', transactionMock);
    const req = {
      body: mockBody,
    };
    try {
      await createEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Employee.transaction: Internal Server Error',
      );
    }
  });
  it('ERROR can not create employee for this office by Manager', async () => {
    res.locals.user.roleNumber = 2;
    res.locals.user.officeCode = '2';
    const mockQueryEmployee = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.employee)),
    });
    const mockQueryUser = () => ({
      insert: Sinon.fake.returns(Promise.resolve(mockCreated.user)),
    });
    Sinon.replace(Employee, 'query', mockQueryEmployee);
    Sinon.replace(User, 'query', mockQueryUser);

    const transactionMock = () => {
      throw new Error();
    };

    Sinon.replace(Employee, 'transaction', transactionMock);
    const req = {
      body: mockBody,
    };
    try {
      await createEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(400);
      expect(error.message).to.equal(
        'You can not create employee for this office',
      );
    }
  });
});
