import _ from 'lodash';
import Order from '../models/order.model';
import User from '../models/user.model';
import Employee from '../models/employee.model';
import Payment from '../models/payment.model';
import Product from '../models/product.model';
import AppError from '../middlewares/error/AppError';
import OrderDetail from '../models/orderDetail.model';
import payWithMomo from '../services/payWithMomo';

const createOrderCtrl = async (req, res) => {
  const orderInput = _.pick(req.body, [
    'customerNumber',
    'comments',
    'orderDate',
    'requiredDate',
    'status',
  ]);
  const productInput = _.pick(req.body, ['products']).products;
  const paymentInput = _.pick(req.body, ['payment']).payment;

  try {
    const productPromises = productInput.map((element) => {
      return Product.getOne(element.productCode);
    });

    const productArr = await Promise.all(productPromises);

    const productStockingArr = [];
    const productOutofStockArr = [];

    productInput.forEach((element, index) => {
      if (productArr[index].quantityInStock >= element.quantityOrdered) {
        productStockingArr.push({
          buyPrice: productArr[index].buyPrice,
          quantityInStock: productArr[index].quantityInStock,
          ...element,
        });
      } else {
        productOutofStockArr.push(element.productCode);
      }
    });

    if (productOutofStockArr.length > 0) {
      return res.status(200).json({
        message: `Products with code ${productOutofStockArr.join(
          ', ',
        )} are currently out of stock`,
      });
    }

    const result = await Order.transaction(async (trx) => {
      const order = await Order.query(trx).insert(orderInput);
      if (_.isEmpty(order)) {
        throw new AppError(
          'ERROR @Order.transaction: Create order failed',
          500,
        );
      }

      _.merge(paymentInput, { orderNumber: order.orderNumber });

      const orderDetailPromises = productStockingArr.map((element) => {
        const orderDetailData = {
          orderNumber: order.orderNumber,
          productCode: element.productCode,
          quantityOrdered: element.quantityOrdered,
          priceEach: element.buyPrice,
          orderLineNumber: req.body.orderLineNumber,
        };

        return OrderDetail.query(trx).insert(orderDetailData);
      });

      await Promise.all(orderDetailPromises);

      const productUpdatePromises = productStockingArr.map((element) => {
        const productlData = {
          quantityInStock: element.quantityInStock - element.quantityOrdered,
        };

        return Product.query(trx)
          .patch(productlData)
          .where({ productCode: element.productCode });
      });

      await Promise.all(productUpdatePromises);

      const payment = await Payment.query(trx).insert(paymentInput);

      if (_.isEmpty(payment)) {
        throw new AppError(
          'ERROR @Payment.transaction: Create payment failed',
          500,
        );
      }

      return { order };
    });

    switch (paymentInput.paymentMethod) {
      case 'Cash':
      case 'COD':
        return res.status(200).json({
          message: 'Order created successfully',
          data: result,
        });
      case 'Momo':
        try {
          const { orderNumber, amount } = paymentInput;
          const resultPayWithMomo = await payWithMomo({ orderNumber, amount });
          console.log(resultPayWithMomo.payUrl);

          return res.redirect(301, resultPayWithMomo.payUrl);
        } catch (error) {
          throw new AppError('Payment failed', 500);
        }
    }
  } catch (error) {
    throw new AppError(
      error.message || 'Internal Server Error',
      error.statusCode || 500,
    );
  }
};

const getOrderCtrl = async (req, res) => {
  let order = {};
  const { orderNumber } = req.params;
  const role = res.locals.user.roleNumber;

  if (role === 4) {
    const user = await User.getOneRelatedToCustomer({
      email: res.locals.user.email,
    });

    if (_.isEmpty(user.customer)) {
      return res.status(500).json({
        message: 'Your data could not be found, please contact us',
      });
    }

    if (user.customer.customerNumber !== orderNumber) {
      return res.status(404).json({
        message: 'Not Found',
      });
    }

    order = await Order.getOne({
      customerNumber: user.customer.customerNumber,
    });
  }

  if (role === 3) {
    const employee = await Employee.getOneRelationsToCustomer({
      email: res.locals.user.email,
    });

    if (_.isEmpty(employee.customers)) {
      return res.status(200).json({
        message: `You don't have any customers`,
      });
    }

    const customerNumbers = employee.customers.map((element) => {
      return element.customerNumber;
    });

    if (customerNumbers.includes(orderNumber)) {
      order = await Order.getOne({ orderNumber });
    } else {
      order = {};
    }
  }

  if (role === 1 || role === 2) {
    order = await Order.getOne({ orderNumber });
  }

  if (_.isEmpty(order)) {
    return res.status(200).json({
      message: 'Order not found',
    });
  }

  return res.status(200).json({
    data: order,
  });
};

const getAllOrdersCtrl = async (req, res) => {
  let orders = [];
  let data;
  let arg;

  if (res.locals.user.roleNumber === 3) {
    data = await Employee.getOneRelationsToCustomer({
      email: res.locals.user.email,
    });

    if (_.isEmpty(data.customers)) {
      return res.status(200).json({
        message: `You don't have any customers`,
      });
    }

    arg = data.customers.map((element) => {
      return element.customerNumber;
    });

    orders = await Order.getManyByOrderNumber(arg, req.query);
  }

  if (res.locals.user.roleNumber === 2 || res.locals.user.roleNumber === 1) {
    orders = await Order.get(req.query);
  }

  if (_.isEmpty(orders)) {
    return res.status(200).json({
      message: 'No Orders found',
    });
  }

  return res.status(200).json({
    total: orders.length,
    data: orders,
  });
};

const updateOrderCtrl = async (req, res) => {
  const { orderNumber } = req.params;
  const data = req.body;
  const orderUpdated = await Order.update(orderNumber, data);

  return res.status(200).json({
    message: 'Success',
    data: orderUpdated,
  });
};

const softDeleteOrderCtrl = async (req, res) => {
  const { orderNumber } = req.params;
  const data = { status: 'Cancelled' };
  const result = await Order.update(orderNumber, data);

  if (_.isEmpty(result)) {
    return res.status(400).json({
      message: 'Order not found',
    });
  }

  return res.status(200).json({
    message: 'Cancelled',
  });
};

export {
  createOrderCtrl,
  getOrderCtrl,
  getAllOrdersCtrl,
  updateOrderCtrl,
  softDeleteOrderCtrl,
};
