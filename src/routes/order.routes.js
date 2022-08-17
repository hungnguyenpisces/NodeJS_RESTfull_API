import express from 'express';
import handleError from '../middlewares/error/handleError';
import auth from '../middlewares/user/auth';
import {
  createOrderCtrl,
  getOrderCtrl,
  getAllOrdersCtrl,
  updateOrderCtrl,
  softDeleteOrderCtrl,
} from '../controllers/order.controller';
import {
  checkInputCreateOrder,
  checkInputOrderNumber,
  checkInputUpdateOrder,
  checkQueryOrder,
  checkUser,
  checkCanUpdateOrDelete,
} from '../middlewares/order/validateOrder';
import validateUpdate from '../middlewares/payment/updatePayment';

const router = express.Router();

router.get(
  '/',
  [auth([1, 2, 3])],
  [checkQueryOrder],
  [handleError(getAllOrdersCtrl)],
);
router.post(
  '/',
  [auth([1, 2, 4])],
  [checkUser],
  [checkInputCreateOrder, handleError(createOrderCtrl)],
);
router.get(
  '/:orderNumber',
  [auth([1, 2, 3, 4])],
  [checkInputOrderNumber],
  [handleError(getOrderCtrl)],
);
router.patch(
  '/:orderNumber',
  [auth([1, 2, 3])],
  [checkInputOrderNumber, checkInputUpdateOrder],
  [handleError(checkCanUpdateOrDelete)],
  [handleError(updateOrderCtrl)],
);
router.delete(
  '/:orderNumber',
  [auth([1, 2, 3])],
  [handleError(validateUpdate.checkPayment), checkInputOrderNumber],
  [handleError(checkCanUpdateOrDelete)],
  [handleError(softDeleteOrderCtrl)],
);

export default router;
