import _ from 'lodash';
import Employee from '../models/employee.model';
import User from '../models/user.model';
import AppError from '../middlewares/error/AppError';
import generatePassword from '../helpers/generateRandomPassword';
import hashPassword from '../helpers/hashPassword';

const getAllEmployeesCtrl = async (req, res) => {
  const employees = await Employee.get(req.query);

  if (_.isEmpty(employees)) {
    return res.status(200).json({
      message: 'No employees found',
      data: [],
    });
  }

  return res.status(200).json({
    total: employees.length,
    data: employees,
  });
};

const getEmployeeWithCustomerCtrl = async (req, res) => {
  const employee = await Employee.getOneRelationsToCustomer(req.params);

  if (_.isEmpty(employee)) {
    return res.status(200).json({
      message: 'No employee found',
      data: [],
    });
  }

  return res.status(200).json({
    data: employee,
  });
};

const createEmployeeCtrl = async (req, res) => {
  const { email, ...rest } = req.body;
  const pass = generatePassword();
  const password = hashPassword(pass);
  const dataUser = { email, password, isVerified: true };
  let result;

  try {
    if (res.locals.user.roleNumber === 1) {
      result = await Employee.transaction(async (trx) => {
        const user = await User.query(trx).insert(dataUser);
        if (_.isEmpty(user)) {
          throw new AppError('Employee.transaction: Create user failed', 400);
        }
        const dataEmployee = {
          ...rest,
          userNumber: user.userNumber,
          isActive: 1,
        };
        const employee = await Employee.query(trx).insert(dataEmployee);
        if (_.isEmpty(employee)) {
          throw new AppError(
            'Employee.transaction: Create employee failed',
            400,
          );
        }
        delete user.password;

        return { user, employee };
      });
    } else {
      if (res.locals.user.officeCode !== rest.officeCode) {
        throw new AppError('You can not create employee for this office', 400);
      }
      result = await Employee.transaction(async (trx) => {
        const user = await User.query(trx).insert(dataUser);
        if (_.isEmpty(user)) {
          throw new AppError('Employee.transaction: Create user failed', 400);
        }
        const dataEmployee = {
          ...rest,
          userNumber: user.userNumber,
          isActive: 1,
        };
        const employee = await Employee.query(trx).insert(dataEmployee);
        if (_.isEmpty(employee)) {
          throw new AppError(
            'Employee.transaction: Create employee failed',
            400,
          );
        }
        delete user.password;

        return { user, employee };
      });
    }

    if (_.isEmpty(result)) {
      throw new AppError(
        'Employee.transaction: Something wrong! Transaction return "null"',
        400,
      );
    }

    return res.status(200).json({
      message: 'Employee created successfully',
      data: result,
    });
  } catch (error) {
    throw new AppError(
      error.message
        ? error.message
        : `ERROR @Employee.transaction: Internal Server Error`,
      error.statusCode ? error.statusCode : 500,
    );
  }
};

const updateEmployeeCtrl = async (req, res) => {
  const { employeeNumber } = req.params;
  const data = req.body;
  let employeeToUpdate;
  let updatedEmployee;
  if (res.locals.user.roleNumber === 1) {
    updatedEmployee = await Employee.update(employeeNumber, data);
  } else {
    if (res.locals.user.officeCode !== data.officeCode) {
      return res.status(401).json({
        message: 'You can not change office of Employee',
      });
    }
    employeeToUpdate = await Employee.getOne({ employeeNumber });
    if (_.isEmpty(employeeToUpdate)) {
      return res.status(404).json({
        message: 'Employee not found by number',
      });
    }
    if (employeeToUpdate.officeCode !== res.locals.user.officeCode) {
      return res.status(401).json({
        message: 'this employee is not in your office',
      });
    }
    updatedEmployee = await Employee.update(employeeNumber, data);
  }

  if (_.isEmpty(updatedEmployee)) {
    return res.status(200).json({
      message: 'No employee has been updated',
      data: [],
    });
  }

  return res.status(200).json({
    message: 'Employee updated successfully',
    data: updatedEmployee,
  });
};

const deleteEmployeeCtrl = async (req, res) => {
  const { employeeNumber } = req.params;
  const employee = await Employee.update(employeeNumber, { isActive: false });

  if (_.isEmpty(employee)) {
    return res.status(200).json({
      message: 'No employee has been deleted',
      data: [],
    });
  }

  return res.status(200).json({
    message: 'Delete employee success',
    data: employee,
  });
};

export {
  getAllEmployeesCtrl,
  getEmployeeWithCustomerCtrl,
  createEmployeeCtrl,
  updateEmployeeCtrl,
  deleteEmployeeCtrl,
};
