function generateTableOfContents() {
    
    const annexeDiv = document.querySelector('.hybrid');
    if (!annexeDiv) {
        return;
    }
    const postNav = document.querySelector('.post_nav');
    if (!postNav) {
        return;
    }
    
    const sections = document.querySelectorAll('[id^="section"]');
    
    if (sections.length === 0) {
        return;
    }
    
    // Créer le conteneur de la table des matières
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents hybrid';

// Récupérer le pseudo et l'utiliser comme titre
    const postPseudo = document.querySelector('.post_pseudo');
    const tocTitle = document.createElement('div');
    if (postPseudo) {
        // Cloner le contenu du pseudo (pour garder les liens et le formatage)
        tocTitle.innerHTML = postPseudo.innerHTML;
        // Supprimer le pseudo original
        postPseudo.remove();
    } else {
        // Fallback au cas où le pseudo n'existe pas
        tocTitle.textContent = 'Table des matières';
    }
    tocTitle.className = 'toc-pseudo';
    tocContainer.appendChild(tocTitle);

    // Récupérer et déplacer l'avatar du profil
    const postAvatar = document.querySelector('.post_avatar');
    if (postAvatar) {
        const tocImage = postAvatar.cloneNode(true);
        tocImage.className = 'toc-avatar';
        tocContainer.appendChild(tocImage);
        // Supprimer l'avatar original du profil
        postAvatar.remove();
    }
    
    // separateur
    const tocSep = document.createElement('hr1');
    tocSep.className = 'toc-hr';
    tocContainer.appendChild(tocSep);

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
        anchor.setAttribute('data-target', targetId); // Pour identifier la cible
        
        // défilement au clic avec offset
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                const yOffset = -90; // Offset négatif de 90px pour la barre de navigation
                const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo(0, y);
                
                // Mettre à jour immédiatement l'état actif après le clic
                setTimeout(() => updateActiveSection(), 100);
            }
        });
        
        return anchor;
    }
    
    // Créer la table des matières
    sections.forEach((section, index) => {
        // Récupérer le titre de la section
        const sectionTitle = getTitleFromElement(section, `Section ${index + 1}`);
        
        // Créer l'élément de liste pour la section
        const listItem = document.createElement('li');
        listItem.className = 'toc-item toc-section';
        
        // Créer le lien d'ancrage pour la section
        const sectionAnchor = createAnchorLink(section.id, sectionTitle, 'toc-link toc-section-link');
        listItem.appendChild(sectionAnchor);
        
        tocList.appendChild(listItem);
    });
    
    tocContainer.appendChild(tocList);
    
    // Vider post_nav et ajouter la table des matières
    postNav.innerHTML = '';
    postNav.appendChild(tocContainer);

    makeTableOfContentsSticky(tocContainer, postNav);
    
    // Initialiser le système de section active
    initializeActiveSectionTracking();
}

