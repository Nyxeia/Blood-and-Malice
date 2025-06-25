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

    makeTableOfContentsSticky(tocContainer, postNav);
}

function makeTableOfContentsSticky(tocContainer, originalContainer) {
    let isFixed = false;
    const originalParent = originalContainer;
    
    function handleScroll() {
        const originalRect = originalParent.getBoundingClientRect();
        
        // Trouver le dernier post_message de la page
        const allPostMessages = document.querySelectorAll('.container-post');
        const lastPostMessage = allPostMessages[allPostMessages.length - 1];
        
        let shouldBeFixed = originalRect.top <= 85; // Condition de base
        
        // Si on a un dernier post_message, vérifier la position
        if (lastPostMessage && isFixed) {
            const lastPostMessageRect = lastPostMessage.getBoundingClientRect();
            const postNavRect = originalParent.getBoundingClientRect();
            
            // Si le bas du dernier post_message est plus haut que le bas de la post_nav, désactiver
            if (lastPostMessageRect.bottom < postNavRect.bottom) {
                shouldBeFixed = false;
            }

            console.log("last post bottom = " + lastPostMessageRect.bottom);
            console.log("nav bottom = " + postNavRect.bottom);
        }
        
        if (shouldBeFixed && !isFixed) {
            // Passer en mode fixed
            isFixed = true;
            
            // Sauvegarder les dimensions originales
            const width = tocContainer.offsetWidth;
            const left = originalRect.left;
            
            // Appliquer uniquement le style fixed nécessaire
            tocContainer.style.position = 'fixed';
            tocContainer.style.top = '85px';
            tocContainer.style.left = left + 'px';
            tocContainer.style.width = width + 'px';
            tocContainer.style.zIndex = '1000';
            
            // Créer un placeholder pour éviter le saut de layout
            const placeholder = document.createElement('div');
            placeholder.className = 'toc-placeholder';
            placeholder.style.height = tocContainer.offsetHeight + 'px';
            originalParent.appendChild(placeholder);
            
        } else if (!shouldBeFixed && isFixed) {
            // Revenir en mode normal
            isFixed = false;
            
            // Supprimer le placeholder
            const placeholder = document.querySelector('.toc-placeholder');
            if (placeholder) {
                placeholder.remove();
            }
            
            // Remettre dans le conteneur original
            tocContainer.style.position = '';
            tocContainer.style.top = '';
            tocContainer.style.left = '';
            tocContainer.style.width = '';
            tocContainer.style.zIndex = '';
        }
        
        // Mettre à jour la position horizontale si en mode fixed (pour le responsive)
        if (isFixed) {
            const newRect = originalParent.getBoundingClientRect();
            tocContainer.style.left = newRect.left + 'px';
        }
    }
    
    // Écouter le scroll et le resize
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Vérification initiale
    handleScroll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateTableOfContents);
} else {
    generateTableOfContents();
}