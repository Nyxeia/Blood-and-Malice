/* Script qui ajoute la couleur
 * de groupe aux mentions dans les sujets
 *
 * @author peekaboorpg
 * @version 1.0
 */
 
$(document).ready(function () {
    /* MODIF DES VARIABLES */
    const mentions = $('.mentiontag'), /*-class des liens à checker-*/
        nomTooltip = '.preview_pseudo', /*-sélecteur du nom d'utilisateur sur la page /ajax-*/
    /* FIN DES MODIFS */
        cacheTime = 1 * 60 * 60 * 1000, /*-temps de cache, 1h par défaut-*/
        date = +new Date();
 
    /*-Pour chaque lien qui a mentiontag comme class-*/
    mentions.each(function () {
        var mtn = $(this),
            id = mtn.attr("href").replace(/.*?\/u/, ''); /*-Récupérer l'id du membre sur le lien mentiontag-*/
 
        /*-S'il existe un avatar pour cet id dans le localStorage et que la date de stockage est inférieure à 1h, alors-*/
        if ((localStorage.getItem('mentionGroup_' + id) !== null) && (localStorage.getItem('mentionGroup_' + id + '_exp') > date - cacheTime)) {
 
            /*-Stocker la class du groupe dans une variable-*/
            var groupe = localStorage.getItem('mentionGroup_' + id);
 
            /*-Appliquer la class du groupe au lien mentiontag-*/
            mtn.addClass(groupe);
 
        } else {
            /*-Sinon récupérer les données du le tooltip correspondant au membre taggé-*/
            $.get('/ajax/index.php?f=m&user_id=' + id, function (d) {
 
                /*-Récupérer la couleur de groupe dans une variable-*/
                var couleur = $(nomTooltip + ' span', d).attr('style').slice(-7);
 
                /*-Fonction qui teste si la couleur de groupe est égale à celle de chaque groupe et si oui stocke la class correspondante dans groupe-*/
                function mtnGroup(colGroup, color, classname) {
                    if (color == colGroup) {
                        groupe = classname;
                    }
                }
 
                /*-On joue la fonction pour chaque couleur de groupe-*/
                /* MODIFS SELON VOS COULEURS DE GROUPE ET LES CLASS QUE VOUS VOULEZ */
                mtnGroup('#8d3848', couleur, 'vampires');
                mtnGroup('#774c7e', couleur, 'sorciers');
                mtnGroup('#4a6a7a', couleur, 'spectres');
                mtnGroup('#8b684f', couleur, 'humains');
                /*-FIN PARTIE A MODIFIER-*/
 
                /*-S'il y a un avatar et une class de groupe-*/
                if (groupe != undefined) {
 
                    /*-Ajouter la class du groupe sur le lien mentiontag-*/
                    mtn.addClass(groupe);
 
                    /*-Stocker la class de groupe dans le localStorage ainsi que l'heure du stockage-*/
                    localStorage.setItem('mentionGroup_' + id + '_exp', date);
                    localStorage.setItem('mentionGroup_' + id, groupe);
                }
            });
        }
    });
});