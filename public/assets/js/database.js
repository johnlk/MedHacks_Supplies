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

function createSpareSupplies(donationObj){
  return new Promise((resolve, reject) => {

    if(!donationObj.hasOwnProperty('productID') || !donationObj.hasOwnProperty('quantity')
      || !donationObj.hasOwnProperty('hospitalID')){
      reject('Donation requires a productID, hospitalID, and a quantity');
    }

    database.collection("spare_supplies").add(donationObj).then(() => {
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

    needFulfilled.get().then((querySnapshot) => {
      var productID = querySnapshot.data().productID;
      var quantity = querySnapshot.data().quantity;

      computePoints(productID, quantity).then((response) => {
        transactionObj['points'] = response;

        database.collection("transactions").add(transactionObj).then(() => {
          resolve('success');
        }).catch((error) => {
          reject(error.message);
        });
      });
    }).catch((error) => {
      reject(error.message);
    });

  });
}

function computePoints(productID, quantity){
  return new Promise((resolve, reject) => {
    database.collection("products").doc(productID).get().then((snapshot) => {
      resolve(snapshot.data().pointMultiplier * quantity);
    }).catch((error) => {
      reject(error.message);
    })
  });
}

function sufficientSupply(productID, quantity){
  return new Promise((resolve, reject) => {
    database.collection("spare_supplies").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if(doc.data().productID == productID && doc.data().quantity >= quantity){
          resolve(doc.id);
        }
      });
    }).then((response) => {
      reject('no sufficient supply');
    });
  });
}

//on donation, or request for product, see if there is
//already an existing match for supplies

//check all needs with existing supplies, 
//if match create transaction, then decrement
//the spare_supply numbers
function checkAndCompleteTransactions(){
  database.collection("needs").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      //check if extra supply exists for product with sufficient quantity
      sufficientSupply(doc.data().productID, doc.data().quantity).then((response) => {
        var spareSupplyID = response;

        database.collection("spare_supplies").doc(spareSupplyID).get().then((snapshot) => {

          var transactionObj = {
            donorID: snapshot.data().hospitalID,
            recieverID: doc.data().hospitalID,
            needID: doc.id
          };

          //complete the transaction
          completeTransaction(transactionObj).then((response) => {
            if(snapshot.data().quantity > doc.data().quantity){
              //decrement quantity by 
              //snapshot.data().quantity = snapshot.data().quantity - doc.data().quantity
              database.collection("spare_supplies").doc(spareSupplyID).set({
                hospitalID: snapshot.data().hospitalID,
                productID: snapshot.data().productID,
                quantity: snapshot.data().quantity - doc.data().quantity
              });
            }else if(snapshot.data().quantity == doc.data().quantity){
              database.collection("spare_supplies").doc(spareSupplyID).delete();
            }
          });
        });

      });
    });
  });
}

function getTotalPoints(hospitalID){
  return new Promise((resolve, reject) => {
    database.collection("transactions").get().then(function(querySnapshot) {
      var total = 0;
      querySnapshot.forEach(function(doc) {
        if(doc.data().donorID == hospitalID){
          total += doc.data().points;
        }
      });
      resolve(total);
    }).catch((error) => {
      reject(error.message);
    });
  })
}

