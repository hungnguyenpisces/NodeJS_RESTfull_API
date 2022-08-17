import Product from '../models/product.model';

const getAllProductsCtrl = async (req, res) => {
  const products = await Product.get(req.query);
  const count = products.length;

  if (count === 0) {
    return res.status(200).json({
      message: 'No ProducLine found',
      data: [],
    });
  }

  return res.status(200).json({
    total: products.length,
    data: products,
  });
};

const createProductCtrl = async (req, res) => {
  const dataProduct = req.body;

  const product = await Product.create(dataProduct);

  return res.status(200).json({
    message: 'Product created successfully',
    data: product,
  });
};

const updateProductCtrl = async (req, res) => {
  const { productCode } = req.params;
  const data = req.body;
  const updatedProduct = await Product.update(productCode, data);

  return res.status(200).json({
    message: 'Product update successfully.',
    data: updatedProduct,
  });
};

const softDeleteCtrl = async (req, res) => {
  const { productCode } = req.params;
  const softDeleteProduct = await Product.update(productCode, {
    quantityInStock: 0,
  });

  return res.status(200).json({
    message: 'Delete all products in stocks.',
    data: softDeleteProduct,
  });
};

export {
  getAllProductsCtrl,
  createProductCtrl,
  updateProductCtrl,
  softDeleteCtrl,
};
