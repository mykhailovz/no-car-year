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
    return item.message = value;
  })[0];

  return result['code'].split(':')[0];
}


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

setCarBrand('Audi')
  .then(() => {
    return setCarYear(2000);
  })
  .then((res) => {
    let carModels = JSON.parse(res);

    return setCarModel('A8 ( 2001 ) ', carModels, 2000);
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  })