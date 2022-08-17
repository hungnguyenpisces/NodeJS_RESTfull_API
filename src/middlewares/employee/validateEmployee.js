import { celebrate, Joi } from 'celebrate';
import Employee from '../../models/employee.model';
import User from '../../models/user.model';
import AppError from '../error/AppError';

const createEmployeeValidate = celebrate(
  {
    body: Joi.object().keys({
      lastName: Joi.string().min(3).max(50).trim().required(),
      firstName: Joi.string().min(3).max(50).trim().required(),
      extension: Joi.string().max(50).trim().required(),
      officeCode: Joi.string().required().max(10),
      reportsTo: Joi.number().integer().positive().allow(null),
      jobTitle: Joi.string().required().valid('Manager', 'Staff'),
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
const updateEmployeeValidate = celebrate(
  {
    params: Joi.object().keys({
      employeeNumber: Joi.number().integer().positive().required(),
    }),
    body: Joi.object().keys({
      lastName: Joi.string().min(3).max(50).trim().optional(),
      firstName: Joi.string().min(3).max(50).trim().optional(),
      extension: Joi.string().max(50).trim().optional(),
      officeCode: Joi.string().max(10).optional(),
      reportsTo: Joi.number().integer().positive().allow(null).optional(),
      jobTitle: Joi.string().valid('Admin', 'Manager', 'Staff').optional(),
      roleNumber: Joi.number().integer().positive().valid(1, 2, 3).optional(),
    }),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const queryEmployeeValidate = celebrate(
  {
    query: Joi.object().keys({
      employeeNumber: Joi.number().integer().positive().optional(),
      lastName: Joi.string().max(50).trim().optional(),
      firstName: Joi.string().max(50).trim().optional(),
      extension: Joi.string().max(50).trim().optional(),
      officeCode: Joi.string().max(10).optional(),
      reportsTo: Joi.number().integer().positive().allow(null).optional(),
      jobTitle: Joi.string().optional(),
      userNumber: Joi.number().integer().positive().optional(),
      roleNumber: Joi.number().integer().positive().valid(1, 2, 3).optional(),
      isActive: Joi.number().integer().positive().valid(0, 1).optional(),
      email: Joi.string().max(100).email().trim().optional(),
    }),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const paramsEmployeeValidate = celebrate(
  {
    params: Joi.object().keys({
      employeeNumber: Joi.number().integer().positive().required(),
    }),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkDuplicateEmployee = async (req, res, next) => {
  const { email, reportsTo } = req.body;
  try {
    const reportsEmployee = await Employee.query().findOne({
      employeeNumber: reportsTo,
    });
    if (!reportsEmployee) {
      req.body.reportsTo = null;
    }
    const user = await User.query().findOne({ email });
    if (user) {
      throw new AppError('email is already exist', 400);
    }

    return next();
  } catch (error) {
    throw new AppError(
      error.message
        ? error.message
        : `ERROR @Employee.Duplicate: Internal Server Error`,
      error.statusCode ? error.statusCode : 500,
    );
  }
};

export {
  createEmployeeValidate,
  checkDuplicateEmployee,
  updateEmployeeValidate,
  queryEmployeeValidate,
  paramsEmployeeValidate,
};
