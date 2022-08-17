import dotenv from 'dotenv';
import { Model } from 'objection';
import knex from 'knex';
import {
  development as dbDevConfigs,
  production as dbProdConfigs,
} from './knexfile';

dotenv.config();

let knexConnection;

switch (process.env.NODE_ENV) {
  case 'development':
    knexConnection = knex(dbDevConfigs);
    break;
  case 'production':
    knexConnection = knex(dbProdConfigs);
    break;
  default:
    break;
}

Model.knex(knexConnection);
export default Model;
