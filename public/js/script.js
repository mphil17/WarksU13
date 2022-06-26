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
        }
        document.getElementById("signUp").style.display = "none";
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
        }
        document.getElementById("userInfo").style.display = "none";
        document.getElementById("signUp").style.display = "inline-block";
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
    database.ref('/availability/').on('value', (snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            var item = Object.keys(childSnapshot.val());
            date.push(item);
        });

        var select = document.getElementById("admin-date");
        var optionsLength = select.options.length;
        var optionsValue;
        for (let i = 0; i < optionsLength; i++) {
            optionsValue += i;
        }
        select.options[optionsLength] = new Option(date, optionsValue);
    })
}

function createAvailabilityList() {

}