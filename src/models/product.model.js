// import _ from 'lodash';
import _ from 'lodash';
import Model from '../database';
import AppError from '../middlewares/error/AppError';

const errorMess = 'Internal Server Error';
class Product extends Model {
  static get tableName() {
    return 'products';
  }

  static get idColumn() {
    return 'productCode';
  }

  // static get relationMappings() {
  //   return {
  //     orderdetails: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: OrderDetail,
  //       join: {
  //         from: 'products.productCode',
  //         to: 'orderdetails.productCode',
  //       },
  //     },
  //   };
  // }

  static async get(condition) {
    try {
      const result = await Product.query().where(condition);

      return result;
    } catch (error) {
      throw new AppError(`ERROR @Product.get: Internal Server Error`, 500);
    }
  }

  static async create(data) {
    try {
      const product = await Product.query().insert(data);

      if (_.isEmpty(product)) {
        throw new AppError('ERROR @Product.create: Create failed', 400);
      }

      return product;
    } catch (error) {
      throw new AppError(
        error.message ? error.message : `ERROR @Product.create: ${errorMess}`,
        error.statusCode ? error.statusCode : 500,
      );
    }
  }

  static async getOne(productCode) {
    try {
      const product = await Product.query()
        .select('productCode', 'quantityInStock', 'buyPrice')
        .findById(productCode);

      return product;
    } catch (error) {
      throw new AppError(
        error.message || `ERROR @Product.getOne: Internal Server Error`,
        500,
      );
    }
  }

  static async update(productCode, data) {
    try {
      const result = await Product.query().patchAndFetchById(productCode, data);
      if (!result) {
        throw new AppError(`Product not found.`, 404);
      }

      return result;
    } catch (error) {
      throw new AppError(
        error.message
          ? error.message
          : `ERROR @Product.update: Internal Server Error`,
        error.statusCode ? error.statusCode : 500,
      );
    }
  }
}
export default Product;
