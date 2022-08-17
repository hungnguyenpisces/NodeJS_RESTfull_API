import OrderDetail from '../models/orderDetail.model';

const getAllOrderDetailCtrl = async (req, res) => {
  const queryInput = req.query;
  const orderDetails = await OrderDetail.get(queryInput);

  return res.status(200).json({
    total: orderDetails.length,
    data: orderDetails,
  });
};

const updateOrderDetailCtrl = async (req, res) => {
  const compositeKey = req.params;
  const dataUpdate = req.body;
  const orderDetail = await OrderDetail.update(compositeKey, dataUpdate);

  return res.status(200).json({
    message: 'Success',
    data: orderDetail,
  });
};

export { getAllOrderDetailCtrl, updateOrderDetailCtrl };
