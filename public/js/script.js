/*------------------auth status------------------------*/
let loggedIn = document.getElementById("loggedIn");
const auth = firebase.auth();
const database = firebase.database();



auth.onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById("availability").style.display = "inline-block"
        console.log("logged in")
        loggedInObjects();
    } else {
        document.getElementById("availability").style.display = "none"
        console.log("logged out")
        loggedOutObjects();
    }
})

// changes made to webpage when user logs in
function loggedInObjects() {
    document.getElementById("signup-nav").style.display = "none";
    document.getElementById("login-nav").style.display = "none";
    document.getElementById("logout-nav").style.display = "inline-block";
    document.getElementById("userInfo").style.display = "block";
    /*document.getElementById("email").style.display = "none";
    document.getElementById("password").style.display = "none";
    document.getElementById("name").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    // tells user they are logged in
    var thisUser = auth.currentUser;
    let html = `<p> You are logged in as: <strong> ${thisUser.email}</strong></p>`;
    loggedIn.innerHTML = html;*/
}

function loggedOutObjects() {
    document.getElementById("signup-nav").style.display = "inline-block";
    document.getElementById("login-nav").style.display = "inline-block";
    document.getElementById("logout-nav").style.display = "none";
    document.getElementById("email").style.display = "inline-block";
    document.getElementById("password").style.display = "inline-block";
    document.getElementById("userInfo").style.display = "none";
    document.getElementById("signUp").style.display = "inline-block";
    loggedIn.innerHTML = "";
}

function sendNewUserToDatabase() {
    /*Send info to database*/
    playername = document.getElementById("name").value;
    email = document.getElementById("email").value;
    database.ref('users/').push({
        playername: playername,
        email: email,
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
            var dbUser = auth.user
            yesSelect = document.getElementById("yes-btn");
            noSelect = document.getElementById("no-btn");
            editSelect = document.getElementById("edit-btn");

            yesSelect.addEventListener("click", function() {
                noSelect.style.display = "none";
                editSelect.style.display = "inline-block";
            });
            noSelect.addEventListener("click", function() {
                yesSelect.style.display = "none";
                editSelect.style.display = "inline-block";
            });
            editSelect.addEventListener("click", function() {
                yesSelect.style.display = "inline-block";
                noSelect.style.display = "inline-block";
                editSelect.style.display = "none";
            });
        } else {
            alert("There has been a problem authenticating you")
        }
    })
}