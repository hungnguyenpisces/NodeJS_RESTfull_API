import dotenv from 'dotenv';
import _ from 'lodash';
import generateRandomToken from '../helpers/generateRandomToken';
import generateAccessToken from '../helpers/generateAccessToken';
import sendMail from '../services/sendEmail';
import AppError from '../middlewares/error/AppError';
import User from '../models/user.model';
import hashPassword from '../helpers/hashPassword';
import Customer from '../models/customer.model';

dotenv.config();

const userRegisterCtrl = async (req, res) => {
  const data = req.body;
  delete data.confirmPassword;
  data.password = hashPassword(data.password);
  const { email, password, ...rest } = data;

  const verifyToken = generateRandomToken();
  const dataUser = { email, password, verifyToken };

  const dataCustomer = { ...rest };

  try {
    const result = await User.transaction(async (trx) => {
      const user = await User.query(trx).insert(dataUser);

      const customer = await Customer.query(trx).insert({
        userNumber: user.userNumber,
        ...dataCustomer,
      });

      delete user.password;
      delete user.verifyToken;
      delete customer.userNumber;

      return { ...user, ...customer };
    });

    const restOfOptions = {
      to: email,
      subject: 'Verify your account',
    };
    const templateVars = {
      firstName: dataCustomer.contactFirstName,
      link: `http://${process.env.HOST}:${process.env.PORT}/api/users/verify/${verifyToken}`,
    };

    if (_.isEmpty(result)) {
      throw new AppError(`Create user failed.`, 500);
    }

    try {
      await sendMail({
        template: 'verifyAccount',
        templateVars,
        ...restOfOptions,
      });

      return res.status(201).json({ data: result });
    } catch (error) {
      throw new AppError('Send verification email fail.', 500);
    }
  } catch (error) {
    throw new AppError(
      error.message ? error.message : `Create user failed.`,
      error.statusCode || 500,
    );
  }
};

const userVerifyCtrl = async (req, res) => {
  const { verifyToken } = req.params;
  try {
    await User.update(
      { verifyToken },
      {
        isVerified: 1,
        verifyToken: null,
      },
    );

    return res.redirect(301, 'https://www.google.com.vn/');
  } catch (error) {
    return res.redirect(301, 'https://www.facebook.com/');
  }
};

const userLoginCtrl = (req, res) => {
  const result = generateAccessToken(res.locals.user);

  return res.status(200).json({ data: { accessToken: result } });
};

export { userRegisterCtrl, userLoginCtrl, userVerifyCtrl };
