const productLineDataMock = {
  productLine: 'Atelier graphique',
  textDescription: null,
  htmlDescription: null,
  image: null,
};

const newProducLineMock = {
  productLine: 'Atelier graphique1',
  textDescription: null,
  htmlDescription: null,
  image: null,
};

const mockFetched = [
  {
    productLine: 'nothing',
    textDescription: 'blalala 1 2 333',
    htmlDescription: null,
    image: null,
    products: [
      {
        productCode: 'S10_1632132',
        productName: '1969 Harley Davidson Ultimate Chopper11',
        productLine: 'nothing',
        productScale: '1:10',
        productVendor: 'Min Lin Diecast',
        productDescription:
          'This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.',
        quantityInStock: 7933,
        buyPrice: '48.81',
        MSRP: '95.70',
      },
    ],
  },
];

export { productLineDataMock, newProducLineMock, mockFetched };
