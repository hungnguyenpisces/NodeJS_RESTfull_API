import _ from 'lodash';
import bcrypt from 'bcrypt';
import { celebrate, Joi } from 'celebrate';
import AppError from '../error/AppError';
import User from '../../models/user.model';

const userSchema = {
  email: Joi.string().email().min(10).max(100).required(),
  password: Joi.string().min(8).max(100).required(),
};

const checkInput = celebrate(
  {
    params: Joi.object().keys(),
    query: Joi.object().keys(),
    body: Joi.object().keys(userSchema),
  },
  {
    abortEarly: false,
    convert: false,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkPassword = async (req, res, next) => {
  const { email, password } = req.body;
  let result;
  let roleNumber;
  let isActive;
  let customerNumber;
  let officeCode;
  try {
    switch (req.originalUrl) {
      case '/api/users/customer/login':
        result = await User.getOneRelatedToCustomer({ email });
        if (_.isEmpty(result) || _.isEmpty(result.customer)) {
          throw new AppError('Email or password is incorrect', 401);
        }
        roleNumber = result.customer.roleNumber;
        officeCode = null;
        customerNumber = result.customer.customerNumber;
        isActive = result.customer.isActive;
        break;
      case '/api/users/employee/login':
        result = await User.getOneRelatedToEmployee({ email });
        if (_.isEmpty(result) || _.isEmpty(result.employee)) {
          throw new AppError('Email or password is incorrect', 401);
        }
        roleNumber = result.employee.roleNumber;
        officeCode = result.employee.officeCode;
        customerNumber = null;
        isActive = result.employee.isActive;
        break;
    }
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
  if (!bcrypt.compareSync(password, result.password)) {
    throw new AppError(`Email or password is incorrect`, 401);
  }

  if (!result.isVerified) {
    throw new AppError(`Unverified account.`, 401);
  }

  if (!isActive) {
    throw new AppError(`The account is currently inactive`, 401);
  }

  res.locals.user = {
    email: result.email,
    roleNumber,
    customerNumber,
    officeCode,
  };

  return next();
};

const validateLogin = { checkInput, checkPassword };

export default validateLogin;
