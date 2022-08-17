import express from 'express';
import userRouter from './user.routes';
import customerRouter from './customer.routes';
import employeesRouter from './employee.routes';
import officeRouter from './office.routes';
import orderRouter from './order.routes';
import productLineRouter from './productLine.routes';
import productRouter from './product.routes';
import paymentRouter from './payment.routes';

const router = express.Router();

router.use('/api/users', userRouter);
router.use('/api/customers', customerRouter);
router.use('/api/employees', employeesRouter);
router.use('/api/offices', officeRouter);
router.use('/api/orders', orderRouter);
router.use('/api/productLines', productLineRouter);
router.use('/api/products', productRouter);
router.use('/api/payments', paymentRouter);

export default router;
