document.addEventListener('DOMContentLoaded', () => {

document.getElementById("navbar-close").addEventListener("click", function() {
            this.classList.toggle("active");
            console.log("toggling");
            var panel = document.getElementById("pa-wrap");
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                console.log("closing");
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                console.log("opening");
            }
    });

});