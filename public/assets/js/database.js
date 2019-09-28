function createHospital(hospitalObj) {
  return new Promise((resolve, reject) => {

    //attribute validations
    if(!hospitalObj.hasOwnProperty('name') || !hospitalObj.hasOwnProperty('location')
      || !hospitalObj.hasOwnProperty('donator')){
      reject('Hospitals must have a name, a location, and donotor info passed');
    }

    database.collection("hospitals").add(hospitalObj).then(() => {
      resolve('success');
    }).catch((error) => {
      reject(error.message);
    });

  });
}

function createProduct(productObj) {
  return new Promise((resolve, reject) => {

    //attribute validations
    if(!productObj.hasOwnProperty('name') || !productObj.hasOwnProperty('description')){
      reject('Products must have at least a name and a description');
    }
    
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



