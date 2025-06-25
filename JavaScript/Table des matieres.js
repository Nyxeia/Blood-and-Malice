function generateTableOfContents() {

    const postNav = document.querySelector('.post_nav');
    
    if (!postNav) {
        return;
    }
    
    const sections = document.querySelectorAll('[id^="section"]');
    const subsections = document.querySelectorAll('[id^="subsection"]');
    
    if (sections.length === 0) {
        return;
    }
    
    // Créer le conteneur de la table des matières
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    
    // titre pour la table des matières
    const tocTitle = document.createElement('h3');
    tocTitle.textContent = 'Table des matières';
    tocTitle.className = 'toc-title';
    tocContainer.appendChild(tocTitle);
    
    // liste principale
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    // Fonction pour extraire le titre d'un élément
    function getTitleFromElement(element, defaultTitle) {
        let title = '';
        
        const titleElement = element.querySelector('span') || 
                           element.querySelector('u') || 
                           element;
        
        if (titleElement) {
            title = titleElement.textContent.trim();
        }
        
        return title;
    }
    
    // Fonction pour créer un lien d'ancrage
    function createAnchorLink(targetId, title, className = 'toc-link') {
        const anchor = document.createElement('a');
        anchor.href = `#${targetId}`;
        anchor.textContent = title;
        anchor.className = className;
        
        // défilement au clic avec offset
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                const yOffset = -90; // Offset négatif de 90px pour la barre de navigation
                const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo(0, y);
            }
        });
        
        return anchor;
    }
    
    // Grouper les sous-sections par section (map sous-section -> section)
    const subsectionsBySection = new Map();
    
    subsections.forEach(subsection => {

        const subsectionId = subsection.id;
        const match = subsectionId.match(/subsection(\d+)/);
        
        if (match) {
            const subsectionNumber = parseInt(match[1]);
            
            // Trouver la section parent dans le DOM
            let parentSection = null;
            const allElements = document.querySelectorAll('[id^="section"], [id^="subsection"]');
            
            for (let i = 0; i < allElements.length; i++) {
                if (allElements[i] === subsection) {
                    // Chercher la section précédente
                    for (let j = i - 1; j >= 0; j--) {
                        if (allElements[j].id.startsWith('section') && !allElements[j].id.startsWith('subsection')) {
                            parentSection = allElements[j];
                            break;
                        }
                    }
                    break;
                }
            }
            
            if (parentSection) {
                if (!subsectionsBySection.has(parentSection.id)) {
                    subsectionsBySection.set(parentSection.id, []);
                }
                subsectionsBySection.get(parentSection.id).push(subsection);
            }
        }
    });
    
    // Créer la table des matières
    sections.forEach((section, index) => {

        if (section.id.startsWith('subsection')) {
            return;
        }
        
        // Récupérer le titre de la section
        const sectionTitle = getTitleFromElement(section, `Section ${index + 1}`);
        
        // Créer l'élément de liste pour la section
        const listItem = document.createElement('li');
        listItem.className = 'toc-item toc-section';
        
        // Créer le lien d'ancrage pour la section
        const sectionAnchor = createAnchorLink(section.id, sectionTitle, 'toc-link toc-section-link');
        listItem.appendChild(sectionAnchor);
        
        // Vérifier s'il y a des sous-sections pour cette section
        const sectionSubsections = subsectionsBySection.get(section.id) || [];
        
        if (sectionSubsections.length > 0) {
            // Créer une sous-liste pour les sous-sections
            const subList = document.createElement('ul');
            subList.className = 'toc-sublist';
            
            sectionSubsections.forEach((subsection, subIndex) => {
                const subsectionTitle = getTitleFromElement(subsection, `Sous-section ${subIndex + 1}`);
                
                const subListItem = document.createElement('li');
                subListItem.className = 'toc-item toc-subsection';
                
                const subsectionAnchor = createAnchorLink(subsection.id, subsectionTitle, 'toc-link toc-subsection-link');
                subListItem.appendChild(subsectionAnchor);
                
                subList.appendChild(subListItem);
            });
            
            listItem.appendChild(subList);
        }
        
        tocList.appendChild(listItem);
    });
    
    tocContainer.appendChild(tocList);
    
    // Vider post_nav et ajouter la table des matières
    postNav.innerHTML = '';
    postNav.appendChild(tocContainer);
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateTableOfContents);
} else {
    generateTableOfContents();
}