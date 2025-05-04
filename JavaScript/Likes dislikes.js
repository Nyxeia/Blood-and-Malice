function updateSectionBorder(section) {

    const likeList = section.querySelector('.fa_like_list');
    const dislikeList = section.querySelector('.fa_dislike_list');
    
    const likeStyle = window.getComputedStyle(likeList);
    const dislikeStyle = window.getComputedStyle(dislikeList);
    
    if (likeStyle.display === 'none' && dislikeStyle.display === 'none') {
      section.style.borderBottom = 'none';
      section.style.marginBottom = '0';
    } else {
      section.style.borderBottom = 'var(--border)';
      section.style.marginBottom = '15px';
    }
  }
  
  // called by onClick event
  function checkListDisplayBorder(buttonElement) {
    const likeSection = buttonElement.closest('.like_section');
    
    if (likeSection) {
      // Small timeout to let any display changes take effect
      setTimeout(function() {
        updateSectionBorder(likeSection);
      }, 50);
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.like_section').forEach(section => {
      updateSectionBorder(section);
    });
  });