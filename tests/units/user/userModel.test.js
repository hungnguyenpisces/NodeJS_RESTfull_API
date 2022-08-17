import { expect } from 'chai';
import User from '../../../src/models/user.model';

describe('userModel', () => {
  it('tableName', async () => {
    const result = User.tableName;
    expect(result).to.equal('users');
  });

  it('idColumn', async () => {
    const result = User.idColumn;
    expect(result).to.equal('userNumber');
  });

  it('relationMappings', async () => {
    const result = User.relationMappings;
    expect(result).to.be.an('object');
  });
});
