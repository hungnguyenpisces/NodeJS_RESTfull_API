import { expect } from 'chai';
import Sinon from 'sinon';
import { checkUser } from '../../../src/middlewares/order/validateOrder';

let res;
describe('Test function checkUser', () => {
  before(() => {
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
      locals: { user: null },
    };
  });
  afterEach(() => {
    Sinon.restore();
  });
  it('Customer: The customerNumber field is not required', async () => {
    const next = Sinon.spy();
    const req = {
      body: {
        customerNumber: 123,
        comments: null,
        orderDate: '2021-12-21',
        requiredDate: '2021-12-22',
        status: 'In Process',
        orderLineNumber: 3,
        products: [
          {
            productCode: 'S10_1678',
            quantityOrdered: 6,
          },
        ],
        payment: {
          amount: 9999,
          paymentDate: '2021-12-21',
          paymentMethod: 'COD',
        },
      },
    };
    res.locals.user = { roleNumber: 4, customerNumber: 1 };
    try {
      await checkUser(req, res, next);
    } catch (error) {
      expect(error.statusCode).to.eql(400);
      expect(error.message).to.eql('The customerNumber field is not required');
    }
  });

  it('Emoloyee: The customerNumber field is required', async () => {
    const next = Sinon.spy();
    const req = {
      body: {
        comments: null,
        orderDate: '2021-12-21',
        requiredDate: '2021-12-22',
        status: 'In Process',
        orderLineNumber: 3,
        products: [
          {
            productCode: 'S10_1678',
            quantityOrdered: 6,
          },
        ],
        payment: {
          amount: 9999,
          paymentDate: '2021-12-21',
          paymentMethod: 'COD',
        },
      },
    };
    res.locals.user = { roleNumber: 1, customerNumber: null };
    try {
      await checkUser(req, res, next);
    } catch (error) {
      expect(error.statusCode).to.eql(400);
      expect(error.message).to.eql('The customerNumber field is required');
    }
  });

  it('Customer: Success', async () => {
    const next = Sinon.spy();
    const req = {
      body: {
        comments: null,
        orderDate: '2021-12-21',
        requiredDate: '2021-12-22',
        status: 'In Process',
        orderLineNumber: 3,
        products: [
          {
            productCode: 'S10_1678',
            quantityOrdered: 6,
          },
        ],
        payment: {
          amount: 9999,
          paymentDate: '2021-12-21',
          paymentMethod: 'COD',
        },
      },
    };
    res.locals.user = { roleNumber: 4, customerNumber: 1 };
    await checkUser(req, res, next);
    expect(next.calledOnce);
  });

  it('Employee: Success', async () => {
    const next = Sinon.spy();
    const req = {
      body: {
        customerNumber: 1,
        comments: null,
        orderDate: '2021-12-21',
        requiredDate: '2021-12-22',
        status: 'In Process',
        orderLineNumber: 3,
        products: [
          {
            productCode: 'S10_1678',
            quantityOrdered: 6,
          },
        ],
        payment: {
          amount: 9999,
          paymentDate: '2021-12-21',
          paymentMethod: 'COD',
        },
      },
    };
    res.locals.user = { roleNumber: 1, customerNumber: null };
    await checkUser(req, res, next);
    expect(next.calledOnce);
  });
});
