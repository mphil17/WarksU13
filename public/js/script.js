/*------------------auth status------------------------*/
let loggedIn = document.getElementById("loggedIn");
const auth = firebase.auth();
const database = firebase.database();
const user = auth.currentUser;
const storage = firebase.storage();
const storageRef = storage.ref();

/*------------for my own IDs------------------*/
let playerNumber = 1



auth.onAuthStateChanged(function(user) {
    if (user) {
        loggedInObjects();
        if (window.location.pathname == '/events.html') {
            document.getElementById("availability").style.display = "inline-block"
        }
    } else {
        loggedOutObjects();
        if (window.location.pathname == '/events.html') {
            document.getElementById("availability").style.display = "none"
        }
    }
})

// changes made to webpage when user logs in
function loggedInObjects() {
    if (window.location.pathname != '/admin.html') {
        document.getElementById("signup-nav").style.display = "none";
        document.getElementById("login-nav").style.display = "none";
        document.getElementById("userInfo").style.display = "block";
        document.getElementById("profile-view").style.display = "none";
        if (window.location.pathname != '/signup.html') {
            document.getElementById("logout-nav").style.display = "inline-block";
        }
        if (window.location.pathname == '/signup.html') {
            document.getElementById("email").style.display = "none";
            document.getElementById("password").style.display = "none";
            document.getElementById("name").style.display = "none";
            document.getElementById("signUp").style.display = "none";
        }
    }
}

function loggedOutObjects() {
    if (window.location.pathname != '/admin.html') {
        document.getElementById("signup-nav").style.display = "inline-block";
        document.getElementById("login-nav").style.display = "inline-block";
        document.getElementById("profile-view").style.display = "block";
        if (window.location.pathname != '/signup.html') {
            document.getElementById("logout-nav").style.display = "none";
        }
        if (window.location.pathname == '/signup.html') {
            document.getElementById("email").style.display = "inline-block";
            document.getElementById("password").style.display = "inline-block";
            document.getElementById("name").style.display = "inline-block";
            document.getElementById("signUp").style.display = "inline-block";
        }
        document.getElementById("userInfo").style.display = "none";

    }
}

function makeId() {
    let ID = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < 12; i++) {
        ID += characters.charAt(Math.floor(Math.random() * 36));
    }
    return ID;
}


function sendNewUserToDatabase() {
    /*put picture in storage if not blank*/
    profilepic = document.getElementById("profile-photo").value;
    var bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
    /*var file = new File(["profilepic"], profilepic)*/
    if (profilepic != "") {
        storageRef.child('/images/').put(bytes);
    }

    /*var profilePicRef = storage.child("profile picture");

    // Create a reference to 'images/mountains.jpg'
    var profilePicFullRef = storage.child(profilepic);*/

    /*Send info to database*/
    playername = document.getElementById("name").value;
    email = document.getElementById("email").value;
    id = makeId();
    console.log(profilepic);
    database.ref('users/' + id).set({
        playername: playername,
        email: email,
        profilepic: profilepic,
    })
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

    window.location.href = "http://localhost:5000/login.html";
}

function signIn() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    auth.signInWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            alert("Signed in")
            email.style.display = "none";
            password.style.display = "none";
            window.location.href = "http://localhost:5000/index.html";
        })
        .catch((error) => {
            alert("Incorrect email or password");
        });
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
            if (window.location.pathname == '/account.html') {
                document.getElementById("email-account").value = userEmail;
                document.getElementById("email-account").disabled = true;
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

function updateAccountDetails() {
    /*let newPassword = document.getElementById("password-account");
    let password = document.getElementById("old-password-account");
    let email = document.getElementById("email-account");
    auth.signInWithEmailAndPassword(email.value, password.value)
        .then(() => {
            user.updatePassword(newPassword.value).then(() => {
                alert("Password Updated")
            }, (error) => {
                // An error happened.
            });
        })*/
}

function getPic() {
    pp = document.getElementById("pppic");
    database.ref('/users/').on('value', (snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            pp.innerHTML = childSnapshot.val().profilepic;
        })
    })
}