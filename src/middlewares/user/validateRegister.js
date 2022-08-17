import { celebrate, Joi } from 'celebrate';
import AppError from '../error/AppError';
import User from '../../models/user.model';

const userSchema = {
  email: Joi.string().email().min(10).max(100).required(),
  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(/^[a-zA-Z0-9!@#$%\^&*)(+=._-]*$/)
    .required(),
  confirmPassword: Joi.valid(Joi.ref('password')),
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

const checkDuplicateAccount = async (req, res, next) => {
  const { email } = req.body;
  try {
    const result = await User.get({ email });
    if (result.length > 0) {
      throw new AppError(`Email is already in use.`, 400);
    }

    return next();
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};

const validateRegister = {
  checkInput,
  checkDuplicateAccount,
};

export default validateRegister;
