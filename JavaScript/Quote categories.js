document.addEventListener('DOMContentLoaded', function() {

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
              descriptionDiv.textContent = '— quote partie 1 —';
              break;
            case 'c2':
              descriptionDiv.textContent = '— quote partie 2 —';
              break;
            case 'c3':
              descriptionDiv.textContent = '— quote partie 3 —';
              break;
            case 'c4':
              descriptionDiv.textContent = '— quote partie 4 —';
              break;
            case 'c5':
              descriptionDiv.textContent = '— quote partie 5 —';
              break;
            case 'c6':
              descriptionDiv.textContent = '— quote partie 6 —';
              break;
            case 'c7':
              descriptionDiv.textContent = '— quote partie 7 —';
              break;
            case 'c8':
              descriptionDiv.textContent = '— quote corbeille —';
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