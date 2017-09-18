const rp = require('request-promise');

const mock = require('./mock-data'); 

let baseUrl = mock.url.baseUrl;
let classifyUrl = mock.url.classifyUrl;
let carVariantUrl = mock.url.carVariantUrl;

function getCode(value, options) {

  let result = options.filter(item => {
    return item.message === value || item.message.indexOf(value) !== -1; // || item.message.indexOf(value) !== -1 remove after test
  })[0];

  let code = result['code'];

  return code;
}

function getCarVariants(carBrand, selectedYear, carModel) {
  let carCode = getCode(carBrand, mock.carCodes);
  carModel = mock.normalizeCarModelTypeItem(carModel);

  return rp(`${baseUrl}?bilmerkeNr=${carCode}`)
    .then(response => {
      let carRegistrationYears = JSON.parse(response);

      carRegistrationYears.forEach(carYear => {
        if (parseInt(carYear.code, 10) === parseInt(selectedYear, 10)) {
          choosenYear = parseInt(carYear.code, 10);
        }
      });

      return rp(`${classifyUrl}?bilmerkeNr=${carCode}&registreringsaar=${choosenYear}`);
    })
    .then(response => {
      let carVariants = JSON.parse(response);
      carVariants = mock.normalizeCarModelTypeList(carVariants);
      let carModelNumber = getCode(carModel, carVariants).split(':')[0];

      carVariants.forEach(carModel => {
        if (carModelNumber === carModel.code.split(':')[0]) {
          choosenCarModel = parseInt(carModel.code.split(':')[0]);
        }
      });

      if (carModel.includes('(')) {
        let start = carModel.indexOf('(');
        let end = carModel.indexOf(')');
        choosenYear = carModel.slice(start+1, end).trim();
      }

      return rp(`${carVariantUrl}?bilmerkeNr=${carCode}&registreringsaar=${choosenYear}&modellNr=${choosenCarModel}&modellaar=${choosenYear}`);
    })
    .then(response => {
      return JSON.parse(response);
    });
}

module.exports = {
  getCarVariants
};


// $http = angular.element($0).injector().get('$http')
// setInterval(() => console.log($http.pendingRequests), 100)

//-------------------------------------//
  // carModule.getCarVariants(carBrand, registrationYear, carModel)
  //   .then(res => {
  //     let carModelTypeCollection = res;
  //     let singleCar = carVariant;

  //     let normSingleCar = mock.normalizeCarModelTypeItem(singleCar);
  //     let normSingleCarList = mock.normalizeCarModelTypeList(carModelTypeCollection);
      
  //     let findMatch = mock.findMatcingCarModelType(normSingleCar, normSingleCarList);

  //     if (!findMatch) {
  //       registrationYear = Number(registrationYear) + 1;
  //     }

  //   });

  //   show.log(car);

  //   setTimeout(() => {
  //     console.log(registrationYear);
  //   }, 3000)

  //-------------------------------------//

    /*
  carModule.getCarVariants(carBrand, registrationYear, carModel)
    .then(res => {
      let carModelTypeList = res; console.log(res);
      // let normCarVariant = mock.removeBrackets(mock.normalizeCarModelTypeItem(carVariant));
      let normCarVariant = mock.normalizeCarModelTypeItem(carVariant);
      let normCarCollection = mock.normalizeCarModelTypeList(carModelTypeList);

      let matchItem = mock.findMatcingCarModelType(normCarVariant, normCarCollection);

      if (!matchItem) {
        console.log(`search in next year`);
        registrationYear = Number(registrationYear) + 1;
        console.log(registrationYear);
      }
    });
    */