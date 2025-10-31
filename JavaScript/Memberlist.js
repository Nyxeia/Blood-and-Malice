/* Liste des membres avec filtres, tri et barre de recherche, sans reload de page
 *
 * @author peekaboorpg
 * @version 1.0
 */

$(document).ready(function () {

    var currentUrl = window.location.href;
    var memberlistBase = "https://bloodandmalice.forumactif.com/memberlist";
    var overallPostersUrl = "https://bloodandmalice.forumactif.com/memberlist?mode=overall_posters";

    /* Si on est sur la page /memberlist normale OU sur overall_posters */
    if (currentUrl === memberlistBase || 
        (currentUrl.startsWith(memberlistBase + "?start=") && !currentUrl.includes("mode=")) ||
        currentUrl === overallPostersUrl) {

        /* Détecter si on est sur la page overall_posters pour changer les valeurs par défaut */
        var isOverallPosters = (currentUrl === overallPostersUrl);

        /* MODIFS DES VARIABLES */
        var membersPerPage = 40, /* nombre de membres par page (le même que dans les settings du PA) */
            itemsPerPageDefault = 40, /* nombre de membres par page sur la nouvelle grille (peut être différent du setting dans le PA !) */
            memberList = '.userlist', /* sélecteur du bloc autour des blocs membres */
            itemSelector = '.userlist_profil', /* le sélecteur des blocs membres individuels */
            pseudoMembre = '.userlist_name', /* sélecteur du pseudo du membre */
            humeurMembre = '.userlist_alias', /* sélecteur du contenu du champ humeur du membre */
            messagesMembre = '.userlist_posts'; /* sélecteur du nombre de messages du membre */

        /* ne pas toucher à ces variables */
        var allMembers = document.createDocumentFragment(), /* on crée un fragment qui sera append à la grid isotopée plus tard */
            oneMember;

        /* Virer la liste de base et ajouter la mention Chargement... en attendant que les blocs membres chargent */
        $(memberList).empty().append('<div class="ldm_chargement">Chargement...</div>');

        /* Lancer la fonction qui récupère la liste complète de tous les membres à partir de la page 1 */
        loadAllMembers(1);

        /* La fonction qui récupère la liste complète de tous les membres */
        function loadAllMembers(page) {

            /* on génère la liste des pages à récupérer */
            var pageUrl = '/memberlist?start=' + ((page - 1) * membersPerPage);

            /* AJAX call */
            $.ajax({
                url: pageUrl,
                success: function (data) {
                    var newMembers = $(data).find(memberList + ' ' + itemSelector); /* On récupère les blocs membres de la page dans un objet */

                    /* S'il n'y a plus de membres à ajouter */
                    if (newMembers.length === 0) {

                        /* montrer la liste des membres isotopée */
                        displayMembers();

                        /* MODIFS DES PARAMETRES DE GROUPES */
                        /* éxecuter les fonctions qui ajoutent une class pour chaque couleur de groupe */
                        groupMod('#8d3848', 'vampires');
                        groupMod('#774c7e', 'sorciers');
                        groupMod('#496c86', 'spectres');
                        groupMod('#8b684f', 'humains');

                        return;
                    }
                        /* Pour chaque membre dans newMembers */
                        newMembers.each(function(index) {
 
                            /* on récupère le bloc membre */
                            oneMember = $(this)[0];
 
                            /* on lui ajoute un attribut data-inscription qui prend l'id du membre, que l'on récupère sur le lien du pseudo */
                            var idMembre = $(this).find(pseudoMembre).attr('href').replace(/[^0-9]/g,'');
                            $(this).attr('data-inscription', idMembre);

                            /* on ajoute un attribut data-messages qui prend le nombre de messages */
                            var nbMessages = $(this).find(messagesMembre).text().replace(/[^0-9]/g,'');
                            $(this).attr('data-messages', nbMessages || '0');

                            /* on ajoute un attribut data-derco basé sur l'ordre original (dernière connexion) */
                            $(this).attr('data-derco', ((page - 1) * membersPerPage) + index);
 
                            /* on ajoute le bloc membre dans le docfrag allMembers */
                            allMembers.append( oneMember );
                        });
    
                        /* Passer à la page suivante */
                        loadAllMembers(page + 1);
                        
                    },
                    error: function() {
                        console.error("Failed to load page " + page); /* Si erreur */
                    }
                    
                });
 
 
        }
        
 
        /* la fonction qui ajoute la class pour chaque couleur de groupe */
        function groupMod(color, classname) {
                // Trouve les éléments userlist_profil qui correspondent à la couleur
                var $profiles = $(itemSelector+':has(a[href^="/u"] span[style="color:'+color+'"] strong)');

                // Ajoute la classe au profil principal
                $profiles.addClass(classname);

                // Ajoute aussi la classe aux éléments userlist_visited dans ce même profil
                $profiles.find('.userlist_visited').addClass(classname);
        }
 
        /* Fonction qui ajoute la liste à #memberlist et qui l'isotope */
        function displayMembers() {
            var $grid = $(memberList)
                        .empty()
                        .append(allMembers)
                        .isotope({
                            itemSelector: itemSelector,
                            getSortData: {
                                pseudo: pseudoMembre,
                                inscription: '[data-inscription] parseInt',
                                humeur: humeurMembre,
                                derco : '[data-derco] parseInt',
                                messages: '[data-messages] parseInt'
                            }
                        });
            
            /* MODIFS A FAIRE ICI (SI VOTRE FORUM EST RESPONSIVE) */
            /* Valeurs responsive pour isotope, format [max-width, nombre de membres à afficher], /!\ à remplir dans l'ordre ascendant */
            var responsiveIsotope = [
                [480, 3],
                [720, 6]
            ];
 
            var itemsPerPage = defineItemsPerPage(); /* fonction qui prend en compte le responsive pour le nombre de membres sur chaque page */
 
            /* Valeurs de départ */
            var currentNumberPages = 1;
            var currentPage = 1;
            var currentFilter = '*';
 
            var pageAtribute = 'data-page'; /* attribut des filtres de page */
            var pagerClass = 'isotope-pager'; /* class du bloc de pagination */
            
            /* Définition de l'ordre de triage par défaut selon la page */
            var sorting = isOverallPosters ? 'messages' : 'original-order';
            var search = false; /* état de la barre de recherche, par défaut il n'y a pas de recherche donc false */
            var order = false; /* direction du triage, par défaut décroissant */

            /* Mettre à jour l'interface selon la page */
            if (isOverallPosters) {
                /* Sélectionner le bouton Messages */
                $('.sort-by-button-group button').removeClass('is-checked');
                $('.sort-by-button-group button[data-sort-by="messages"]').addClass('is-checked');
                
                /* Appliquer le tri par messages à Isotope */
                $grid.isotope({
                    sortBy: 'messages',
                    sortAscending: false
                });
            }
 
            /* Objet qui va récupérer tous les filtres actifs */
            var buttonFilters = {};
 
            /* Le regex de la barre de recherche */
            var qsRegex;
                
            /* Fonction qui update le filtre à chaque clic sur un bouton */
            function changeFilter(selector, pages) {
                var leFiltre = selector;
                var lesPages = pages;
                
                /* Définition des filtres dans isotope */
                $grid.isotope({
                    filter: function (){
                        var $this = $(this);
 
                        /* Résultat de la recherche sur le nom du membre */
                        var searchResult = qsRegex ? $this.find(pseudoMembre).text().match( qsRegex ) : true;
 
                        /* Résultat des boutons de filtrage */
                        var buttonResult = leFiltre ? $this.is( leFiltre ) : true;
 
                        /* Résultat des boutons de pagination */
                        var pageResult = lesPages ? $this.is( lesPages ) : true;
 
                        /* Retourner tous les résultats */
                        return buttonResult && pageResult && searchResult;
                    }
                });
            }
 
            /* Fonction qui récupère les filtres déjà en cours */
            function getFilterSelector() {
                var selector = '';
 
                /* Si currentFilter n'est pas le filtre Tout */
                if (currentFilter != '*') {
                    /* Alors ajouter la valeur de currentFilter dans selector */
                    selector += `${currentFilter}`
                }
 
                return selector;
            }
            
            /* Fonction qui active le filtre de pagination */
            function goToPage(n) {
                currentPage = n;
                
                /* Récupérer les filtres en cours */
                var selector = getFilterSelector();
 
                var pages = '';
 
                /* Récupérer le filtre de pagination */
                pages += `[${pageAtribute}="${currentPage}"]`;
            
                /* Changer les filtres en cours pour ajouter le filtre de pagination */
                changeFilter(selector, pages);
            }
            
            /* Fonction qui gère le responsive sur le nombre de membres par page */
            function defineItemsPerPage() {
                var pages = itemsPerPageDefault;
                for (var i = 0; i < responsiveIsotope.length; i++) {
                    if ($(window).width() <= responsiveIsotope[i][0]) {
                        pages = responsiveIsotope[i][1];
                        break;
                    }
                }
                return pages;
            }
            
            /* Fonction qui crée la pagination */
            function setPagination() {
                
                /* Fonction qui attribue un numéro de page sur chaque bloc membre */
                var SettingsPagesOnItems = function () {
            
                    var item = 1; 
                    var page = 1;
 
                    /* Récupérer le filtre en cours */
                    var selector = getFilterSelector();
 
                    /* Créer un objet items avec tous les enfants correspondant au filtre */
                    var items = $grid.children(selector);
 
                    /* Si l'ordre de rangement est différent de Dernière connexion */
                    if( sorting != "original-order"){
                        /* On range l'objet items différemment */
                        items.sort(function(a, b) {
                            var valueA = '',
                                valueB = '';
                            /* Si l'ordre est par Nom du membre */
                            if (sorting === "pseudo"){
                                valueA = $(a).find(pseudoMembre).text();
                                valueB = $(b).find(pseudoMembre).text();
                            } 
 
                            /* Si l'ordre est par Nom du faceclaim */
                            else if (sorting === "humeur"){
                                valueA = $(a).find(humeurMembre).text();
                                valueB = $(b).find(humeurMembre).text();
                            }
 
                            /* Si l'ordre est par Date d'inscription */
                            else if (sorting === "inscription"){
                                valueA = $(a).data("inscription");
                                valueB = $(b).data("inscription");
                            }

                            /* Si l'ordre est par Nombre de messages */
                            else if (sorting === "messages"){
                                valueA = $(a).data("messages");
                                valueB = $(b).data("messages");
                            }
 
 
                            if (order == false) {
                                /* Ranger par ordre décroissant */
                                return valueA < valueB
                            } else {
                                /* Ranger par ordre croissant */
                                return valueA > valueB
                            }
                            
                        });
 
                    } else{ /* Sinon l'ordre de rangement est Dernière connexion */
                        if (order == true){ /* Si la direction de triage est croissante */
 
                            /* Inverser l'ordre de items (pcq l'ordre est décroissant par défaut) */
                            items.sort(function(a, b) {
                                var valueA = $(a).data("derco"),
                                    valueB = $(b).data("derco");
                                    return valueA < valueB
                            });
 
                        }
                    }
                    
                    
                    /* Si la recherche est en cours */
                    if( search == true){
 
                        /* Filtrer l'objet items et ne garder que les blocs qui matchent le regex de la barre de recherche */
                        items = items.filter(function() { return $(this).find(pseudoMembre).text().match(qsRegex)});
 
                    }
                    
                    /* Pour chaque élément de items */
                    items.each(function () {
                        
                        /* S'il y a plus d'items restants que l'on veut d'items par page */
                        if (item > itemsPerPage) {
                            /* On incrémente page de 1 */
                            page++;
                            item = 1;
                        }
                        /* On ajoute au bloc l'attribut data-page="page" */
                        $(this).attr(pageAtribute, page);
                        item++;
 
                    });
                    
                    /* On récupère le nombre total de pages dont on a eu besoin */
                    currentNumberPages = page;
                        
                }();
 
                /* Fonction qui crée le bloc de pagination */
                var CreatePagers = function () {
                    
                    /* On crée le bloc de pagination <div class="pagerClass"></div> */
                    var $isotopePager = ($('.' + pagerClass).length == 0) ? $('<div class="' + pagerClass + '"></div>') : $('.' + pagerClass);
            
                    $isotopePager.html('');
 
                    /*Si le nombre de pages dont on a eu besoin est supérieur à 1 */
                    if (currentNumberPages > 1) {
 
                        /*Pour chaque page */
                        for (var i = 0; i < currentNumberPages; i++) {
 
                            /* On crée un bouton portant l'attribut data-page */
                            var $pager = $('<button class="button" ' + pageAtribute + '="' + (i + 1) + '"></button>');
                            /* On ajoute le numéro de la page dans le button */
                            $pager.html(i + 1);
                            
                            /* Pour chaque bouton, au clic */
                            $pager.click(function () {
                                /* Récupérer la valeur de l'attribut data-page */
                                var page = $(this).eq(0).attr(pageAtribute);
 
                                /* Afficher la page de l'attribut */
                                goToPage(page);
                            });
                            
                            /* Ajouter le bouton dans la pagination */
                            $pager.appendTo($isotopePager);
                        }
                    }
 
                    /* Ajouter la pagination après la grille isotopée */
                    $grid.after($isotopePager);
            
                }();
            
            }
            
            /* Attribuer la pagination à tous les blocs */
            setPagination();
            /* Afficher la première page */
            goToPage(1);
 
            /* Pour chaque bouton de filtrage, au clic */
            $('.filters').on( 'click', '.button', function() {
                var $this = $(this);
                /* Récupérer le nom du groupe de boutons */
                var $buttonGroup = $this.parents('.button-group');
                var filterGroup = $buttonGroup.attr('data-filter-group');
                /* Récupérer le filtre de chaque groupe */
                buttonFilters[ filterGroup ] = $this.attr('data-filter');
                /* Concaténer les filtres dans la variable des filtres en cours */
                currentFilter = concatValues( buttonFilters );
                
                /* Réattribuer la pagination à tous les blocs */
                setPagination();
                /* Afficher la première page */
                goToPage(1);
            });
  
                
            /* Gérer la barre de recherche, activer la fonction à chaque fois qu'on relâche une touche du clavier */
            var $quicksearch = $('.quicksearch').keyup( debounce( function() {
                
                /* Stocker le regex dans qsRegex */
                qsRegex = new RegExp( $quicksearch.val(), 'gi' );
 
                /* Dire que la barre de recherche est utilisée */
                search = true;
 
                /* Si on vide la barre de recherche */
                if ( !$(".quicksearch").val() ){
                    /* Alors la barre de recherche est plus utilisée */
                    search = false;
                }
 
                /* Réattribuer la pagination à tous les blocs */
                setPagination();
                /* Afficher la première page */
                goToPage(1);
            }) );
                
            /* Pour chaque bouton d'un groupe de boutons */
            $('.button-group').each( function( i, buttonGroup ) {
                var $buttonGroup = $( buttonGroup );
                /* Au clic sur un bouton */
                $buttonGroup.on( 'click', 'button', function() {
                    /* S'il a déjà la class is-checked, l'enlever */
                    $buttonGroup.find('.is-checked').removeClass('is-checked');
                    /* Ajouter la class is-checked */
                    $( this ).addClass('is-checked');
                });
            });
 
            /* Fonction qui concatène les filtres ensemble */
            function concatValues( obj ) {
                var value = '';
                for ( var prop in obj ) {
                    value += obj[ prop ];
                }
                return value;
            }
 
            /* De ce que j'ai compris c'est un timeout pour pas que la barre de recherche fasse une recherche chaque milliseconde */
            function debounce( fn, threshold ) {
                var timeout;
                threshold = threshold || 100;
                return function debounced() {
                    clearTimeout( timeout );
                    var args = arguments;
                    var _this = this;
                    function delayed() {
                        fn.apply( _this, args );
                    }
                    timeout = setTimeout( delayed, threshold );
                };
            }
 
            /* Au clic sur un bouton de réorganisation */
            $('.croiss-group').on( 'click', 'button', function() {
 
                /* Récupérer la valeur booléenne de l'attribut correspondant */
                order = JSON.parse($(this).attr('data-order'));
 
                /* Si l'ordre est Dernière connexion */
                if (sorting == 'original-order'){
 
                    /* Changer l'organisation de la grille pour Dernière connexion et inverser la direction (pcq décroissant par défaut au lieu de croissant) */
                    $grid.isotope({
                        sortBy: 'derco',
                        sortAscending: !order
                    });
 
                } else{ /* Sinon pour tous les autres ordres */
 
                    /* Changer la direction de la grille selon le bouton sélectionné */
                    $grid.isotope({
                        sortAscending: order
                    });
 
                }
 
                /*Réattribuer la pagination à tous les blocs */
                setPagination();
                /* Afficher la première page */
                goToPage(1)
 
            });
 
            /* Au clic sur un bouton de réorganisation */
            $('.sort-by-button-group').on( 'click', 'button', function() {
                /* Récupérer la valeur de l'attribut correspondant */
                sorting = $(this).attr('data-sort-by');
 
                /* Si l'ordre de triage est Dernière connexion ou Messages */
                if (sorting == 'original-order' || sorting == 'messages'){
                    /* Remettre la direction décroissante */
                    order = false;
                } else{ /* Sinon pour tous les autres ordres de triage */
                    /* Remettre la direction croissante */
                    order = true;
                }
                /* Si le bouton de direction de triage décroissant est sélectionné, enlever la sélection */
                $('button[data-order="'+!order+'"]').removeClass('is-checked');
                /* Sélectionner le bouton de direction de triage croissant */
                $('button[data-order="'+order+'"]').addClass('is-checked');
 
                /* Réattribuer la pagination à tous les blocs */
                setPagination();
 
                /* Si l'ordre de triage est Dernière connexion */
                if (sorting == 'original-order'){
                    /* Changer l'organisation de la grille pour Dernière connexion avec la direction par défaut */
                    $grid.isotope({
                        sortBy: 'derco',
                        sortAscending: !order
                    });
                } else {
                    /* Changer l'organisation de la grille selon le bouton sélectionné + set la direction par défaut */
                    $grid.isotope({
                        sortBy: sorting,
                        sortAscending: order
                    });
                }
 
                /* Afficher la première page */
                goToPage(1)
            });
 
            /* Au resize de la fenêtre */
            $(window).resize(function () {
                /* Gérer le responsive */
                itemsPerPage = defineItemsPerPage(); 
                
                /* Réattribuer la pagination à tous les blocs */
                setPagination();
                /* Afficher la première page */
                goToPage(1);
            });
 
        }
        
    } // Fermeture de la condition URL
});