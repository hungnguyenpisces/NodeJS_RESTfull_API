import Sinon from 'sinon';
import { expect, assert } from 'chai';
import Order from '../../../src/models/order.model';
import Payment from '../../../src/models/payment.model';
import { createOrderCtrl } from '../../../src/controllers/order.controller';
import OrderDetail from '../../../src/models/orderDetail.model';
import {
  productMock,
  orderAndPaymentCashMock,
  orderAndPaymentCODMock,
  orderAndPaymentMomoMock,
} from '../../mock_data/order.mock';
import Product from '../../../src/models/product.model';
import * as payWithMomo from '../../../src/services/payWithMomo';
import resultMomoMock from '../../mock_data/payment/updatePaymentCtrl.mock';

describe('Test create Order', async () => {
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
      redirect: (status, link) => {
        return {
          status,
          link,
        };
      },
    };
  });

  afterEach(() => {
    Sinon.restore();
  });

  it('Created successfully: Order & Payment with Cash', async () => {
    const orderDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(orderAndPaymentCashMock)),
    });
    const paymentDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentCashMock.payment),
      ),
    });
    const orderDetailDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentCashMock.products),
      ),
    });

    const whereProductMock = Sinon.fake.returns(Promise.resolve(1));
    const mockGetProduct = Sinon.fake.returns(Promise.resolve(productMock));
    const queryProductMock = () => {
      return {
        patch: () => {
          return {
            where: whereProductMock,
          };
        },
        select: () => {
          return {
            findById: mockGetProduct,
          };
        },
      };
    };

    Sinon.replace(Order, 'query', orderDataMock);
    Sinon.replace(OrderDetail, 'query', orderDetailDataMock);
    Sinon.replace(Product, 'query', queryProductMock);
    Sinon.replace(Payment, 'query', paymentDataMock);

    const transactionMock = (callback) => {
      const transResult = callback();

      return transResult;
    };

    Sinon.replace(Order, 'transaction', transactionMock);

    req = {
      body: orderAndPaymentCashMock,
    };

    const result = await createOrderCtrl(req, res);

    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Order created successfully',
      data: {
        order: {
          orderNumber: 11,
          customerNumber: 1,
          comments: null,
          orderDate: '2021-12-21',
          requiredDate: '2021-12-21',
          shippedDate: null,
          status: 'Shipped',
          orderLineNumber: 3,
          products: [{ productCode: 'S18_01', quantityOrdered: 6 }],
          payment: {
            amount: 9999,
            paymentDate: '2021-12-21',
            orderNumber: 11,
            paymentMethod: 'Cash',
            secureHash: 'secureHash',
            isPaid: 0,
          },
        },
      },
    });
  });

  it('Products with code S18_01 are currently out of stock: Order & Payment with COD', async () => {
    const orderDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(orderAndPaymentCODMock)),
    });
    const paymentDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentCODMock.payment),
      ),
    });
    const orderDetailDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentCODMock.products),
      ),
    });
    const whereProductMock = Sinon.fake.returns(Promise.resolve(1));
    const mockGetProduct = Sinon.fake.returns(Promise.resolve(productMock));
    const queryProductMock = () => {
      return {
        patch: () => {
          return {
            where: whereProductMock,
          };
        },
        select: () => {
          return {
            findById: mockGetProduct,
          };
        },
      };
    };

    Sinon.replace(Order, 'query', orderDataMock);
    Sinon.replace(Product, 'query', queryProductMock);
    Sinon.replace(OrderDetail, 'query', orderDetailDataMock);
    Sinon.replace(Payment, 'query', paymentDataMock);

    const transactionMock = (callback) => {
      const transResult = callback();

      return transResult;
    };

    Sinon.replace(Order, 'transaction', transactionMock);

    req = {
      body: {
        customerNumber: 1,
        comments: null,
        orderDate: '2021-12-21',
        requiredDate: '2021-12-22',
        status: 'In Process',
        orderLineNumber: 3,
        products: [
          {
            productCode: 'S18_01',
            quantityOrdered: 8000,
          },
        ],
        payment: {
          amount: 9999,
          paymentDate: '2021-12-21',
          paymentMethod: 'COD',
          isPaid: 0,
        },
      },
    };

    const result = await createOrderCtrl(req, res);

    expect(result.status).to.equal(200);
    expect(result.data).to.eql({
      message: 'Products with code S18_01 are currently out of stock',
    });
  });

  it('ERROR @Payment.transaction: Create payment failed', async () => {
    const orderDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(orderAndPaymentMomoMock)),
    });
    const paymentDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve({})),
    });
    const orderDetailDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentMomoMock.products),
      ),
    });
    const whereProductMock = Sinon.fake.returns(Promise.resolve(1));
    const mockGetProduct = Sinon.fake.returns(Promise.resolve(productMock));
    const queryProductMock = () => {
      return {
        patch: () => {
          return {
            where: whereProductMock,
          };
        },
        select: () => {
          return {
            findById: mockGetProduct,
          };
        },
      };
    };

    Sinon.replace(Product, 'query', queryProductMock);
    Sinon.replace(Order, 'query', orderDataMock);
    Sinon.replace(OrderDetail, 'query', orderDetailDataMock);
    Sinon.replace(Payment, 'query', paymentDataMock);

    const payWithMomoMock = Sinon.fake.returns(resultMomoMock);
    Sinon.replace(payWithMomo, 'default', payWithMomoMock);

    const transactionMock = (callback) => {
      const transResult = callback();

      return transResult;
    };

    Sinon.replace(Order, 'transaction', transactionMock);

    req = {
      body: orderAndPaymentMomoMock,
    };

    try {
      await createOrderCtrl(req, res);
    } catch (error) {
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql(
        'ERROR @Payment.transaction: Create payment failed',
      );
    }
  });

  it('Created successfully: Order & Payment with Momo', async () => {
    const orderDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(orderAndPaymentMomoMock)),
    });
    const paymentDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentMomoMock.payment),
      ),
    });
    const orderDetailDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentMomoMock.products),
      ),
    });
    const whereProductMock = Sinon.fake.returns(Promise.resolve(1));
    const mockGetProduct = Sinon.fake.returns(Promise.resolve(productMock));
    const queryProductMock = () => {
      return {
        patch: () => {
          return {
            where: whereProductMock,
          };
        },
        select: () => {
          return {
            findById: mockGetProduct,
          };
        },
      };
    };

    Sinon.replace(Product, 'query', queryProductMock);
    Sinon.replace(Order, 'query', orderDataMock);
    Sinon.replace(OrderDetail, 'query', orderDetailDataMock);
    Sinon.replace(Payment, 'query', paymentDataMock);

    const payWithMomoMock = Sinon.fake.returns(resultMomoMock);
    Sinon.replace(payWithMomo, 'default', payWithMomoMock);

    const transactionMock = (callback) => {
      const transResult = callback();

      return transResult;
    };

    Sinon.replace(Order, 'transaction', transactionMock);

    req = {
      body: orderAndPaymentMomoMock,
    };

    const result = await createOrderCtrl(req, res);
    assert(payWithMomoMock.calledOnce);

    expect(result.status).to.equal(301);
    expect(result.link).to.eql('https://test-payment.momo.vn/v2/gateway/pay');
  });

  it('Created successfully: Order & Payment with Momo (Error)', async () => {
    const orderDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(orderAndPaymentMomoMock)),
    });
    const paymentDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentMomoMock.payment),
      ),
    });
    const orderDetailDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentMomoMock.products),
      ),
    });
    const whereProductMock = Sinon.fake.returns(Promise.resolve(1));
    const mockGetProduct = Sinon.fake.returns(Promise.resolve(productMock));
    const queryProductMock = () => {
      return {
        patch: () => {
          return {
            where: whereProductMock,
          };
        },
        select: () => {
          return {
            findById: mockGetProduct,
          };
        },
      };
    };

    Sinon.replace(Product, 'query', queryProductMock);
    Sinon.replace(Order, 'query', orderDataMock);
    Sinon.replace(OrderDetail, 'query', orderDetailDataMock);
    Sinon.replace(Payment, 'query', paymentDataMock);

    const payWithMomoMock = Sinon.fake.throws(new Error());
    Sinon.replace(payWithMomo, 'default', payWithMomoMock);

    const transactionMock = (callback) => {
      const transResult = callback();

      return transResult;
    };

    Sinon.replace(Order, 'transaction', transactionMock);

    req = {
      body: orderAndPaymentMomoMock,
    };

    try {
      await createOrderCtrl(req, res);
    } catch (error) {
      assert(payWithMomoMock.calledOnce);

      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql('Payment failed');
    }
  });

  it('Case: ERROR @Order.transaction: Create order failed', async () => {
    const orderDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve({})),
    });
    const paymentDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentCashMock.payment),
      ),
    });
    const orderDetailDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentCashMock.products),
      ),
    });
    const whereProductMock = Sinon.fake.returns(Promise.resolve(1));
    const mockGetProduct = Sinon.fake.returns(Promise.resolve(productMock));
    const queryProductMock = () => {
      return {
        patch: () => {
          return {
            where: whereProductMock,
          };
        },
        select: () => {
          return {
            findById: mockGetProduct,
          };
        },
      };
    };

    Sinon.replace(Product, 'query', queryProductMock);
    Sinon.replace(Order, 'query', orderDataMock);
    Sinon.replace(OrderDetail, 'query', orderDetailDataMock);
    Sinon.replace(Payment, 'query', paymentDataMock);

    const transactionMock = (callback) => {
      const transResult = callback();

      return transResult;
    };

    Sinon.replace(Order, 'transaction', transactionMock);

    req = {
      body: orderAndPaymentCashMock,
    };

    try {
      await createOrderCtrl(req, res);
    } catch (error) {
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.eql(
        'ERROR @Order.transaction: Create order failed',
      );
    }
  });

  it('Case: ERROR @Order.transaction: Create orderDetail failed', async () => {
    const orderDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(orderAndPaymentCashMock)),
    });
    const paymentDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentCashMock.payment),
      ),
    });
    const orderDetailDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve({})),
    });
    const whereProductMock = Sinon.fake.returns(Promise.resolve(1));
    const mockGetProduct = Sinon.fake.returns(Promise.resolve(productMock));
    const queryProductMock = () => {
      return {
        patch: () => {
          return {
            where: whereProductMock,
          };
        },
        select: () => {
          return {
            findById: mockGetProduct,
          };
        },
      };
    };

    Sinon.replace(Product, 'query', queryProductMock);
    Sinon.replace(Order, 'query', orderDataMock);
    Sinon.replace(OrderDetail, 'query', orderDetailDataMock);
    Sinon.replace(Payment, 'query', paymentDataMock);

    const transactionMock = (callback) => {
      const transResult = callback();

      return transResult;
    };

    Sinon.replace(Order, 'transaction', transactionMock);

    req = {
      body: orderAndPaymentCashMock,
    };

    try {
      await createOrderCtrl(req, res);
    } catch (error) {
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.eql(
        'ERROR @Order.transaction: Create orderDetail failed',
      );
    }
  });

  it('Case: ERROR @Payment.transaction: Create payment failed', async () => {
    const orderDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(orderAndPaymentCashMock)),
    });
    const paymentDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve({})),
    });
    const orderDetailDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentCashMock.products),
      ),
    });
    const whereProductMock = Sinon.fake.returns(Promise.resolve(1));
    const mockGetProduct = Sinon.fake.returns(Promise.resolve(productMock));
    const queryProductMock = () => {
      return {
        patch: () => {
          return {
            where: whereProductMock,
          };
        },
        select: () => {
          return {
            findById: mockGetProduct,
          };
        },
      };
    };
    Sinon.replace(Product, 'query', queryProductMock);
    Sinon.replace(Order, 'query', orderDataMock);
    Sinon.replace(OrderDetail, 'query', orderDetailDataMock);
    Sinon.replace(Payment, 'query', paymentDataMock);

    const transactionMock = (callback) => {
      const transResult = callback();

      return transResult;
    };

    Sinon.replace(Order, 'transaction', transactionMock);

    req = {
      body: orderAndPaymentCashMock,
    };

    try {
      await createOrderCtrl(req, res);
    } catch (error) {
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.eql(
        'ERROR @Payment.transaction: Create payment failed',
      );
    }
  });

  it('Case: Internal Server Error', async () => {
    const transactionMock = Sinon.fake.returns(Promise.reject(new Error()));
    const mockGetProduct = Sinon.fake.returns(Promise.resolve(productMock));

    Sinon.replace(Product, 'getOne', mockGetProduct);
    Sinon.replace(Order, 'transaction', transactionMock);

    req = {
      body: orderAndPaymentCashMock,
    };

    try {
      await createOrderCtrl(req, res);
    } catch (error) {
      expect(error.statusCode).to.eql(500);
      expect(error.message).to.eql('Internal Server Error');
    }
  });

  it('ERROR @Payment.transaction: Create payment failed', async () => {
    const orderDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(orderAndPaymentMomoMock)),
    });
    const paymentDataMock = () => ({
      insert: Sinon.fake.returns(Promise.reject(new Error())),
    });
    const orderDetailDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentMomoMock.products),
      ),
    });
    const whereProductMock = Sinon.fake.returns(Promise.resolve(1));
    const mockGetProduct = Sinon.fake.returns(Promise.resolve(productMock));
    const queryProductMock = () => {
      return {
        patch: () => {
          return {
            where: whereProductMock,
          };
        },
        select: () => {
          return {
            findById: mockGetProduct,
          };
        },
      };
    };

    Sinon.replace(Product, 'query', queryProductMock);
    Sinon.replace(Order, 'query', orderDataMock);
    Sinon.replace(OrderDetail, 'query', orderDetailDataMock);
    Sinon.replace(Payment, 'query', paymentDataMock);

    const payWithMomoMock = Sinon.fake.returns(resultMomoMock);
    Sinon.replace(payWithMomo, 'default', payWithMomoMock);

    const transactionMock = (callback) => {
      const transResult = callback();

      return transResult;
    };

    Sinon.replace(Order, 'transaction', transactionMock);

    req = {
      body: orderAndPaymentMomoMock,
    };

    try {
      await createOrderCtrl(req, res);
    } catch (error) {
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql('Internal Server Error');
    }
  });

  it('ERROR @Product.getOne: Internal Server Error', async () => {
    const orderDataMock = () => ({
      insert: Sinon.fake.returns(Promise.resolve(orderAndPaymentCashMock)),
    });
    const paymentDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentCashMock.payment),
      ),
    });
    const orderDetailDataMock = () => ({
      insert: Sinon.fake.returns(
        Promise.resolve(orderAndPaymentCashMock.products),
      ),
    });

    const whereProductMock = Sinon.fake.returns(Promise.resolve(1));
    const mockGetProduct = Sinon.fake.returns(Promise.reject(new Error()));
    const queryProductMock = () => {
      return {
        patch: () => {
          return {
            where: whereProductMock,
          };
        },
        select: () => {
          return {
            findById: mockGetProduct,
          };
        },
      };
    };

    Sinon.replace(Order, 'query', orderDataMock);
    Sinon.replace(OrderDetail, 'query', orderDetailDataMock);
    Sinon.replace(Product, 'query', queryProductMock);
    Sinon.replace(Payment, 'query', paymentDataMock);

    const transactionMock = (callback) => {
      const transResult = callback();

      return transResult;
    };

    Sinon.replace(Order, 'transaction', transactionMock);

    req = {
      body: orderAndPaymentCashMock,
    };

    try {
      await createOrderCtrl(req, res);
    } catch (error) {
      expect(error.statusCode).to.equal(500);
      expect(error.message).to.eql(
        'ERROR @Product.getOne: Internal Server Error',
      );
    }
  });
});
