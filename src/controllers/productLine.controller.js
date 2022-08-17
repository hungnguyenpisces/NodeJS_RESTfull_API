import _ from 'lodash';
import ProductLine from '../models/productLine.model';

const getAllProductLinesCtrl = async (req, res) => {
  const result = await ProductLine.get(req.query);
  const count = result.length;
  if (count === 0) {
    return res.status(200).json({
      message: 'No ProducLine found',
      data: [],
    });
  }

  return res.status(200).json({
    total: count,
    data: result,
  });
};

const getProductLineCtrl = async (req, res) => {
  // const { productLine } = req.params;
  const result = await ProductLine.getOne(req.params);

  if (_.isEmpty(result)) {
    return res.status(200).json({
      message: 'No ProducLine found',
      data: {},
    });
  }

  return res.status(200).json({
    data: result,
  });
};

const createProductLineCtrl = async (req, res) => {
  const data = req.body;
  const productLine = await ProductLine.create(data);

  return res.status(200).json({
    message: 'Created',
    data: productLine,
  });
};

const updateProductLineCtrl = async (req, res) => {
  const data = req.body;
  const { productLine } = req.params;
  const productLineUpd = await ProductLine.update(productLine, data);

  return res.status(200).json({
    message: 'Updated',
    data: productLineUpd,
  });
};

// const deleteProductLineCtrl = async (req, res) => {
//   const { productLine } = req.params;
//   await ProductLines.delete({ productLine });
//   return res.status(200).json({
//     message: 'Deleted',
//   });
// };

export {
  getAllProductLinesCtrl,
  getProductLineCtrl,
  createProductLineCtrl,
  updateProductLineCtrl,
  // deleteProductLineCtrl,
};
