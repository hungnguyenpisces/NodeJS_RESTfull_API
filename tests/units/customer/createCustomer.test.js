import Sinon from 'sinon';
import { expect } from 'chai';
import { createCustomerCtrl } from '../../../src/controllers/customer.controller';
import Customer from '../../../src/models/customer.model';
import User from '../../../src/models/user.model';
import {
  customerTrancsInput,
  customerTrancsSucces,
} from '../../mock_data/customer.mock';

describe('Test create Customer', async () => {
  let req;
  let res;

  before(() => {
    req = {};
    res = {
      status: (code) => {
        return {
          json: (data) => {
            return {
              status: code,
              data,
            };
          },
        };
      },
    };
  });

  afterEach(() => {
    Sinon.restore();
  });

  it('Case: Customer created successfully', async () => {
    const userDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(customerTrancsSucces.user)),
    });
    const customerDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(customerTrancsSucces.customer),
      ),
    });

    Sinon.replace(Customer, 'query', customerDataMock);
    Sinon.replace(User, 'query', userDataMock);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(Customer, 'transaction', transactionMock);

    req = {
      body: customerTrancsInput,
    };

    const result = await createCustomerCtrl(req, res);

    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Customer created successfully',
      data: customerTrancsSucces,
    });
  });

  it('Case: ERROR @Customer.transaction: Create user failed', async () => {
    const userDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve({})),
    });
    const customerDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve({})),
    });

    Sinon.replace(Customer, 'query', customerDataMock);
    Sinon.replace(User, 'query', userDataMock);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(Customer, 'transaction', transactionMock);

    req = {
      body: customerTrancsInput,
    };

    try {
      await createCustomerCtrl(req, res);
    } catch (error) {
      expect(error.statusCode).to.equal(400);
      expect(error.message).to.eql(
        'ERROR @Customer.transaction: Create user failed',
      );
    }
  });

  it('Case: ERROR @Customer.transaction: Create customer failed', async () => {
    const userDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(customerTrancsSucces.user)),
    });
    const customerDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve({})),
    });

    Sinon.replace(Customer, 'query', customerDataMock);
    Sinon.replace(User, 'query', userDataMock);

    const transactionMock = (callback) => {
      const result = callback();

      return result;
    };

    Sinon.replace(Customer, 'transaction', transactionMock);

    req = {
      body: customerTrancsInput,
    };

    try {
      await createCustomerCtrl(req, res);
    } catch (error) {
      expect(error.statusCode).to.equal(400);
      expect(error.message).to.eql(
        'ERROR @Customer.transaction: Create customer failed',
      );
    }
  });

  it('Case: ERROR @Customer.transaction: Something went wrong', async () => {
    const customerDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(customerTrancsSucces.customer),
      ),
    });
    const userDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(customerTrancsSucces.user)),
    });

    Sinon.replace(Customer, 'query', customerDataMock);
    Sinon.replace(User, 'query', userDataMock);

    const transactionMock = () => {
      return new Error();
    };

    Sinon.replace(Customer, 'transaction', transactionMock);

    req = {
      body: customerTrancsInput,
    };

    try {
      await createCustomerCtrl(req, res);
    } catch (error) {
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql(
        'ERROR @Customer.transaction: Something went wrong',
      );
    }
  });
});
