window.onload = (event) => {
    loggedOutObjects();
};

/*------------------auth status------------------------*/
let loggedIn = document.getElementById("loggedIn");
const auth = firebase.auth();



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
    // tells user they are logged in
    var thisUser = firebase.auth().currentUser;
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
    loggedIn.innerHTML = "";
}

function signUp() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));

    alert("Signed up");
    email.style.display = "none";
    password.style.display = "none";
}

function signOut() {
    const promise = auth.signOut();
    promise.catch(e => alert(e.message));
    alert("Signed out")

    var email = document.getElementById("email");
    var password = document.getElementById("password");
    email.style.display = "inline-block";
    password.style.display = "inline-block";
    let signUp = document.getElementById("signUp");
    let signIn = document.getElementById("signIn");
    let signOut = document.getElementById("signOut");
    signUp.style.display = "inline-block";
    signIn.style.display = "inline-block";
    signOut.style.display = "none";
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