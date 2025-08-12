import { PharmacyBillViewModel } from './pharmacy-bill-view-model';
// Make sure that PharmacyBillViewModel is a class exported from './pharmacy-bill-view-model'

describe('PharmacyBillViewModel', () => {
  it('should create an instance', () => {
    expect(new PharmacyBillViewModel()).toBeTruthy();
  });
});
