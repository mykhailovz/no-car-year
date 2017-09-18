
function customFunction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ message: 'Promise resolved OK', status: 200 });
    }, 5347);
  });
}

let startTimer = process.hrtime();

customFunction()
  .then((res) => {
    let endTimer = process.hrtime();
    console.log(startTimer);
    console.log(endTimer);
  });
