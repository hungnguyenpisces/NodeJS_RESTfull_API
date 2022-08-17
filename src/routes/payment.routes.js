import express from 'express';
import {
  updatePaymentCtrl,
  momoPaymentReturnCtrl,
} from '../controllers/payment.controller';
import handleError from '../middlewares/error/handleError';
import auth from '../middlewares/user/auth';
import validateUpdate from '../middlewares/payment/updatePayment';

const router = express.Router();

router.patch(
  '/:orderNumber',
  [
    auth([1, 2, 3, 4]),
    validateUpdate.checkInput,
    handleError(validateUpdate.checkUser),
    handleError(validateUpdate.checkPayment),
  ],
  handleError(updatePaymentCtrl),
);

router.get('/momo_payment_return', handleError(momoPaymentReturnCtrl));

export default router;
