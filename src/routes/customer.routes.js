import express from 'express';
import handleError from '../middlewares/error/handleError';
import auth from '../middlewares/user/auth';
import {
  createCustomerCtrl,
  deleteCustomerCtrl,
  getCustomerWithOrderCtrl,
  updateCustomerCtrl,
  getAllCustomersCtrl,
} from '../controllers/customer.controller';
import {
  checkInputQueryOrUpdate,
  checkIdInput,
  checkCreateCustomer,
  checkSaleRepInput,
} from '../middlewares/customer/validateCustomer';
import validateRegister from '../middlewares/user/validateRegister';

const router = express.Router();

router.get(
  '/',
  [auth([1, 2, 3])],
  [checkInputQueryOrUpdate],
  [handleError(getAllCustomersCtrl)],
);
router.get(
  '/:customerNumber',
  [auth([1, 2, 3, 4])],
  [checkIdInput],
  [handleError(getCustomerWithOrderCtrl)],
);
router.post(
  '/',
  [auth([1])],
  [checkCreateCustomer],
  [handleError(validateRegister.checkDuplicateAccount)],
  [handleError(checkSaleRepInput)],
  [handleError(createCustomerCtrl)],
);
router.put(
  '/:customerNumber',
  [auth([1, 4])],
  [checkIdInput, checkInputQueryOrUpdate],
  [handleError(updateCustomerCtrl)],
);
router.delete(
  '/:customerNumber',
  [auth([1])],
  [checkIdInput],
  [handleError(deleteCustomerCtrl)],
);

export default router;
