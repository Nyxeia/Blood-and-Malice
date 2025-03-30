$(function(){
    // Une fois la page chargée
     $(document).ready( function(){
      // On vérifie si le membre est connecté
           if(_userdata.session_logged_in != 0){

            var userName = _userdata.username,
               userId = _userdata.user_id,
               //userAvatar = '<a href="/u'+ userId +'">'+ _userdata.avatar +'</a>',
               userAvatar = '<a href="https://bloodandmalice.forumactif.com/">'+ _userdata.avatar +'</a>',
               groupColor = '#'+ _userdata.groupcolor,
               divPseudo = '<a style="color:' + groupColor + '" href="/u'+ userId +'">'+ userName +'</a>';

            $('#top-header-avatar').append(userAvatar);
            $('#top-header-user').append(divPseudo);

           }
           else {

            var userAvatar = '<a href="https://bloodandmalice.forumactif.com/"><img src="https://i.pinimg.com/736x/d7/9c/6f/d79c6fbe6f725ab5ec1edb3ed4c1ac02.jpg"></a>';
            divPseudo = '';

            $('#top-header-avatar').append(userAvatar);
            $('#top-header-user').append(divPseudo);

           }
         
      });
   
   });