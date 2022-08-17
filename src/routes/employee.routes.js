import express from 'express';
import auth from '../middlewares/user/auth';
import {
  getAllEmployeesCtrl,
  getEmployeeWithCustomerCtrl,
  createEmployeeCtrl,
  updateEmployeeCtrl,
  deleteEmployeeCtrl,
} from '../controllers/employee.controller';
import {
  createEmployeeValidate,
  checkDuplicateEmployee,
  updateEmployeeValidate,
  queryEmployeeValidate,
  paramsEmployeeValidate,
} from '../middlewares/employee/validateEmployee';
import handleError from '../middlewares/error/handleError';

const router = express.Router();

router.get(
  '/',
  [auth([1, 2]), queryEmployeeValidate],
  handleError(getAllEmployeesCtrl),
);
router.get(
  '/:employeeNumber',
  [auth([1, 2]), paramsEmployeeValidate],
  handleError(getEmployeeWithCustomerCtrl),
);
router.post(
  '/',
  [auth([1, 2]), createEmployeeValidate, handleError(checkDuplicateEmployee)],
  handleError(createEmployeeCtrl),
);
router.put(
  '/:employeeNumber',
  [auth([1, 2]), updateEmployeeValidate],
  handleError(updateEmployeeCtrl),
);
router.delete(
  '/:employeeNumber',
  [auth([1]), paramsEmployeeValidate],
  handleError(deleteEmployeeCtrl),
);

export default router;
