import Sinon from 'sinon';
import { expect, assert } from 'chai';
import { updateCustomerCtrl } from '../../../src/controllers/customer.controller';
import Customer from '../../../src/models/customer.model';
import { customerDataMock } from '../../mock_data/customer.mock';

describe('Test updateCustomerCtrl', () => {
  let req;
  let res;

  beforeEach(() => {
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
      locals: {
        user: {
          roleNumber: 1,
          customerNumber: null,
        },
      },
    };
  });

  afterEach(() => Sinon.restore());

  it('Case: updateCustomerCtrl successfully by admin', async () => {
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(customerDataMock),
    );
    const dataCustomer = () => ({ patchAndFetchById });

    Sinon.replace(Customer, 'query', dataCustomer);

    req = {
      params: {
        customerNumber: 1,
      },
      body: {
        customerName: 'Atelier fixed',
        contactLastName: 'Schmitt',
        contactFirstName: 'Carine',
      },
    };

    const result = await updateCustomerCtrl(req, res);

    assert(patchAndFetchById.called);
    assert(patchAndFetchById.calledWith(1, req.body));
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'Success',
      data: customerDataMock,
    });
  });

  it('Case: updateCustomerCtrl successfully by customer', async () => {
    res.locals.user.roleNumber = 4;
    res.locals.user.customerNumber = 1;
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(customerDataMock),
    );
    const dataCustomer = () => ({ patchAndFetchById });

    Sinon.replace(Customer, 'query', dataCustomer);

    req = {
      params: {
        customerNumber: 1,
      },
      body: {
        customerName: 'Atelier fixed',
        contactLastName: 'Schmitt',
        contactFirstName: 'Carine',
      },
    };

    const result = await updateCustomerCtrl(req, res);

    assert(patchAndFetchById.called);
    assert(patchAndFetchById.calledWith(1, req.body));
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'Success',
      data: customerDataMock,
    });
  });

  it('Case: Unauthorized: your customerNumber is not match', async () => {
    res.locals.user.roleNumber = 4;
    res.locals.user.customerNumber = 2;
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(customerDataMock),
    );
    const dataCustomer = () => ({ patchAndFetchById });

    Sinon.replace(Customer, 'query', dataCustomer);

    req = {
      params: {
        customerNumber: 1,
      },
      body: {
        customerName: 'Atelier fixed',
        contactLastName: 'Schmitt',
        contactFirstName: 'Carine',
      },
    };

    const result = await updateCustomerCtrl(req, res);

    expect(result.status).to.eql(401);
    expect(result.data).to.eql({
      message: 'Unauthorized: your customerNumber is not match',
    });
  });

  it('Case: No customer has been updated', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve(null));
    const dataCustomer = () => ({ patchAndFetchById });

    Sinon.replace(Customer, 'query', dataCustomer);

    req = {
      params: {
        customerNumber: 1,
      },
      body: {
        customerName: 'Atelier fixed',
        contactLastName: 'Schmitt',
        contactFirstName: 'Carine',
      },
    };

    const result = await updateCustomerCtrl(req, res);

    assert(patchAndFetchById.called);
    assert(patchAndFetchById.calledWith(1, req.body));
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'No customer has been updated',
    });
  });

  it('Case: ERROR @Customer.update: Internal Server Error', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.reject(new Error()));
    const dataCustomer = () => ({ patchAndFetchById });

    Sinon.replace(Customer, 'query', dataCustomer);

    req = {
      params: {
        customerNumber: 11,
      },
      body: {
        customerName: 'Atelier fixed',
        contactLastName: 'Schmitt',
        contactFirstName: 'Carine',
      },
    };

    try {
      await updateCustomerCtrl(req, res);
    } catch (error) {
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith(11, req.body));
      expect(error.message).to.eql(
        'ERROR @Customer.update: Internal Server Error',
      );
    }
  });
});
