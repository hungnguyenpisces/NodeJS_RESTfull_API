import { expect } from 'chai';
import Payment from '../../../src/models/payment.model';

describe('paymentModel', () => {
  it('tableName', async () => {
    const result = Payment.tableName;
    expect(result).to.equal('payments');
  });

  it('idColumn', async () => {
    const result = Payment.idColumn;
    expect(result).to.equal('orderNumber');
  });
});
