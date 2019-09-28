function createHospital(hospitalObj) {
  return new Promise((resolve, reject) => {

    //could do some object validation for required attributes
    database.collection("hospitals").add(hospitalObj).then(() => {
      resolve('success');
    }).catch((error) => {
      reject(error.message);
    });

  });
}

function createProduct(productObj) {
  return new Promise((resolve, reject) => {

    //could do some object validation for required attributes
    database.collection("products").add(productObj).then(() => {
      resolve('success');
    }).catch((error) => {
      reject(error.message);
    });

  });
}


//on donation, or request for product, see if there is
//already an existing match
function searchForCompletedTransaction(){

}



