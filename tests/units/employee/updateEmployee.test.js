import { assert, expect } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import Employee from '../../../src/models/employee.model';
import { updateEmployeeCtrl } from '../../../src/controllers/employee.controller';
import { mockGetAll, updatedEmployee } from '../../mock_data/employee.mock';

let res;
let mockBody;
describe('Test function updateEmployee', () => {
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
    reportsTo: null,
    jobTitle: 'Staff',
    roleNumber: 3,
  };
  afterEach(() => {
    Sinon.restore();
  });
  it('Successfully! return updated employee by Admin', async () => {
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(updatedEmployee),
    );
    const mockQuery = () => ({
      patchAndFetchById,
    });
    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 2000,
      },
      body: mockBody,
    };
    const result = await updateEmployeeCtrl(req, res);
    assert(patchAndFetchById.calledWith(req.params.employeeNumber, req.body));
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  });
  it('No employee has been updated', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve(null));
    const mockQuery = () => ({
      patchAndFetchById,
    });
    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 2000,
      },
      body: mockBody,
    };
    const result = await updateEmployeeCtrl(req, res);
    assert(patchAndFetchById.calledWith(req.params.employeeNumber, req.body));
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'No employee has been updated',
      data: [],
    });
  });
  it('Successfully! return updated employee by Manager', async () => {
    res.locals.user.roleNumber = 2;
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(updatedEmployee),
    );
    const where = Sinon.fake.returns(Promise.resolve([updatedEmployee]));

    const mockQuery = () => ({
      patchAndFetchById,
      where,
    });
    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 2000,
      },
      body: mockBody,
    };
    const result = await updateEmployeeCtrl(req, res);
    assert(patchAndFetchById.calledWith(req.params.employeeNumber, req.body));
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  });
  it('Manager can not change office of Employee', async () => {
    res.locals.user.roleNumber = 2;
    res.locals.user.officeCode = '2';
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(updatedEmployee),
    );
    const where = Sinon.fake.returns(Promise.resolve([]));

    const mockQuery = () => ({
      patchAndFetchById,
      where,
    });
    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 2000,
      },
      body: mockBody,
    };
    const result = await updateEmployeeCtrl(req, res);
    expect(result.status).to.equal(401);
    expect(result.data).to.eql({
      message: 'You can not change office of Employee',
    });
  });
  it('Employee not found by Manager', async () => {
    res.locals.user.roleNumber = 2;
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(updatedEmployee),
    );
    const where = Sinon.fake.returns(Promise.resolve([]));

    const mockQuery = () => ({
      patchAndFetchById,
      where,
    });
    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 2000,
      },
      body: mockBody,
    };
    const result = await updateEmployeeCtrl(req, res);
    expect(result.status).to.equal(404);
    expect(result.data).to.eql({
      message: 'Employee not found by number',
    });
  });
  it('Manager: this employee is not in your office', async () => {
    res.locals.user.roleNumber = 2;
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(updatedEmployee),
    );
    const where = Sinon.fake.returns(Promise.resolve([mockGetAll[2]]));

    const mockQuery = () => ({
      patchAndFetchById,
      where,
    });
    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 2000,
      },
      body: mockBody,
    };
    const result = await updateEmployeeCtrl(req, res);
    expect(result.status).to.equal(401);
    expect(result.data).to.eql({
      message: 'this employee is not in your office',
    });
  });
  it('ERROR Internal Server Error by Manager', async () => {
    res.locals.user.roleNumber = 2;
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(updatedEmployee),
    );
    const where = Sinon.fake.returns(Promise.reject(new Error()));

    const mockQuery = () => ({
      patchAndFetchById,
      where,
    });
    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 2000,
      },
      body: mockBody,
    };
    try {
      await updateEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Employee.getOne: Internal Server Error',
      );
    }
  });
  it('Fail! throw Error "ERROR @Employee.update: Internal Server Error"', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.reject(new Error()));
    const mockQuery = () => ({
      patchAndFetchById,
    });
    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 2000,
      },
      body: mockBody,
    };
    try {
      await updateEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Employee.update: Internal Server Error',
      );
    }
  });
});
