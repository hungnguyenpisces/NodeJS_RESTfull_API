import express from 'express';
import {
  createProductLineCtrl,
  // deleteProductLineCtrl,
  getAllProductLinesCtrl,
  getProductLineCtrl,
  updateProductLineCtrl,
} from '../controllers/productLine.controller';
import handleError from '../middlewares/error/handleError';
import {
  checkInput,
  checkIdInput,
  checkDupProductLine,
  checkIdInputBody,
  checkQuery,
} from '../middlewares/productLine/validateProductLine';
import auth from '../middlewares/user/auth';

const router = express.Router();

router.get(
  '/',
  [auth([1, 2, 3, 4]), checkQuery],
  handleError(getAllProductLinesCtrl),
);
router.get(
  '/:productLine',
  [checkIdInput, auth([1, 2, 3, 4])],
  handleError(getProductLineCtrl),
);
router.post(
  '/',
  [checkIdInputBody, auth([1, 2, 3]), handleError(checkDupProductLine)],
  handleError(createProductLineCtrl),
);
router.patch(
  '/:productLine',
  [checkIdInput, auth([1, 2, 3]), checkInput],
  handleError(updateProductLineCtrl),
);
// router.delete(
//   '/:productLine',
//   [checkIdInput],
//   handleError(deleteProductLineCtrl),
// );

export default router;
