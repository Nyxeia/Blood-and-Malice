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
          let hasDescription = true;

          switch(categoryId) {
            case 'c1':
              descriptionDiv.textContent = '— the way of shadows —';
              break;
            case 'c2': 
              descriptionDiv.textContent = '— children of blood and bones —';
              break;
            case 'c3': 
              descriptionDiv.textContent = '— of ash and moonlight —';
              break;
            case 'c4': 
              descriptionDiv.textContent = '— through the looking glass —';
              break;
            case 'c5':
              descriptionDiv.textContent = '— the darkness between us —';
              break;
            case 'c6':
              descriptionDiv.textContent = '— welcome to the playground —';
              break;
            case 'c7':
              descriptionDiv.textContent = '— embrace the madness —';
              break;
            case 'c8':
              descriptionDiv.textContent = '— to be born again —';
              break;
            default:
              hasDescription = false;
              h2.style.marginTop = '25px';
              break;
          }
          
          // Insérer la nouvelle div après le h2
          if (hasDescription) {
            h2.insertAdjacentElement('afterend', descriptionDiv);
          }
        }
      }
    });
  });