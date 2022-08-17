import Sinon from 'sinon';
import { expect, assert } from 'chai';
import { deleteCustomerCtrl } from '../../../src/controllers/customer.controller';
import Customer from '../../../src/models/customer.model';
import { customerDataMock } from '../../mock_data/customer.mock';

describe('Test deleteCustomerCtrl', () => {
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

  afterEach(() => Sinon.restore());

  it('Case: deleteCustomerCtrl successfully', async () => {
    const patchAndFetchById = Sinon.fake.returns(
      Promise.resolve(customerDataMock),
    );
    const dataCustomer = () => ({ patchAndFetchById });

    Sinon.replace(Customer, 'query', dataCustomer);

    req = {
      params: {
        customerNumber: 1,
      },
    };

    const result = await deleteCustomerCtrl(req, res);

    assert(patchAndFetchById.called);
    assert(patchAndFetchById.calledWith(1));
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({ message: 'Deleted' });
  });

  it('Case: No customer has been deleted', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.resolve(null));
    const dataCustomer = () => ({ patchAndFetchById });

    Sinon.replace(Customer, 'query', dataCustomer);

    req = {
      params: {
        customerNumber: 999,
      },
      body: {
        customerName: 'Atelier fixed',
        contactLastName: 'Schmitt',
        contactFirstName: 'Carine',
      },
    };

    const result = await deleteCustomerCtrl(req, res);

    assert(patchAndFetchById.called);
    expect(result.status).to.eql(200);
    expect(result.data).to.eql({
      message: 'No customer has been deleted',
    });
  });

  it('Case: deleteCustomer Internal Server Error', async () => {
    const patchAndFetchById = Sinon.fake.returns(Promise.reject(new Error()));
    const dataCustomer = () => ({ patchAndFetchById });

    Sinon.replace(Customer, 'query', dataCustomer);

    req = {
      params: {
        customerNumber: 1,
      },
    };

    try {
      await deleteCustomerCtrl(req, res);
    } catch (error) {
      assert(patchAndFetchById.called);
      assert(patchAndFetchById.calledWith(1));
      expect(error.message).to.eql(
        'ERROR @Customer.update: Internal Server Error',
      );
    }
  });
});
