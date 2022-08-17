import _ from 'lodash';
import { celebrate, Joi } from 'celebrate';
import AppError from '../error/AppError';
import Payment from '../../models/payment.model';
import Order from '../../models/order.model';

const paymentParamsSchema = {
  orderNumber: Joi.number().integer().positive().required(),
};

const paymentSchema = {
  paymentMethod: Joi.string().valid('Cash', 'COD', 'Momo').required(),
  amount: Joi.number().integer().positive().optional(),
  paymentDate: Joi.date().optional(),
  isPaid: Joi.number().valid(0, 1).optional(),
};

const checkInput = celebrate(
  {
    params: Joi.object().keys(paymentParamsSchema),
    query: Joi.object().keys(),
    body: Joi.object().keys(paymentSchema),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkUser = async (req, res, next) => {
  const { roleNumber } = res.locals.user;
  const { orderNumber } = req.params;
  let customerNumber;

  if (roleNumber === 4 && res.locals.user.customerNumber) {
    customerNumber = res.locals.user.customerNumber;
    if (Object.keys(req.body).length !== 1 || !req.body.paymentMethod) {
      throw new AppError(`You can only change the paymentMethod`, 403);
    }
    const result = await Order.getOne({ orderNumber, customerNumber });
    if (!result || _.isEmpty(result)) {
      throw new AppError(
        `You have no orders with orderNumber ${orderNumber}`,
        400,
      );
    }

    return next();
  }

  const result = await Order.getOne({ orderNumber });
  if (!result || _.isEmpty(result)) {
    throw new AppError(`orderNumber ${orderNumber} is incorrect`, 400);
  }

  return next();
};

const checkPayment = async (req, res, next) => {
  const { orderNumber } = req.params;
  try {
    const result = await Payment.getOne({ orderNumber });
    if (result.isPaid) {
      throw new AppError(`This order has already been paid`, 400);
    }

    return next();
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};

const validateUpdate = { checkInput, checkPayment, checkUser };

export default validateUpdate;
