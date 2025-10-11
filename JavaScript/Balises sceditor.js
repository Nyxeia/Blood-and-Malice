// balises personnalisées – 
// à ajouter dans Modules > Gestion des codes javascript
// cocher "Sur toutes les pages" !

$(document).ready(function () {
    const waitForSCEditor = setInterval(() => {
        if ($('.sceditor-toolbar').length && $('.sceditor-container').length) {
            clearInterval(waitForSCEditor); 

            const customTags = [
                { tag: 'm0', text: 'm0' },
                { tag: 'm1', text: 'm1' },
                { tag: 'm2', text: 'm2' },
                { tag: 'm3', text: 'm3' },
                { tag: 'm4', text: 'm4' },
                { tag: 'i1', text: 'i1' },
                { tag: 'u1', text: 'u1' },
                { tag: 'u2', text: 'u2' },
                { tag: 'u3', text: 'u3' },
                { tag: 'u4', text: 'u4' },
                { tag: 'strike2', text: 'barré' },
                { tag: 'tag', text: 'tag' }
            ];

            const isLoggedIn = _userdata.session_logged_in != 0;

            // Contenu du panneau custom avec boutons de balises personnalisées
            const panelHTML = `
                <div class="editor-panel">
                    <div class="panel-content">

                        <!-- Liste des balises à insérer -->
                        ${customTags.map(item => {
                            // Pour les invités, utilise span avec class, sinon balise normale
                            const openTag = isLoggedIn ? `<${item.tag}>` : `<span class="${item.tag}">`;
                            const closeTag = isLoggedIn ? `</${item.tag}>` : `</span>`;
                            return `<button type="button" data-tag="${item.tag}" data-is-guest="${!isLoggedIn}">${openTag}${item.text}${closeTag}</button>`;
                        }).join('')}
                        <!-- BEGIN switch_user_logged_in -->
                        <div class="more-codes"><a href="https://bloodandmalice.forumactif.com/t35-les-codes-du-forum#71" target="_blank">plus</a></div>
                        <!-- END switch_user_logged_in -->
                    </div>
                </div>
            `;

            // Ajoute le panneau juste après la barre d'outils de SCEditor
            $('.sceditor-toolbar').after(panelHTML);

            /* Fonction principale : insère les balises dans le bon mode (source ou visuel)
             */
            function insertTag(tag, isGuest) {
                const editorTextarea = $(".sourceMode textarea"); 
                const editorIframe = $(".sceditor-container iframe").contents().find("body");

                // Détermine les balises ouvrantes et fermantes
                const openTag = isGuest ? `<span class="${tag}">` : `<${tag}>`;
                const closeTag = isGuest ? `</span>` : `</${tag}>`;

                if (editorTextarea.length && editorTextarea.is(":visible")) {
                    // Insertion dans le mode source
                    const textarea = editorTextarea[0];
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;

                    textarea.value = text.substring(0, start) + openTag + text.substring(start, end) + closeTag + text.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = end + openTag.length + closeTag.length;
                    textarea.focus();
                } else if (editorIframe.length) {
                    // Insertion dans le mode visuel (rich text)
                    const selection = window.getSelection();
                    if (!selection.rangeCount) return;

                    const range = selection.getRangeAt(0);
                    const span = document.createElement("span");
                    span.innerHTML = openTag + range.toString() + closeTag;
                    range.deleteContents();
                    range.insertNode(span);
                }
            }

            // Cliquer sur un bouton → insère la balise correspondante
            $('.editor-panel .panel-content button').on('click', function (e) {
                e.preventDefault();
                const isGuest = $(this).data('is-guest') === true;
                insertTag($(this).data('tag'), isGuest);
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

        .more-codes {
            display: inline-block;
            border-left: var(--border);
            margin-left: 5px!important;
            padding-left: 10px!important;
        }
    `)
    .appendTo('head');