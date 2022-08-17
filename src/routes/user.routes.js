import express from 'express';
import validateRegister from '../middlewares/user/validateRegister';
import validateLogin from '../middlewares/user/validateLogin';
import {
  userRegisterCtrl,
  userLoginCtrl,
  userVerifyCtrl,
} from '../controllers/user.controller';
import handleError from '../middlewares/error/handleError';

const router = express.Router();

router.post(
  '/customer/register',
  [
    validateRegister.checkInput,
    handleError(validateRegister.checkDuplicateAccount),
  ],
  handleError(userRegisterCtrl),
);

router.post(
  '/customer/login',
  [validateLogin.checkInput, handleError(validateLogin.checkPassword)],
  userLoginCtrl,
);

router.post(
  '/employee/login',
  [validateLogin.checkInput, handleError(validateLogin.checkPassword)],
  userLoginCtrl,
);

router.get('/verify/:verifyToken', handleError(userVerifyCtrl));

export default router;
