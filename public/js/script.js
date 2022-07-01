/*------------------auth status------------------------*/
let loggedIn = document.getElementById("loggedIn");
const auth = firebase.auth();
const database = firebase.database();

/*------------for my own IDs------------------*/
let playerNumber = 1



auth.onAuthStateChanged(function(user) {
    if (user) {
        console.log("logged in")
        loggedInObjects();
        if (window.location.pathname == '/events') {
            document.getElementById("availability").style.display = "inline-block"
        }
    } else {
        console.log("logged out")
        loggedOutObjects();
        if (window.location.pathname == '/events') {
            document.getElementById("availability").style.display = "none"
        }
    }
})

// changes made to webpage when user logs in
function loggedInObjects() {
    if (window.location.pathname != '/admin.html') {
        document.getElementById("signup-nav").style.display = "none";
        document.getElementById("login-nav").style.display = "none";
        document.getElementById("logout-nav").style.display = "inline-block";
        document.getElementById("userInfo").style.display = "block";
        if (window.location.pathname == '/signup') {
            document.getElementById("email").style.display = "none";
            document.getElementById("password").style.display = "none";
            document.getElementById("name").style.display = "none";
            document.getElementById("signUp").style.display = "none";
        }

        // tells user they are logged in
        var thisUser = auth.currentUser;
        let html = `<p> You are logged in as: <strong> ${thisUser.email}</strong></p>`;
        /*loggedIn.innerHTML = html;*/
    }
}

function loggedOutObjects() {
    if (window.location.pathname != '/admin') {
        document.getElementById("signup-nav").style.display = "inline-block";
        document.getElementById("login-nav").style.display = "inline-block";
        document.getElementById("logout-nav").style.display = "none";
        if (window.location.pathname == '/signup') {
            document.getElementById("email").style.display = "inline-block";
            document.getElementById("password").style.display = "inline-block";
            document.getElementById("name").style.display = "inline-block";
            document.getElementById("signUp").style.display = "inline-block";
        }
        document.getElementById("userInfo").style.display = "none";

    }
}

function sendNewUserToDatabase() {
    /*Send info to database*/
    playername = document.getElementById("name").value;
    email = document.getElementById("email").value;
    database.ref('users/' + playerNumber).set({
        playername: playername,
        email: email,
    })
    playerNumber = playerNumber + 1;
}

function signUp() {
    /*Authentication*/
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));

    alert("Signed up");
}

function signOut() {
    const promise = auth.signOut();
    promise.catch(e => alert(e.message));
    alert("Signed out")

    loggedOutObjects();

    document.getElementById("signUp").style.display = "inline-block";
    document.getElementById("signIn").style.display = "inline-block";
    document.getElementById("signOut").style.display = "none";

    /*window.location.href = "#";*/
}

function signIn() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));

    alert("Signed in")
    email.style.display = "none";
    password.style.display = "none";
}

function setAvailability() {

    auth.onAuthStateChanged(function(user) {
        if (user) {
            /*var userId = firebase.auth().currentUser.uid;*/
            var eventDate = document.getElementById("event-date").innerHTML;
            yesSelect = document.getElementById("yes-btn");
            noSelect = document.getElementById("no-btn");
            editSelect = document.getElementById("edit-btn");
            database.ref('/users/' + playerNumber).on('value', (snapshot) => {
                currentPlayer = snapshot.val().playername;
            });
            yesSelect.addEventListener("click", function() {
                noSelect.style.display = "none";
                editSelect.style.display = "inline-block";
                database.ref('availability/' + currentPlayer).child(eventDate).set({
                    date: eventDate,
                    playername: currentPlayer,
                    available: "Yes",
                })
                yesSelect.disabled = true;
            });
            noSelect.addEventListener("click", function() {
                yesSelect.style.display = "none";
                editSelect.style.display = "inline-block";
                database.ref('availability/' + currentPlayer).child(eventDate).set({
                    date: eventDate,
                    playername: currentPlayer,
                    available: "No",
                })
                noSelect.disabled = true;
            });
            editSelect.addEventListener("click", function() {
                yesSelect.style.display = "inline-block";
                noSelect.style.display = "inline-block";
                editSelect.style.display = "none";
                noSelect.disabled = false;
                yesSelect.disabled = false;
            });
        } else {
            /*window.location.href = "#";*/
        }
    })
}

