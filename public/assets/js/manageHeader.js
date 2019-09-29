isUserSignedIn().then((response) => {
	var logOutBitch = document.getElementById("signInLogOut");
	logOutBitch.innerHTML = "Log Out";
	
	logOutBitch.addEventListener("click", function(){
		signOutUser().then((response) => {
			document.location.reload();
		})
	})
}).catch((error) => {
	console.log(error);
})