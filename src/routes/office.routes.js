import express from 'express';
import auth from '../middlewares/user/auth';
import {
  getAllOfficesCtrl,
  updateOfficeCtrl,
  createOfficeCtrl,
  getOfficeWithEmployee,
} from '../controllers/office.controller';
import {
  createOfficeValidate,
  updateOrParamOfficeValidate,
  queryOfficeValidate,
  checkDuplicateOffice,
} from '../middlewares/office/validateOffice';
import handleError from '../middlewares/error/handleError';

const router = express.Router();

router.get(
  '/',
  [auth([1]), queryOfficeValidate],
  handleError(getAllOfficesCtrl),
);
router.get(
  '/:officeCode',
  [auth([1]), updateOrParamOfficeValidate],
  handleError(getOfficeWithEmployee),
);
router.post(
  '/',
  [auth([1]), createOfficeValidate, handleError(checkDuplicateOffice)],
  handleError(createOfficeCtrl),
);
router.put(
  '/:officeCode',
  [auth([1]), updateOrParamOfficeValidate],
  handleError(updateOfficeCtrl),
);

export default router;
