import _ from 'lodash';
import Customer from '../models/customer.model';
import User from '../models/user.model';
import AppError from '../middlewares/error/AppError';
import generatePassword from '../helpers/generateRandomPassword';
import hashPassword from '../helpers/hashPassword';

const createCustomerCtrl = async (req, res) => {
  const { email, ...rest } = req.body;
  const pass = generatePassword();
  const password = hashPassword(pass);
  const dataUser = { email, password };

  try {
    const result = await Customer.transaction(async (trx) => {
      const user = await User.query(trx).insert(dataUser);

      if (_.isEmpty(user)) {
        throw new AppError(
          'ERROR @Customer.transaction: Create user failed',
          400,
        );
      }

      const dataCustomer = {
        ...rest,
        userNumber: user.userNumber,
        isActive: 1,
      };
      const customer = await Customer.query(trx).insert(dataCustomer);

      if (_.isEmpty(customer)) {
        throw new AppError(
          'ERROR @Customer.transaction: Create customer failed',
          400,
        );
      }

      delete user.password;

      return { user, customer };
    });

    if (_.isEmpty(result)) {
      throw new AppError(
        'ERROR @Customer.transaction: Something went wrong',
        500,
      );
    }

    return res.status(200).json({
      message: 'Customer created successfully',
      data: result,
    });
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};

const getAllCustomersCtrl = async (req, res) => {
  const queryData = req.query;
  const customers = await Customer.get(queryData);

  if (_.isEmpty(customers)) {
    return res.status(200).json({
      message: 'No customers found',
      data: [],
    });
  }

  return res.status(200).json({
    total: customers.length,
    data: customers,
  });
};

const getCustomerWithOrderCtrl = async (req, res) => {
  const { customerNumber } = req.params;
  let customer;

  if (
    res.locals.user.roleNumber === 1 ||
    res.locals.user.roleNumber === 2 ||
    res.locals.user.roleNumber === 3
  ) {
    customer = await Customer.getOneRelationsToOrder({ customerNumber });
  }
  if (res.locals.user.roleNumber === 4) {
    if (res.locals.user.customerNumber !== customerNumber) {
      return res.status(401).json({
        message: 'You can not get order of other customer',
      });
    }
    customer = await Customer.getOneRelationsToOrder({ customerNumber });
  }

  if (_.isEmpty(customer)) {
    return res.status(200).json({
      message: 'No customer found',
      data: [],
    });
  }

  return res.status(200).json({
    data: customer,
  });
};

const updateCustomerCtrl = async (req, res) => {
  const { customerNumber } = req.params;
  const data = req.body;
  let customerUpdated;

  if (res.locals.user.roleNumber === 1) {
    customerUpdated = await Customer.update(customerNumber, data);
  }
  if (res.locals.user.roleNumber === 4) {
    if (res.locals.user.customerNumber !== customerNumber) {
      return res.status(401).json({
        message: 'Unauthorized: your customerNumber is not match',
      });
    }
    customerUpdated = await Customer.update(customerNumber, data);
  }

  if (_.isEmpty(customerUpdated)) {
    return res.status(200).json({
      message: 'No customer has been updated',
    });
  }

  return res.status(200).json({
    message: 'Success',
    data: customerUpdated,
  });
};

const deleteCustomerCtrl = async (req, res) => {
  const { customerNumber } = req.params;
  const data = { isActive: 0 };
  const customerUpdated = await Customer.update(customerNumber, data);

  if (_.isEmpty(customerUpdated)) {
    return res.status(200).json({
      message: 'No customer has been deleted',
    });
  }

  return res.status(200).json({
    message: 'Deleted',
  });
};

export {
  createCustomerCtrl,
  getAllCustomersCtrl,
  getCustomerWithOrderCtrl,
  updateCustomerCtrl,
  deleteCustomerCtrl,
};
