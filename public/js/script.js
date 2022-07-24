/*------------------auth status------------------------*/
var loggedIn = document.getElementById("loggedIn");
const auth = firebase.auth();
const database = firebase.database();
const user = auth.currentUser;
const storage = firebase.storage();
const storageRef = storage.ref();




auth.onAuthStateChanged(function(user) {
    if (user) {
        loggedInObjects();
        if (window.location.pathname == '/events.html') {
            document.getElementById("availability").style.display = "inline-block"
        }
        getPic();
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
        document.getElementById("eventInfo").style.display = "block";
        document.getElementById("profile-view").style.visibility = "visible";
        document.getElementById("profile-view").style.display = "flex";
        /*document.getElementById("profile-view").classList.add("d-flex");*/
        if (window.location.pathname != '/signup.html' && window.location.pathname != '/login.html') {
            document.getElementById("logout-nav").style.display = "inline-block";
        }
        /*if (window.location.pathname == '/signup.html') {
            document.getElementById("formContainer").style.display = "none";
        }*/
    }
}

function loggedOutObjects() {
    if (window.location.pathname != '/admin.html') {
        document.getElementById("signup-nav").style.display = "inline-block";
        document.getElementById("login-nav").style.display = "inline-block";
        document.getElementById("userInfo").style.display = "none";
        document.getElementById("eventInfo").style.display = "none";
        document.getElementById("profile-view").classList.remove("d-flex");
        document.getElementById("profile-view").style.visibility = "hidden";
        if (window.location.pathname != '/signup.html' || window.location.pathname != '/login.html') {
            document.getElementById("logout-nav").style.display = "none";
        }
        /*if (window.location.pathname == '/signup.html' || window.location.pathname != '/login.html') {
            document.getElementById("formContainer").style.display = "inline-block";
        }*/
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
    playername = document.getElementById("name").value;
    email = document.getElementById("email").value;
    id = makeId();
    /*put picture in storage if not blank*/
    profilepic = document.getElementById("profile-photo").files[0];
    if (profilepic != "") {
        storageRef.child('/images/' + id).put(profilepic);
    }
    database.ref('users/' + id).set({
        playername: playername,
        email: email,
        profilepic: profilepic,
    })
}

function signUp() {
    /*Send User to Database*/
    playername = document.getElementById("name").value;
    email = document.getElementById("email").value;
    id = makeId();
    /*put picture in storage if not blank*/
    profilepic = document.getElementById("profile-photo").files[0];
    if (profilepic != "") {
        storageRef.child('/images/' + id).put(profilepic);
    }
    database.ref('users/' + id).set({
            playername: playername,
            email: email,
            profilepic: profilepic,
        })
        /*Authentication*/
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    auth.createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed in 
            alert("Signed up");
            window.location.href = "http://localhost:5000/index.html";
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode + errorMessage);
        });
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
            database.ref('/users/' + id).on('value', (snapshot) => {
                currentPlayer = snapshot.val().id;
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
    auth.onAuthStateChanged(function(user) {
        if (user) {
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
    cameraDefault = document.getElementById("profile-click");
    auth.onAuthStateChanged(function(user) {
        database.ref('/users/').on('value', (snapshot) => {
            snapshot.forEach(function(childSnapshot) {
                userEmail = auth.currentUser.email;
                avEmail = childSnapshot.val().email;
                if (userEmail === avEmail) {
                    var image = firebase.storage().ref('images/' + 'YOM6URXUYRIV');
                    cameraDefault.innerHTML = '<i class="fa-solid fa-camera fa-xl camera-pp-style"></i>'
                    if (image != null) {
                        image.getDownloadURL().then(imageUrl => {
                            console.log(imageUrl)
                            if (imageUrl != null || imageUrl != undefined) {
                                cameraDefault.innerHTML = '<img src="" id="profile-pic" class="profile-pic"></img>;'
                                document.getElementById("profile-pic").src = imageUrl;
                                console.log("here");
                            } else {
                                cameraDefault.innerHTML = '<i class="fa-solid fa-camera fa-xl camera-pp-style"></i>'
                                console.log("no here");
                            }
                        });
                    }
                }

            })
        })
    })
}

function Practice() {
    var image = firebase.storage().ref('images/' + 'me dribble.jpg');
    console.log(image.getDownloadURL());
    image.getDownloadURL().then(imageUrl => {
        console.log(imageUrl);
    })
}