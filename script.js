const elements = document.querySelectorAll(".simple-animate");

window.addEventListener("scroll", () => {
    elements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("show");
        }
    });
});

window.dispatchEvent(new Event("scroll"));
