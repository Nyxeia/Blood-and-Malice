function generateTableOfContents() {
    
    // Détecter le type de contenu
    const annexeDiv = document.querySelector('.annexe');
    const hybridDiv = document.querySelector('.hybrid');
    
    // Si aucun des deux types n'est présent, ne rien faire
    if (!annexeDiv && !hybridDiv) {
        return;
    }
    
    const postNav = document.querySelector('.post_nav');
    if (!postNav) {
        return;
    }
    
    // Déterminer le mode : 'annexe' ou 'hybrid'
    const mode = hybridDiv ? 'hybrid' : 'annexe';
    
    const sections = document.querySelectorAll('[id^="section"]:not([id^="subsection"])');
    const subsections = mode === 'annexe' ? document.querySelectorAll('[id^="subsection"]') : [];
    
    if (sections.length === 0) {
        return;
    }
    
    // Créer le conteneur de la table des matières
    const tocContainer = document.createElement('div');
    tocContainer.className = mode === 'hybrid' ? 'table-of-contents hybrid' : 'table-of-contents';

    if (mode === 'hybrid') {
        const postPseudo = document.querySelector('.post_pseudo');
        const tocTitle = document.createElement('div');
        if (postPseudo) {
            tocTitle.innerHTML = postPseudo.innerHTML;
            postPseudo.remove();
        } 
        tocTitle.className = 'toc-pseudo';
        tocContainer.appendChild(tocTitle);

        const postAvatar = document.querySelector('.post_avatar');
        if (postAvatar) {
            const tocImage = postAvatar.cloneNode(true);
            tocImage.className = 'toc-avatar';
            tocContainer.appendChild(tocImage);
            postAvatar.remove();
        }
    } else {
        const headerImage = document.querySelector('header img');
        if (headerImage) {
            const tocImage = headerImage.cloneNode(true);
            tocImage.className = 'toc-image';
            tocContainer.appendChild(tocImage);
            headerImage.remove();
        }
        
        const tocTitle = document.createElement('div');
        tocTitle.textContent = 'Table des matières';
        tocTitle.className = 'toc-title';
        tocContainer.appendChild(tocTitle);

        // titre du sujet en sous-titre
        const subtitleTxt = document.querySelector('header t0');
        const subTitle = document.createElement('div');
        if (subtitleTxt) {
            subTitle.innerHTML = "— " + subtitleTxt.innerHTML + " —";
        } 
        subTitle.className = 'toc-subtitle';
        tocContainer.appendChild(subTitle);
    }
    
    // Séparateur
    const tocSep = document.createElement('hr1');
    tocSep.className = 'toc-hr';
    tocContainer.appendChild(tocSep);

    // Liste principale
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
        anchor.setAttribute('data-target', targetId);
        
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                const yOffset = -90;
                const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo(0, y);
                
                setTimeout(() => updateActiveSection(), 100);
            }
        });
        
        return anchor;
    }
    
    if (mode === 'annexe') {
        // Mode annexe : gérer les sous-sections
        const subsectionsBySection = new Map();
        
        subsections.forEach(subsection => {
            const subsectionId = subsection.id;
            const match = subsectionId.match(/subsection(\d+)/);
            
            if (match) {
                let parentSection = null;
                const allElements = document.querySelectorAll('[id^="section"], [id^="subsection"]');
                
                for (let i = 0; i < allElements.length; i++) {
                    if (allElements[i] === subsection) {
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
        
        // Créer la table des matières avec sous-sections
        sections.forEach((section, index) => {
            if (section.id.startsWith('subsection')) {
                return;
            }
            
            const sectionTitle = getTitleFromElement(section, `Section ${index + 1}`);
            
            const listItem = document.createElement('li');
            listItem.className = 'toc-item toc-section';
            
            const sectionAnchor = createAnchorLink(section.id, sectionTitle, 'toc-link toc-section-link');
            listItem.appendChild(sectionAnchor);
            
            const sectionSubsections = subsectionsBySection.get(section.id) || [];
            
            if (sectionSubsections.length > 0) {
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
    } else {
        // Mode hybrid : sections simples seulement
        sections.forEach((section, index) => {
            const sectionTitle = getTitleFromElement(section, `Section ${index + 1}`);
            
            const listItem = document.createElement('li');
            listItem.className = 'toc-item toc-section';
            
            const sectionAnchor = createAnchorLink(section.id, sectionTitle, 'toc-link toc-section-link');
            listItem.appendChild(sectionAnchor);
            
            tocList.appendChild(listItem);
        });
    }
    
    tocContainer.appendChild(tocList);
    
    postNav.innerHTML = '';
    postNav.appendChild(tocContainer);

    makeTableOfContentsSticky(tocContainer, postNav, mode);
    
    initializeActiveSectionTracking(mode);
}

function initializeActiveSectionTracking(mode) {
    let isScrolling = false;
    
    function updateActiveSection() {
        const allSections = document.querySelectorAll('[id^="section"]');
        const tocLinks = document.querySelectorAll('.toc-link');
        
        tocLinks.forEach(link => link.classList.remove('toc-active', 'toc-parent-active'));
        
        const sectionsArray = Array.from(allSections).sort((a, b) => {
            return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
        
        let activeSection = null;
        const viewportTop = 300;
        
        for (let i = 0; i < sectionsArray.length; i++) {
            const section = sectionsArray[i];
            const rect = section.getBoundingClientRect();
            
            if (rect.top <= viewportTop && rect.bottom >= viewportTop) {
                activeSection = section;
                break;
            }
        }
        
        if (!activeSection) {
            for (let i = sectionsArray.length - 1; i >= 0; i--) {
                const section = sectionsArray[i];
                const rect = section.getBoundingClientRect();
                
                if (rect.top <= viewportTop) {
                    activeSection = section;
                    break;
                }
            }
        }
        
        if (!activeSection && sectionsArray.length > 0) {
            activeSection = sectionsArray[0];
        }
        
        if (activeSection) {
            const targetId = activeSection.id;
            const activeLink = document.querySelector(`.toc-link[data-target="${targetId}"]`);
            
            if (activeLink) {
                activeLink.classList.add('toc-active');
                
                // Gérer les sous-sections seulement en mode annexe
                if (mode === 'annexe' && targetId.startsWith('subsection')) {
                    const allElements = document.querySelectorAll('[id^="section"], [id^="subsection"]');
                    let parentSection = null;
                    
                    for (let i = 0; i < allElements.length; i++) {
                        if (allElements[i] === activeSection) {
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
                        const parentLink = document.querySelector(`.toc-link[data-target="${parentSection.id}"]`);
                        if (parentLink) {
                            parentLink.classList.add('toc-active', 'toc-parent-active');
                        }
                    }
                }
            }
        }
    }
    
    function debounceScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateActiveSection();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }
    
    window.addEventListener('scroll', debounceScroll);
    updateActiveSection();
    window.updateActiveSection = updateActiveSection;
}

function makeTableOfContentsSticky(tocContainer, originalContainer, mode) {
    let state = 'normal';
    const originalParent = originalContainer;
    let placeholder = null;
    
    function handleScroll() {
        const originalRect = originalParent.getBoundingClientRect();
        
        let limitElement = null;
        let limitRect = null;
        
        if (mode === 'hybrid') {
            // Mode hybrid : détecter le prochain message sans .hybrid
            const currentPostRow = tocContainer.closest('.post_row');
            
            let nextPostRow = null;
            if (currentPostRow) {
                nextPostRow = currentPostRow.nextElementSibling;
                while (nextPostRow && !nextPostRow.classList.contains('post_row')) {
                    nextPostRow = nextPostRow.nextElementSibling;
                }
            }
            
            const nextHasHybrid = nextPostRow ? nextPostRow.querySelector('.hybrid') !== null : false;
            
            if (nextPostRow && !nextHasHybrid) {
                limitElement = nextPostRow;
                limitRect = limitElement.getBoundingClientRect();
            } else {
                const allPostRows = document.querySelectorAll('.post_row');
                limitElement = allPostRows[allPostRows.length - 1];
                limitRect = limitElement ? limitElement.getBoundingClientRect() : null;
            }
        } else {
            // Mode annexe : utiliser le dernier message de la page
            const allPostMessages = document.querySelectorAll('.container-post');
            limitElement = allPostMessages[allPostMessages.length - 1];
            limitRect = limitElement ? limitElement.getBoundingClientRect() : null;
        }
        
        if (!limitRect) {
            return;
        }
        
        const tocHeight = tocContainer.offsetHeight;
        const shouldStartFixed = originalRect.top <= 85;
        const tocBottomIfFixed = 85 + tocHeight;
        
        // Utiliser .top pour hybrid, .bottom pour annexe
        const referencePoint = mode === 'hybrid' ? limitRect.top : limitRect.bottom;
        const wouldOverflow = tocBottomIfFixed > referencePoint;
        
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
            const scrolledBackUp = !wouldOverflow && shouldStartFixed;
            const scrolledAboveStart = !shouldStartFixed;
            
            if (scrolledAboveStart) {
                newState = 'normal';
            } else if (scrolledBackUp) {
                newState = 'fixed';
            }
        }
        
        if (newState !== state) {
            if (state === 'fixed' || state === 'bottom') {
                if (placeholder) {
                    placeholder.remove();
                    placeholder = null;
                }
            }
            
            if (newState === 'normal') {
                tocContainer.classList.remove('toc-fixed');
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
                
                if (tocContainer.parentElement === document.body) {
                    originalParent.appendChild(tocContainer);
                }
                
                tocContainer.style.position = 'fixed';
                tocContainer.style.top = '85px';
                tocContainer.style.left = left + 'px';
                tocContainer.style.width = width + 'px';
                tocContainer.classList.add('toc-fixed');
                
                if (!placeholder) {
                    placeholder = document.createElement('div');
                    placeholder.className = 'toc-placeholder';
                    placeholder.style.height = tocHeight + 'px';
                    originalParent.appendChild(placeholder);
                }
            } else if (newState === 'bottom') {
                const width = tocContainer.offsetWidth;
                
                // Calculer différemment selon le mode
                const stopPosition = mode === 'hybrid' 
                    ? referencePoint - tocHeight + window.pageYOffset
                    : referencePoint - tocHeight + window.pageYOffset;
                
                if (!placeholder) {
                    placeholder = document.createElement('div');
                    placeholder.className = 'toc-placeholder';
                    placeholder.style.height = tocHeight + 'px';
                    originalParent.appendChild(placeholder);
                }
                
                document.body.appendChild(tocContainer);
                
                tocContainer.style.position = 'absolute';
                tocContainer.style.top = stopPosition + 'px';
                tocContainer.style.left = (originalRect.left + window.pageXOffset) + 'px';
                tocContainer.style.width = width + 'px';
            }
            
            state = newState;
        }
        
        if (state === 'fixed') {
            const newRect = originalParent.getBoundingClientRect();
            tocContainer.style.left = newRect.left + 'px';
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateTableOfContents);
} else {
    generateTableOfContents();
}