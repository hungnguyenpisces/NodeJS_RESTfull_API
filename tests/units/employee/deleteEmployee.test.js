import { expect } from 'chai';
import Sinon from 'sinon';
import AppError from '../../../src/middlewares/error/AppError';
import Employee from '../../../src/models/employee.model';
import { deleteEmployeeCtrl } from '../../../src/controllers/employee.controller';
import { updatedEmployee } from '../../mock_data/employee.mock';

let res;
describe('Test function deleteEmployee', () => {
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
  it('Successfully! return deleted employee', async () => {
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
    };
    const result = await deleteEmployeeCtrl(req, res);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Delete employee success',
      data: updatedEmployee,
    });
  });
  it('Fail! "No employee has been deleted"', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve(null));
    const mockQuery = () => ({
      patchAndFetchById,
    });
    Sinon.replace(Employee, 'query', mockQuery);

    const req = {
      params: {
        employeeNumber: 2000,
      },
    };
    const result = await deleteEmployeeCtrl(req, res);
    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'No employee has been deleted',
      data: [],
    });
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
    };
    try {
      await deleteEmployeeCtrl(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceof(AppError);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.equal(
        'ERROR @Employee.update: Internal Server Error',
      );
    }
  });
});
