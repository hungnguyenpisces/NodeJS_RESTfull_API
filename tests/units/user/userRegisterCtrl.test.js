import { expect, assert } from 'chai';
import Sinon from 'sinon';
import { userRegisterCtrl } from '../../../src/controllers/user.controller';
import {
  userMock,
  customerMock,
} from '../../mock_data/user/userRegisterCtrl.mock';
import Customer from '../../../src/models/customer.model';
import User from '../../../src/models/user.model';
import * as sendMail from '../../../src/services/sendEmail';

let res;

describe('userRegisterCtrl', () => {
  before(() => {
    res = {
      status: (code) => {
        return {
          json: (arg) => {
            return {
              status: code,
              data: arg.data,
            };
          },
        };
      },
    };
  });
  afterEach(() => {
    Sinon.restore();
  });
  it('Success', async () => {
    const insertUserMock = Sinon.fake.returns(Promise.resolve(userMock));
    const queryUserMock = () => {
      return {
        insert: insertUserMock,
      };
    };
    Sinon.replace(User, 'query', queryUserMock);

    const insertCustomerMock = Sinon.fake.returns(
      Promise.resolve(customerMock),
    );
    const queryCustomerMock = () => {
      return {
        insert: insertCustomerMock,
      };
    };
    Sinon.replace(Customer, 'query', queryCustomerMock);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(User, 'transaction', transactionMock);

    const req = {
      body: {
        email: '17521051@gm.uit.edu.vn',
        password: 'Abcd@1234',
        confirmPassword: 'Abcd@1234',
        customerName: 'ThanhND76',
        contactLastName: 'Nguyen',
        contactFirstName: 'Dang Thanh',
        phone: '0123456789',
        addressLine1: 'Address Line 1',
        city: 'Hanoi',
        postalCode: '100000',
        country: 'Vietnam',
        creditLimit: 123,
      },
    };

    const sendMailMock = Sinon.fake.returns(Promise.resolve(true));
    Sinon.replace(sendMail, 'default', sendMailMock);

    const result = await userRegisterCtrl(req, res);

    assert(insertUserMock.calledOnce);
    assert(insertCustomerMock.calledOnce);
    assert(sendMailMock.calledOnce);

    expect(result.status).to.equal(201);
    expect(result.data).to.eql({
      email: '17521051@gm.uit.edu.vn',
      userNumber: 1,
      customerName: 'ThanhND76',
      contactLastName: 'Nguyen',
      contactFirstName: 'Dang Thanh',
      phone: '0123456789',
      addressLine1: 'Address Line 1',
      city: 'Hanoi',
      postalCode: '100000',
      country: 'Vietnam',
      creditLimit: 123,
      customerNumber: 1,
    });
  });

  it('Create user: Create user failed.', async () => {
    const insertUserMock = Sinon.fake.throws(new Error());
    const queryUserMock = () => {
      return {
        insert: insertUserMock,
      };
    };
    Sinon.replace(User, 'query', queryUserMock);

    const insertCustomerMock = Sinon.fake.returns(
      Promise.resolve(customerMock),
    );
    const queryCustomerMock = () => {
      return {
        insert: insertCustomerMock,
      };
    };
    Sinon.replace(Customer, 'query', queryCustomerMock);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(User, 'transaction', transactionMock);

    const req = {
      body: {
        email: '17521051@gm.uit.edu.vn',
        password: 'Abcd@1234',
        confirmPassword: 'Abcd@1234',
        customerName: 'ThanhND76',
        contactLastName: 'Nguyen',
        contactFirstName: 'Dang Thanh',
        phone: '0123456789',
        addressLine1: 'Address Line 1',
        city: 'Hanoi',
        postalCode: '100000',
        country: 'Vietnam',
        creditLimit: 123,
      },
    };

    const sendMailMock = Sinon.fake.returns(Promise.resolve(true));
    Sinon.replace(sendMail, 'default', sendMailMock);

    try {
      await userRegisterCtrl(req, res);
    } catch (error) {
      assert(insertUserMock.calledOnce);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql('Create user failed.');
    }
  });

  it('Create user: Create customer fail', async () => {
    const insertUserMock = Sinon.fake.returns(Promise.resolve(userMock));
    const queryUserMock = () => {
      return {
        insert: insertUserMock,
      };
    };
    Sinon.replace(User, 'query', queryUserMock);

    const insertCustomerMock = Sinon.fake.throws(new Error());
    const queryCustomerMock = () => {
      return {
        insert: insertCustomerMock,
      };
    };
    Sinon.replace(Customer, 'query', queryCustomerMock);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(User, 'transaction', transactionMock);

    const req = {
      body: {
        email: '17521051@gm.uit.edu.vn',
        password: 'Abcd@1234',
        confirmPassword: 'Abcd@1234',
        customerName: 'ThanhND76',
        contactLastName: 'Nguyen',
        contactFirstName: 'Dang Thanh',
        phone: '0123456789',
        addressLine1: 'Address Line 1',
        city: 'Hanoi',
        postalCode: '100000',
        country: 'Vietnam',
        creditLimit: 123,
      },
    };

    const sendMailMock = Sinon.fake.returns(Promise.resolve(true));
    Sinon.replace(sendMail, 'default', sendMailMock);

    try {
      await userRegisterCtrl(req, res);
    } catch (error) {
      assert(insertUserMock.calledOnce);
      assert(insertCustomerMock.calledOnce);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql('Create user failed.');
    }
  });

  it('Create user: Create user & customer fail', async () => {
    const insertUserMock = Sinon.fake.returns(Promise.resolve({}));
    const queryUserMock = () => {
      return {
        insert: insertUserMock,
      };
    };
    Sinon.replace(User, 'query', queryUserMock);

    const insertCustomerMock = Sinon.fake.returns(Promise.resolve({}));
    const queryCustomerMock = () => {
      return {
        insert: insertCustomerMock,
      };
    };
    Sinon.replace(Customer, 'query', queryCustomerMock);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(User, 'transaction', transactionMock);

    const req = {
      body: {
        email: '17521051@gm.uit.edu.vn',
        password: 'Abcd@1234',
        confirmPassword: 'Abcd@1234',
        customerName: 'ThanhND76',
        contactLastName: 'Nguyen',
        contactFirstName: 'Dang Thanh',
        phone: '0123456789',
        addressLine1: 'Address Line 1',
        city: 'Hanoi',
        postalCode: '100000',
        country: 'Vietnam',
        creditLimit: 123,
      },
    };

    const sendMailMock = Sinon.fake.returns(Promise.resolve(true));
    Sinon.replace(sendMail, 'default', sendMailMock);

    try {
      await userRegisterCtrl(req, res);
    } catch (error) {
      assert(insertUserMock.calledOnce);
      assert(insertCustomerMock.calledOnce);
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql('Create user failed.');
    }
  });

  it('Send verification email fail', async () => {
    const insertUserMock = Sinon.fake.returns(Promise.resolve(userMock));
    const queryUserMock = () => {
      return {
        insert: insertUserMock,
      };
    };
    Sinon.replace(User, 'query', queryUserMock);

    const insertCustomerMock = Sinon.fake.returns(
      Promise.resolve(customerMock),
    );
    const queryCustomerMock = () => {
      return {
        insert: insertCustomerMock,
      };
    };
    Sinon.replace(Customer, 'query', queryCustomerMock);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(User, 'transaction', transactionMock);

    const req = {
      body: {
        email: '17521051@gm.uit.edu.vn',
        password: 'Abcd@1234',
        confirmPassword: 'Abcd@1234',
        customerName: 'ThanhND76',
        contactLastName: 'Nguyen',
        contactFirstName: 'Dang Thanh',
        phone: '0123456789',
        addressLine1: 'Address Line 1',
        city: 'Hanoi',
        postalCode: '100000',
        country: 'Vietnam',
        creditLimit: 123,
      },
    };

    const sendMailMock = Sinon.fake.throws(new Error());
    Sinon.replace(sendMail, 'default', sendMailMock);

    try {
      await userRegisterCtrl(req, res);
      assert(insertUserMock.calledOnce);
      assert(insertCustomerMock.calledOnce);
      assert(sendMailMock.calledOnce);
    } catch (error) {
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql('Send verification email fail.');
    }
  });
});
