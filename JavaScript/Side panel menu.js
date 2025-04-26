let isNavOpen = false;

function toggleNav() {
  const sidenav = document.getElementById("sidenav");
  const menuIcon = document.querySelector(".menu-icon");
  
  if (isNavOpen) {
    menuIcon.classList.remove("active");
    sidenav.classList.remove("open");
    isNavOpen = false;
  } else {
    menuIcon.classList.add("active");
    sidenav.classList.add("open");
    isNavOpen = true;
  }
}

document.addEventListener("click", function(event) {
  const sidenav = document.getElementById("sidenav");
  const menuIcon = document.querySelector(".menu-icon");
  const themeControls = document.querySelector("[data-theme-controls]");
  
  if (!sidenav.contains(event.target) && !event.target.closest(".menu-icon") && !event.target.closest("[data-theme-controls]") && isNavOpen) {
    toggleNav();
  }
});

if (isNavOpen)
{
document.getElementById("sidenav").addEventListener("click", function(event) {
  event.stopPropagation();
});
}


  const notificationIcon = document.querySelector('#notiffi_button ion-icon[name="notifications"]');
  const notiffiPanel = document.querySelector('#notiffi_panel');
  
  if (notiffiPanel && notificationIcon) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          if (notiffiPanel.classList.contains('open')) {
            notificationIcon.classList.add('active');
          } else {
            notificationIcon.classList.remove('active');
          }
        }
      });
    });
    
    observer.observe(notiffiPanel, { attributes: true });
  }