// Fonction pour gérer la section active
function initializeActiveSectionTracking() {
    let isScrolling = false;
    
    function updateActiveSection() {
        // Récupérer toutes les sections
        const allSections = document.querySelectorAll('[id^="section"]');
        const tocLinks = document.querySelectorAll('.toc-link');
        
        // Supprimer les classes actives existantes
        tocLinks.forEach(link => link.classList.remove('toc-active', 'toc-parent-active'));
        
        // Convertir en array et trier par position dans le DOM
        const sectionsArray = Array.from(allSections).sort((a, b) => {
            return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
        
        let activeSection = null;
        const viewportTop = 300; // Zone de lecture optimale (un peu plus bas que la barre de navigation)
        const viewportBottom = window.innerHeight * 0.7; // On considère la partie haute de l'écran comme zone de lecture
        
        // Approche différente : trouver quelle section est dans la zone de lecture optimale
        for (let i = 0; i < sectionsArray.length; i++) {
            const section = sectionsArray[i];
            const rect = section.getBoundingClientRect();
            
            // Si le haut de la section est au-dessus de la zone de lecture
            // et le bas est en dessous, alors on est en train de lire cette section
            if (rect.top <= viewportTop && rect.bottom >= viewportTop) {
                activeSection = section;
                break;
            }
        }
        
        // Si aucune section ne traverse la zone de lecture, 
        // prendre la dernière section passée (celle qui est juste au-dessus)
        if (!activeSection) {
            for (let i = sectionsArray.length - 1; i >= 0; i--) {
                const section = sectionsArray[i];
                const rect = section.getBoundingClientRect();
                
                // Prendre la dernière section dont le haut est passé
                if (rect.top <= viewportTop) {
                    activeSection = section;
                    break;
                }
            }
        }
        
        // En dernier recours, si on est tout en haut, prendre la première section
        if (!activeSection && sectionsArray.length > 0) {
            activeSection = sectionsArray[0];
        }
        
        // Activer le lien correspondant
        if (activeSection) {
            const targetId = activeSection.id;
            const activeLink = document.querySelector(`.toc-link[data-target="${targetId}"]`);
            
            if (activeLink) {
                activeLink.classList.add('toc-active');
            }
        }
    }
    
    // Fonction de debounce pour optimiser les performances
    function debounceScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateActiveSection();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }
    
    // Écouter le scroll
    window.addEventListener('scroll', debounceScroll);
    
    // Mise à jour initiale
    updateActiveSection();
    
    // Expose la fonction pour usage externe
    window.updateActiveSection = updateActiveSection;
}

function makeTableOfContentsSticky(tocContainer, originalContainer) {
    let state = 'normal'; // 'normal', 'fixed', or 'bottom'
    const originalParent = originalContainer;
    let placeholder = null;
    
    function handleScroll() {
        const originalRect = originalParent.getBoundingClientRect();
        
        // Trouver le message actuel (celui qui contient .hybrid)
        const currentPostRow = tocContainer.closest('.post_row');
        
        // Trouver le prochain message
        let nextPostRow = null;
        if (currentPostRow) {
            nextPostRow = currentPostRow.nextElementSibling;
            // Chercher le prochain élément avec la classe post_row
            while (nextPostRow && !nextPostRow.classList.contains('post_row')) {
                nextPostRow = nextPostRow.nextElementSibling;
            }
        }
        
        // Vérifier si le prochain message contient .hybrid
        const nextHasHybrid = nextPostRow ? nextPostRow.querySelector('.hybrid') !== null : false;
        
        // Déterminer la limite de scroll
        let limitElement = null;
        let limitRect = null;
        
        if (nextPostRow && !nextHasHybrid) {
            // Si le prochain message n'a pas .hybrid, utiliser son début comme limite
            limitElement = nextPostRow;
            limitRect = limitElement.getBoundingClientRect();
        } else {
            // Sinon, utiliser le dernier message de la page
            const allPostRows = document.querySelectorAll('.post_row');
            limitElement = allPostRows[allPostRows.length - 1];
            limitRect = limitElement ? limitElement.getBoundingClientRect() : null;
        }
        
        if (!limitRect) {
            return;
        }
        
        const tocHeight = tocContainer.offsetHeight;
        
        // Calculer les seuils
        const shouldStartFixed = originalRect.top <= 85;
        const tocBottomIfFixed = 85 + tocHeight;
        const wouldOverflow = tocBottomIfFixed > limitRect.top;
        
        // Déterminer le nouvel état
        let newState = state;
        
        if (state === 'normal') {
            if (shouldStartFixed && !wouldOverflow) {
                newState = 'fixed';
            } else if (shouldStartFixed && wouldOverflow) {
                newState = 'bottom';
            }
        } else if (state === 'fixed') {
            if (!shouldStartFixed) {
                newState = 'normal';
            } else if (wouldOverflow) {
                newState = 'bottom';
            }
        } else if (state === 'bottom') {
            // Calculer si on peut revenir en fixed
            const scrolledBackUp = !wouldOverflow && shouldStartFixed;
            const scrolledAboveStart = !shouldStartFixed;
            
            if (scrolledAboveStart) {
                newState = 'normal';
            } else if (scrolledBackUp) {
                newState = 'fixed';
            }
        }
        
        // Appliquer les changements si l'état a changé
        if (newState !== state) {
            // Nettoyer l'état précédent
            if (state === 'fixed' || state === 'bottom') {
                if (placeholder) {
                    placeholder.remove();
                    placeholder = null;
                }
            }
            
            // Appliquer le nouvel état
            if (newState === 'normal') {
                // Remettre dans le conteneur original si nécessaire
                if (tocContainer.parentElement === document.body) {
                    originalParent.appendChild(tocContainer);
                }
                
                tocContainer.style.position = '';
                tocContainer.style.top = '';
                tocContainer.style.left = '';
                tocContainer.style.width = '';
      
            } else if (newState === 'fixed') {
                const width = tocContainer.offsetWidth;
                const left = originalRect.left;
                
                // Remettre dans le conteneur original si nécessaire
                if (tocContainer.parentElement === document.body) {
                    originalParent.appendChild(tocContainer);
                }
                
                tocContainer.style.position = 'fixed';
                tocContainer.style.top = '85px';
                tocContainer.style.left = left + 'px';
                tocContainer.style.width = width + 'px';
                
                // Créer placeholder
                if (!placeholder) {
                    placeholder = document.createElement('div');
                    placeholder.className = 'toc-placeholder';
                    placeholder.style.height = tocHeight + 'px';
                    originalParent.appendChild(placeholder);
                }
            } else if (newState === 'bottom') {
                // Positionner en absolu par rapport à la limite déterminée
                const width = tocContainer.offsetWidth;
                
                // Calculer la position absolue où le TOC doit s'arrêter
                const stopPosition = limitRect.top - tocHeight + window.pageYOffset;
                
                // S'assurer que le placeholder existe pour maintenir la hauteur
                if (!placeholder) {
                    placeholder = document.createElement('div');
                    placeholder.className = 'toc-placeholder';
                    placeholder.style.height = tocHeight + 'px';
                    originalParent.appendChild(placeholder);
                }
                
                // Ajouter le TOC au body pour le positionner en absolu
                document.body.appendChild(tocContainer);
                
                tocContainer.style.position = 'absolute';
                tocContainer.style.top = stopPosition + 'px';
                tocContainer.style.left = (originalRect.left + window.pageXOffset) + 'px';
                tocContainer.style.width = width + 'px';
            }
            
            state = newState;
        }
        
        // Mettre à jour la position horizontale si fixed
        if (state === 'fixed') {
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