import _ from 'lodash';
import Model from '../database';
import AppError from '../middlewares/error/AppError';
import Product from './product.model';

const errorMess = 'Internal Server Error';
class ProductLine extends Model {
  static get tableName() {
    return 'productlines';
  }

  static get idColumn() {
    return 'productLine';
  }

  static get relationMappings() {
    return {
      products: {
        relation: Model.HasManyRelation,
        modelClass: Product,
        join: {
          from: 'productlines.productLine',
          to: 'products.productLine',
        },
      },
    };
  }

  static async get(condition) {
    try {
      const result = await ProductLine.query().where(condition);

      // if (_.isEmpty(result)) {
      //   throw new AppError('No ProductLine found', 404);
      // }

      return result;
    } catch (error) {
      throw new AppError(`ERROR @ProductLine.get: Internal Server Error`, 500);
    }
  }

  static async getOne(condition) {
    try {
      const result = await ProductLine.query()
        .where(condition)
        .withGraphFetched('products');
      // if (result.length <= 0) {
      //   throw new AppError(`ProductLine not found.`, 404);
      // }
      return result[0];
    } catch (error) {
      throw new AppError(
        `ERROR @ProductLine.getByPK: Internal Server Error`,
        500,
      );
    }
  }

  static async create(data) {
    try {
      const productLine = await ProductLine.query().insert(data);

      if (_.isEmpty(productLine)) {
        throw new AppError(`Create failed.`);
      }

      return productLine;
    } catch (error) {
      throw new AppError(
        error.message || `ERROR @ProductLine.create: ${errorMess}`,
        error.statusCode || 500,
      );
    }
  }

  static async update(productLine, data) {
    try {
      if (data.productLine && productLine !== data.productLine) {
        throw new AppError('Cannot change the name of this ProductLine', 400);
      }
      const productLineUpd = await ProductLine.query().patchAndFetchById(
        productLine,
        data,
      );

      if (_.isEmpty(productLineUpd)) {
        throw new AppError('ProductLine not found', 404);
      }

      return productLineUpd;
    } catch (error) {
      throw new AppError(
        error.message || `ERROR @ProductLine.update: Internal Server Error`,
        error.statusCode || 500,
      );
    }
  }

  // static async delete(condition) {
  //   try {
  //     const result = await ProductLines.query().delete().where(condition);
  //     if (result === 0) {
  //       throw new AppError(`Delete ProductLines failed.`, 500);
  //     }
  //     return result;
  //   } catch (error) {
  //     throw new AppError(
  //       error.message
  //         ? error.message
  //         : `ERROR @ProductLines.delete: Internal Server Error`,
  //       error.statusCode || 500,
  //     );
  //   }
  // }
}
export default ProductLine;
