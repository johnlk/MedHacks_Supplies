function createHospital(hospitalObj) {
  return new Promise((resolve, reject) => {

    //attribute validations
    if(!hospitalObj.hasOwnProperty('name') || !hospitalObj.hasOwnProperty('location')){
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

function createNeed(needObj){
  return new Promise((resolve, reject) => {

    if(!needObj.hasOwnProperty('productID') || !needObj.hasOwnProperty('quantity')
      || !needObj.hasOwnProperty('hospitalID')){
      reject('Needs require a productID, hospitalID, and a quantity');
    }

    database.collection("needs").add(needObj).then(() => {
      resolve('success');
    }).catch((error) => {
      reject(error.message);
    });

  });
}


function completeTransaction(transactionObj){
  return new Promise((resolve, reject) => {

    if(!transactionObj.hasOwnProperty('donorID') || !transactionObj.hasOwnProperty('recieverID')
      || !transactionObj.hasOwnProperty('needID')){
      reject('Completed transactions require a donorID, recieverID, and a needID');
    }

    var needFulfilled = database.collection("needs").doc(transactionObj['needID']);
    var pointsAwarded;

    needFulfilled.get().then((querySnapshot) => {
      var productID = querySnapshot.data().productID;
      var quantity = querySnapshot.data().quantity;

      pointsAwarded = computePoints(productID, quantity);

      transactionObj['points'] = pointsAwarded;

      database.collection("transactions").add(transactionObj).then(() => {
        resolve('success');
      }).catch((error) => {
        reject(error.message);
      });

    }).catch((error) => {
      reject(error.message);
    });

  });
}

function computePoints(productID, quantity){
  return 100;
}

//on donation, or request for product, see if there is
//already an existing match
function searchForCompletedTransaction(){

}

function getTotalPoints(hospitalID){
  
}



