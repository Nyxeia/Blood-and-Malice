document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les titres de catégorie
    const categoryTitles = document.querySelectorAll('div.cate_title');
    
    categoryTitles.forEach(function(titleDiv) {

      const h2 = titleDiv.querySelector('h2');
      
      if (h2) {
        // Trouver le parent suivant avec la classe "category"
        const categoryDiv = titleDiv.nextElementSibling;
        
        if (categoryDiv && categoryDiv.classList.contains('category')) {

          const categoryId = categoryDiv.id;
          const descriptionDiv = document.createElement('div');
          descriptionDiv.className = 'cate_quote';
          
          switch(categoryId) {
            case 'c1':
              descriptionDiv.textContent = '— Une jolie petite quote par ici —';
              break;
            case 'f2':
              descriptionDiv.textContent = '— Ceci est la corbeille —';
              break;
            default:
              break;
          }
          
          // Insérer la nouvelle div après le h2
          h2.insertAdjacentElement('afterend', descriptionDiv);
        }
      }
    });
  });