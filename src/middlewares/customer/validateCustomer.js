import { celebrate, Joi } from 'celebrate';
import _ from 'lodash';
import Customer from '../../models/customer.model';
import Employee from '../../models/employee.model';
import AppError from '../error/AppError';

const customerNumberSchema = {
  customerNumber: Joi.number().integer().positive().required(),
};

const checkCreateCustomer = celebrate(
  {
    body: Joi.object().keys({
      customerName: Joi.string().min(5).max(50).required(),
      contactLastName: Joi.string().min(3).max(50).required(),
      contactFirstName: Joi.string().min(3).max(50).required(),
      phone: Joi.string().min(8).max(20).required(),
      addressLine1: Joi.string().min(10).max(50).required(),
      addressLine2: Joi.string().min(10).max(50).optional(),
      city: Joi.string().min(2).max(50).required(),
      state: Joi.string().min(2).max(50).optional(),
      postalCode: Joi.string().min(5).max(15).optional(),
      country: Joi.string().min(2).max(50).required(),
      salesRepEmployeeNumber: Joi.number().optional(),
      creditLimit: Joi.number().precision(2).optional(),
      roleNumber: Joi.number().integer().positive().valid(4).optional(),
      email: Joi.string().min(10).max(100).email().trim().required(),
    }),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const inputQueryOrUpdateSchema = {
  customerName: Joi.string().min(5).max(50).optional(),
  contactLastName: Joi.string().min(3).max(50).optional(),
  contactFirstName: Joi.string().min(3).max(50).optional(),
  phone: Joi.string().min(8).max(20).optional(),
  addressLine1: Joi.string().min(10).max(50).optional(),
  addressLine2: Joi.string().min(10).max(50).optional(),
  city: Joi.string().min(2).max(50).optional(),
  state: Joi.string().min(2).max(50).optional(),
  postalCode: Joi.string().min(5).max(15).optional(),
  country: Joi.string().min(2).max(50).optional(),
  salesRepEmployeeNumber: Joi.number().optional(),
  creditLimit: Joi.number().precision(2).optional(),
};

const checkInputQueryOrUpdate = celebrate(
  {
    query: Joi.object().keys(inputQueryOrUpdateSchema),
    body: Joi.object().keys(inputQueryOrUpdateSchema),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkIdInput = celebrate(
  {
    params: Joi.object().keys(customerNumberSchema),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkDupCustomer = async (req, res, next) => {
  try {
    const { customerNumber } = req.body;
    const customer = await Customer.query().where(customerNumber);

    if (_.isEmpty(customer)) {
      return next();
    }

    throw new AppError('Customer already exists', 400);
  } catch (error) {
    if (error.statusCode === 400) {
      throw new AppError(error.message, 400);
    }

    throw new AppError('Internal Server Error', 500);
  }
};

const checkSaleRepInput = async (req, res, next) => {
  if (!req.body.salesRepEmployeeNumber) {
    return next();
  }

  try {
    const { salesRepEmployeeNumber } = req.body;
    const employee = await Employee.query().findById(salesRepEmployeeNumber);

    if (_.isEmpty(employee)) {
      throw new AppError(`Employee ${salesRepEmployeeNumber} not found`, 404);
    }

    return next();
  } catch (error) {
    throw new AppError(
      error.message
        ? error.message
        : `Something went wrong while checking salesRepEmployeeNumber`,
      error.statusCode ? error.statusCode : 500,
    );
  }
};

export {
  checkInputQueryOrUpdate,
  checkIdInput,
  checkCreateCustomer,
  checkDupCustomer,
  checkSaleRepInput,
};
