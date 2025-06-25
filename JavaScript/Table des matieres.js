// Fonction pour générer la table des matières
function generateTableOfContents() {
    // Récupérer l'élément post_nav
    const postNav = document.querySelector('.post_nav');
    
    if (!postNav) {
        return;
    }
    
    // Récupérer tous les éléments avec un ID commençant par "section"
    const sections = document.querySelectorAll('[id^="section"]');
    
    if (sections.length === 0) {
        return;
    }
    
    // Créer le conteneur de la table des matières
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    
    // Ajouter un titre pour la table des matières
    const tocTitle = document.createElement('h3');
    tocTitle.textContent = 'Table des matières';
    tocTitle.className = 'toc-title';
    tocContainer.appendChild(tocTitle);
    
    // Créer la liste
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    // Pour chaque section trouvée
    sections.forEach((section, index) => {
        // Récupérer le texte du titre (généralement le premier élément texte ou span dans la section)
        let sectionTitle = '';
        
        // Chercher le titre dans différents éléments possibles
        const titleElement = section.querySelector('span') || 
                           section.querySelector('u') || 
                           section;
        
        if (titleElement) {
            sectionTitle = titleElement.textContent.trim();
        }
        
        // Si pas de titre trouvé, utiliser un titre par défaut
        if (!sectionTitle) {
            sectionTitle = `Section ${index + 1}`;
        }
        
        // Créer l'élément de liste
        const listItem = document.createElement('li');
        listItem.className = 'toc-item';
        
        // Créer le lien d'ancrage
        const anchor = document.createElement('a');
        anchor.href = `#${section.id}`;
        anchor.textContent = sectionTitle;
        anchor.className = 'toc-link';
        
        // Ajouter un comportement de défilement fluide au clic avec offset
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                const yOffset = -90; // Offset négatif de 85px pour la barre de navigation
                const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                 window.scrollTo(0, y);
            }
        });
        
        listItem.appendChild(anchor);
        tocList.appendChild(listItem);
    });
    
    tocContainer.appendChild(tocList);
    
    // Vider post_nav et ajouter la table des matières
    postNav.innerHTML = '';
    postNav.appendChild(tocContainer);
}

// Exécuter la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', generateTableOfContents);

// Alternative : exécuter immédiatement si le DOM est déjà chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateTableOfContents);
} else {
    generateTableOfContents();
}