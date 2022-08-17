import { celebrate, Joi } from 'celebrate';
import OrderDetail from '../../models/orderDetail.model';
import AppError from '../error/AppError';

const orderDetailKeySchema = {
  orderNumber: Joi.number().integer().positive().required(),
  productCode: Joi.string().min(2).max(15).optional(),
};

const inputDataSchema = {
  quantityOrdered: Joi.number().integer().positive().optional(),
  priceEach: Joi.number().optional(),
  orderLineNumber: Joi.number().integer().positive().optional(),
};

const checkQueryInput = celebrate(
  {
    query: Joi.object().keys(inputDataSchema),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checDataUpdate = celebrate(
  {
    params: Joi.object().keys(orderDetailKeySchema),
    query: Joi.object().keys(inputDataSchema),
    body: Joi.object().keys(inputDataSchema),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkDupOrderDetail = async (req, res, next) => {
  try {
    const { orderNumber, productCode } = req.body;
    const orderDetail = await OrderDetail.query().findById(
      orderNumber,
      productCode,
    );

    if (orderDetail) {
      throw new AppError('OrderDetail is already exist', 400);
    }

    return next();
  } catch (error) {
    throw new AppError(
      error.message
        ? error.message
        : `ERROR @OrderDetail.checkDupOrderDetail: Internal Server Error`,
      error.statusCode ? error.statusCode : 500,
    );
  }
};

export { checkQueryInput, checDataUpdate, checkDupOrderDetail };
