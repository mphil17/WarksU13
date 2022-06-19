let firstWindowLoad = false;

window.onload = (event) => {
    if (firstWindowLoad == false) {
        loggedOutObjects();
        firstWindowLoad = true;
    }
};


/*------------------auth status------------------------*/
let loggedIn = document.getElementById("loggedIn");
const auth = firebase.auth();
const database = firebase.database();



auth.onAuthStateChanged(function(user) {
    if (user) {
        loggedInObjects();
        // sendData();
    } else {
        loggedOutObjects();
    }
})

// changes made to webpage when user logs in
function loggedInObjects() {
    document.getElementById("signup-nav").style.display = "none";
    document.getElementById("login-nav").style.display = "none";
    document.getElementById("logout-nav").style.display = "inline-block";
    document.getElementById("userInfo").style.display = "block";
    document.getElementById("email").style.display = "none";
    document.getElementById("password").style.display = "none";
    document.getElementById("name").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    // tells user they are logged in
    var thisUser = auth.currentUser;
    let html = `<p> You are logged in as: <strong> ${thisUser.email}</strong></p>`;
    loggedIn.innerHTML = html;
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
    console.log("running function")
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