import _ from 'lodash';
import ProductLine from '../../models/productLine.model';
import AppError from '../error/AppError';

const checkProductLine = async (req, res, next) => {
  try {
    const { productLine } = req.body;
    const productLineFound = await ProductLine.query().where({ productLine });

    if (_.isEmpty(productLineFound)) {
      throw new AppError('ProductLine not found.', 404);
    }

    return next();
  } catch (error) {
    throw new AppError(
      error.message ? error.message : 'Internal Server Error',
      error.statusCode || 500,
    );
  }
};

export default checkProductLine;
