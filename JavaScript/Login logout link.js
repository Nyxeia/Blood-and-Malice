document.addEventListener('DOMContentLoaded', function () {
    const navbarLogoutLink = document.querySelector('a[id="logout"]');
    const topHeaderLogoutLink = document.getElementById('logout-link');
  
    if (navbarLogoutLink && topHeaderLogoutLink && _userdata.session_logged_in != 0) {

      topHeaderLogoutLink.setAttribute('href', navbarLogoutLink.getAttribute('href'));

    } else {

      topHeaderLogoutLink.setAttribute('href', 'https://bloodandmalice.forumactif.com/login');
      
      topHeaderLogoutLink.innerHTML = '<ion-icon name="log-in-outline"></ion-icon>';
    }
  });