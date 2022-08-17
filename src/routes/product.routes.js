import express from 'express';
import {
  getAllProductsCtrl,
  createProductCtrl,
  updateProductCtrl,
  softDeleteCtrl,
} from '../controllers/product.controller';
import {
  checkDupProduct,
  checkIdInput,
  checkInput,
  checkNoCode,
  checkQuery,
} from '../middlewares/product/validateProduct';
import handleError from '../middlewares/error/handleError';
import checkProductLine from '../middlewares/product/checkProductLine';
import auth from '../middlewares/user/auth';

const router = express.Router();

router.get(
  '/',
  [auth([1, 2, 3, 4]), checkQuery],
  handleError(getAllProductsCtrl),
);
// router.get('/:productCode',handleError(get))
router.post(
  '/',
  [
    auth([1, 2, 3]),
    handleError(checkDupProduct),
    checkInput,
    handleError(checkProductLine),
  ],
  handleError(createProductCtrl),
); // middleware checkProductLine

router.patch(
  '/:productCode',
  [checkIdInput, auth([1, 2, 3]), checkNoCode],
  handleError(updateProductCtrl),
);

router.delete(
  '/:productCode',
  [checkIdInput, auth([1, 2, 3])],
  handleError(softDeleteCtrl),
);

export default router;
