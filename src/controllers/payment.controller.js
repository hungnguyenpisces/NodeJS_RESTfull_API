import Payment from '../models/payment.model';
import AppError from '../middlewares/error/AppError';
import payWithMomo from '../services/payWithMomo';

const updatePaymentCtrl = async (req, res) => {
  const { orderNumber } = req.params;
  const data = { orderNumber, ...req.body };
  await Payment.update({ orderNumber }, data);
  switch (data.paymentMethod) {
    case 'Cash':
    case 'COD':
      return res.status(200).json({
        message: 'Payment updated successfully',
      });
    case 'Momo':
      try {
        const { amount } = data;
        const resultPayWithMomo = await payWithMomo({ orderNumber, amount });
        console.log(resultPayWithMomo.payUrl);

        return res.redirect(301, resultPayWithMomo.payUrl);
      } catch (error) {
        throw new AppError(
          error.message ||
            'ERROR @updatePaymentCtrl: Something went wrong while paying with Momo',
          error.statusCode || 500,
        );
      }
  }
};

const momoPaymentReturnCtrl = async (req, res) => {
  const data = req.query;
  const orderNumber = data.orderId.split('-')[0];
  try {
    await Payment.update({ orderNumber }, { isPaid: 1 });

    return res.redirect(301, 'https://www.google.com.vn/');
  } catch (error) {
    return res.redirect(301, 'https://www.facebook.com/');
  }
};

export { updatePaymentCtrl, momoPaymentReturnCtrl };
