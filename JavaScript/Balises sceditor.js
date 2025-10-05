// balises personnalisées — 
           // à ajouter dans Modules > Gestion des codes javascript
	// cocher "Sur toutes les pages" !

$(document).ready(function () {
    const waitForSCEditor = setInterval(() => {
        if ($('.sceditor-toolbar').length && $('.sceditor-container').length) {
            clearInterval(waitForSCEditor); 

            // Contenu du panneau custom avec boutons de balises personnalisées - chevron FontAwesome, à installer ou retirer si inutile !
            const panelHTML = `
                <div class="editor-panel">
                    <div class="panel-content">

                        <!-- Liste des balises à insérer -->
                        ${[
                            'm0',
                            'm1',  
                            'm2',  
                            'm3',  
                            'm4',
                            'i1',
                            'u1', 
                            'u2',
                            'u3',  
                            'u4',
                            'strike2',
                            'tag'
                        ].map(tag => `<button type="button" data-tag="${tag}"><${tag}>texte</${tag}></button>`).join('')}

                    </div>
                </div>
            `;

            // Ajoute le panneau juste après la barre d’outils de SCEditor
            $('.sceditor-toolbar').after(panelHTML);

            /* Fonction principale : insère les balises dans le bon mode (source ou visuel)
             */
            function insertTag(tag) {
                const editorTextarea = $(".sourceMode textarea"); 
                const editorIframe = $(".sceditor-container iframe").contents().find("body"); // mode "visuel"

                if (editorTextarea.length && editorTextarea.is(":visible")) {
                    // Insertion dans le mode source
                    const textarea = editorTextarea[0];
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;

                    textarea.value = text.substring(0, start) + `<${tag}>` + text.substring(start, end) + `</${tag}>` + text.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = end + tag.length * 2 + 5; // repositionne le curseur après la balise
                    textarea.focus();
                } else if (editorIframe.length) {
                    // Insertion dans le mode visuel (rich text)
                    const selection = window.getSelection();
                    if (!selection.rangeCount) return;

                    const range = selection.getRangeAt(0);
                    const span = document.createElement("span");
                    span.innerHTML = `<${tag}>${range.toString()}</${tag}>`;
                    range.deleteContents();
                    range.insertNode(span);
                }
            }

            // Cliquer sur un bouton → insère la balise correspondante
            $('.editor-panel .panel-content button').on('click', function (e) {
                e.preventDefault();
                insertTag($(this).data('tag'));
            });
        }
    }, 500);

});


// STYLES : personnalisation visuelle du panneau et des boutons
$('<style>')
    .prop('type', 'text/css')
    .html(`
        /* Style des boutons-balise */
           .panel-content button {
            background-color: var(--neutral2);
        }
        .panel-content button {
            margin: 2px;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: inherit;
            font-size: 13px;
            cursor: pointer;
            color: var(--textColor1);
        }

        .panel-content button:hover {
            background-color: var(--neutral3);
        }

        /* Conteneur du panneau */
        .editor-panel {
            border-bottom: var(--border) !important;
        }
    `)
    .appendTo('head');