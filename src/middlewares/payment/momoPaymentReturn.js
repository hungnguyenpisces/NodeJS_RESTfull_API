import _ from 'lodash';
import { celebrate, Joi } from 'celebrate';
import dotenv from 'dotenv';
import AppError from '../error/AppError';
import Payment from '../../models/payment.model';

dotenv.config();

const paymentSchema = {
  partnerCode: Joi.string().valid(process.env.MOMO_PARTNER_CODE).required(),
  orderId: Joi.string().required(),
  requestId: Joi.string().required(),
  amount: '2000',
  orderInfo: Joi.string().required(),
  orderType: Joi.string().required(),
  transId: '2629906956',
  resultCode: '0',
  message: Joi.string().required(),
  payType: Joi.string().required(),
  responseTime: '1640502366700',
  extraData: Joi.string().required(),
  signature: Joi.string().required(),
};

const checkInput = celebrate(
  {
    params: Joi.object().keys(),
    query: Joi.object().keys(paymentSchema),
    body: Joi.object().keys(),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkPayment = async (req, res, next) => {
  const { orderId: orderNumber, signature } = req.query;
  try {
    const result = await Payment.getOne({ orderNumber });
    if (_.isEmpty(result)) {
      throw new AppError(`orderNumber is incorrect`, 401);
    }
    if (result.secureHash !== signature) {
      throw new AppError(`Signature is incorrect`, 401);
    }

    return next();
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
};

const validateMomoReturn = { checkInput, checkPayment };

export default validateMomoReturn;
