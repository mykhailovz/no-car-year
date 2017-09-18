const rp = require('request-promise');

const config = require('../config/config');

function getCarCode(value, options) {

  let result = options.filter(item => {
    return item.message === value;
  })[0];

  return result['code'];
}

function getModelCode(value, options) {

  let result = options.filter(item => {
    return item.message === value;
  })[0];

  return result['code'].split(':')[0];
}

// a list with cars register number to test { they are not correct }
// https://codeshare.io/5zXDYE
// algo to normalize
// https://codeshare.io/axeDzN
// https://tribe-back-end-dev.herokuapp.com/public/ofv/data/{carRegNumber}
let carBrand = 'Toyota';
let carYear = '2006';
let carModel = 'RAV4';
let carVariant = '2,2 D-4D 136hk DPF Executive';
// from back-end response

// global variables
let carCode;
let modelCode;
// global variables

// function responsible for requests

function setCarBrand(carBrand) {
  carCode = getCarCode(carBrand, config.carCodes);

  return rp(`${config.baseUrl}?bilmerkeNr=${carCode}`);
}

function setCarYear(carYear) {
  return rp(`
    ${config.classifyUrl}
    ?bilmerkeNr=${carCode}
    &registreringsaar=${carYear}`
  );
}

function setCarModel(carModel, carModels, carYear) {
  modelCode = getModelCode(carModel, carModels)

  if (carModel.includes('(')) {
    let start = carModel.indexOf('(');
    let end = carModel.indexOf(')');
    carYear = carModel.slice(start+1, end).trim();
  }

  console.log(`
  ${config.carVariantUrl}
  ?bilmerkeNr=${carCode}
  &registreringsaar=${carYear}
  &modellNr=${modelCode}
  &modellaar=${carYear}`)

  return rp(`
    ${config.carVariantUrl}
    ?bilmerkeNr=${carCode}
    &registreringsaar=${carYear}
    &modellNr=${modelCode}
    &modellaar=${carYear}`
  );
}

function setCarVariant() {

}

setCarBrand(carBrand)
  .then(() => {
    return setCarYear(carYear);
  })
  .then((res) => {
    let carModels = JSON.parse(res);

    return setCarModel(carModel, carModels, carYear);
  })
  .then((res) => {
    console.log(
      JSON.parse(res)
    );
  })
  .catch((err) => {
    console.log(err);
  })


// https://www.finansportalen.no/insurance-calculator/rest/classifier/car/
// carVariant?bilmerkeNr=5480&registreringsaar=2007&modellNr=18&modellaar=2007