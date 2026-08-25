// Simple welcome message
console.log("🔥 Welcome to PJ 1 | IGNITE!");


// Navbar effect when scrolling

window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.style.background = "rgba(5, 5, 5, 0.97)";
    } else {
        navbar.style.background = "rgba(8, 8, 8, 0.85)";
    }

});