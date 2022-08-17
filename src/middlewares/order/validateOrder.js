import _, { now } from 'lodash';
import { celebrate, Joi } from 'celebrate';
import Order from '../../models/order.model';
import Payment from '../../models/payment.model';
import AppError from '../error/AppError';

const orderNumberSchema = {
  orderNumber: Joi.number().integer().positive().required(),
};

const orderSchema = {
  orderDate: Joi.date().required().default(new Date(now)),
  requiredDate: Joi.date()
    .ruleset.greater(Joi.ref('orderDate'))
    .rule({ message: 'requiredDate must be greater than orderDate' })
    .required(),
  ShippedDate: Joi.date().optional(),
  status: Joi.string()
    .min(3)
    .max(15)
    .required()
    .valid(
      'Shipped',
      'Resolved',
      'On Hold',
      'Disputed',
      'In Process',
      'Cancelled',
    )
    .default('In Process'),
  comments: Joi.string().min(10).max(50).optional().allow('').allow(null),
  customerNumber: Joi.number().optional(),
};

const checkInputOrder = celebrate(
  {
    params: Joi.object().keys(),
    query: Joi.object().keys(),
    body: Joi.object().keys(orderSchema),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkInputUpdateOrder = celebrate(
  {
    params: Joi.object().keys(),
    query: Joi.object().keys(),
    body: Joi.object().keys({
      requiredDate: Joi.date()
        .ruleset.greater(Joi.ref('orderDate'))
        .rule({ message: 'requiredDate must be greater than orderDate' })
        .optional(),
      ShippedDate: Joi.date().optional(),
      status: Joi.string()
        .min(3)
        .max(15)
        .optional()
        .valid(
          'Shipped',
          'Resolved',
          'On Hold',
          'Disputed',
          'In Process',
          'Cancelled',
        ),
      comments: Joi.string().min(10).max(50).optional().allow('').allow(null),
    }),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkInputOrderNumber = celebrate(
  {
    params: Joi.object().keys(orderNumberSchema),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkQueryOrder = celebrate(
  {
    query: Joi.object().keys({
      orderDate: Joi.date().optional(),
      requiredDate: Joi.date().optional(),
      ShippedDate: Joi.date().optional(),
      status: Joi.string().optional(),
      comments: Joi.string().optional(),
      customerNumber: Joi.number().optional(),
    }),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const transProductAndDetail = {
  orderLineNumber: Joi.number().integer(),
  products: Joi.array()
    .items({
      productCode: Joi.string(),
      quantityOrdered: Joi.number().integer(),
    })
    .required(),
  payment: Joi.object({
    amount: Joi.number().integer().required(),
    paymentDate: Joi.date().required(),
    paymentMethod: Joi.string().required(),
  }),
};
_.merge(transProductAndDetail, orderSchema);

const checkInputCreateOrder = celebrate(
  {
    params: Joi.object().keys(),
    query: Joi.object().keys(),
    body: Joi.object().keys(transProductAndDetail),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkDupOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.body;
    const order = await Order.query().findById(orderNumber);

    if (order) {
      throw new AppError('Order is already exist', 400);
    }

    return next();
  } catch (error) {
    throw new AppError(
      error.message
        ? error.message
        : `ERROR @Order.checkDupOrder: Internal Server Error`,
      error.statusCode ? error.statusCode : 500,
    );
  }
};

const checkCanUpdateOrDelete = async (req, res, next) => {
  const { orderNumber } = req.params;

  try {
    const order = await Order.getOne({ orderNumber });

    if (order.status === 'Shipped') {
      throw new AppError('This order cannot be updated', 400);
    }

    const payment = await Payment.getOne({ orderNumber });

    if (payment.isPaid) {
      throw new AppError(`This order has already been paid`, 400);
    }

    return next();
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};

const checkUser = (req, res, next) => {
  const { roleNumber, customerNumber } = res.locals.user;

  if (roleNumber === 4 && customerNumber) {
    if (req.body.customerNumber) {
      throw new AppError(`The customerNumber field is not required`, 400);
    }
    req.body.customerNumber = customerNumber;

    return next();
  }

  if (!req.body.customerNumber) {
    throw new AppError(`The customerNumber field is required`, 400);
  }

  return next();
};

export {
  checkInputOrder,
  checkInputOrderNumber,
  checkInputCreateOrder,
  checkDupOrder,
  checkInputUpdateOrder,
  checkQueryOrder,
  checkUser,
  checkCanUpdateOrDelete,
};
