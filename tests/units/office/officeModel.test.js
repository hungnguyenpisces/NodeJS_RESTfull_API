import { expect } from 'chai';
import Office from '../../../src/models/office.model';

describe('Test Office Model', () => {
  it('tableName is "offices"', async () => {
    const result = Office.tableName;
    expect(result).to.eql('offices');
  });
  it('idColumn ís "officeCode"', async () => {
    const result = Office.idColumn;
    expect(result).to.eql('officeCode');
  });
  it('relationMappings is an object', async () => {
    const result = Office.relationMappings;
    expect(result).to.be.an('object');
  });
});