function createAdminDatesList() {
    var date = [];
    var alreadyDate;
    database.ref('/availability/').on('value', (snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            var item = Object.keys(childSnapshot.val());
            /*check if the date is already in the array to stop duplications*/
            for (let d = 0; d < date.length; d++) {
                if (item.toString() === date[d].toString()) {
                    alreadyDate = true;
                    break
                } else {
                    alreadyDate = false;
                }
            }
            if (alreadyDate != true) {
                date.push(item);
            }
        });
        var select = document.getElementById("admin-date");
        var optionsLength = date.length;
        var optionsValue;
        for (let i = 0; i < optionsLength; i++) {
            optionsValue += i;
            select.options[i] = new Option(date[i], optionsValue);
        }


    })
}

function setProfileName() {
    database.ref('/users/').on('value', (snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            userEmail = auth.currentUser.email;
            avEmail = childSnapshot.val().email;
            if (userEmail === avEmail) {
                document.getElementById("profile-name").innerHTML = childSnapshot.val().playername;
            }
        })
    })
}

function createAvailabilityList() {
    var avName = [];
    var unavName = [];
    var unset = [];
    availTable = document.getElementById("availability-names");
    unavailTable = document.getElementById("unavailability-names");
    unsetavailTable = document.getElementById("notset-names");
    /*clear to stop it writing multiple times on multiple clicks*/
    availTable.innerHTML = "";
    unavailTable.innerHTML = "";
    unsetavailTable.innerHTML = "";
    stringDate = "";
    /*var date = document.getElementById("admin-date").value;*/
    /*----create arrays for those available, not and unknown---*/
    database.ref('/availability/').on('value', (snapshot) => {
            snapshot.forEach(function(childSnapshot) {
                var item = childSnapshot.key;
                stringDate = Object.keys(childSnapshot.val());
                var availabilityVar = snapshot.child(item).child(stringDate).child("available").val();
                if (availabilityVar == 'Yes') {
                    avName.push(item);
                } else if (availabilityVar == 'No') {
                    unavName.push(item);
                } else {
                    unset.push(item);
                }
            });
        })
        /*----display list for those available--*/
    var nameListLength = avName.length;
    for (let i = 0; i < nameListLength; i++) {
        availTable.innerHTML += "<tr><td>" + avName[i] + "</td></tr>"
    }
    /*----display list for those not available----*/
    var unavNameListLength = unavName.length;
    for (let i = 0; i < unavNameListLength; i++) {
        unavailTable.innerHTML += "<tr><td>" + unavName[i] + "</td></tr>"
    }
    /*-----display list for those unknown availability---*/
    var unsetNameListLength = unset.length;
    for (let i = 0; i < unsetNameListLength; i++) {
        unsetavailTable.innerHTML += "<tr><td>" + unset[i] + "</td></tr>"
    }

}

function showAvailabilityEvents() {
    /*var avEventDate = [];
    for (let i = 0; i < ) 
    document.getElementById("event-date").value;*/
    yesSelect = document.getElementById("yes-btn");
    noSelect = document.getElementById("no-btn");
    editSelect = document.getElementById("edit-btn");
    var avEventDate = document.getElementById("event-date").innerHTML;
    /*get player name*/
    database.ref('/users/').on('value', (snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            userEmail = auth.currentUser.email;
            avEmail = childSnapshot.val().email;
            playerName = childSnapshot.val().playername;
            if (userEmail === avEmail) {
                database.ref('/availability/').on('value', (snapshot) => {
                    availabilityVar = snapshot.child(playerName).child(avEventDate).child("available").val();
                    if (availabilityVar == "Yes") {
                        yesSelect.style.display = "inline-block";
                        noSelect.style.display = "none";
                        editSelect.style.display = "inline-block";
                    } else if (availabilityVar == "No") {
                        noSelect.style.display = "inline-block";
                        yesSelect.style.display = "none";
                        editSelect.style.display = "inline-block";
                    } else {
                        noSelect.style.display = "inline-block";
                        yesSelect.style.display = "inline-block";
                        editSelect.style.display = "none";
                    }
                })
            }
        })
    })


}