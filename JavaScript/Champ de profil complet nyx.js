$(function() {
  // Only run if URL ends with /uX where X is a number
  if (!/\/u\d+$/.test(window.location.pathname)) {
    return;
  }

  // AS ABOVE
  $('body').on('click', '.as-above', function() {
      var $userProfile = $(this).closest('.user_profile');
      
      $userProfile.find('.aeszone1').show();
      $userProfile.find('.aeszone2').hide();

      // Show AS ABOVE elements
      $userProfile.find('.custom-icon').show();
      $userProfile.find('.custom-name').show();
      $userProfile.find('.custom-rank').show();
      
      // Hide SO BELOW elements
      $userProfile.find('.custom-icon-hrp').hide();
      $userProfile.find('.custom-fc').hide();
      $userProfile.find('.custom-pseudo').hide();

      // Update border colors
      $userProfile.find('.tabs-wrap').css({
          'border-left': '3px solid var(--accent1)',
          'border-right': '3px solid var(--neutral4)'
      });
  });
  
  // SO BELOW
  $('body').on('click', '.so-below', function() {
      var $userProfile = $(this).closest('.user_profile');
      
      $userProfile.find('.aeszone1').hide();
      $userProfile.find('.aeszone2').show();

      // Hide AS ABOVE elements
      $userProfile.find('.custom-icon').hide();
      $userProfile.find('.custom-name').hide();
      $userProfile.find('.custom-rank').hide();
      
      // Show SO BELOW elements
      $userProfile.find('.custom-icon-hrp').show();
      $userProfile.find('.custom-fc').show();
      $userProfile.find('.custom-pseudo').show();

      // Update border colors
      $userProfile.find('.tabs-wrap').css({
          'border-left': '3px solid var(--neutral4)',
          'border-right': '3px solid var(--accent1)'
      });
  });

  // Hover effects for tabs
  $('.as-above').hover(
    function() {
        // Only apply hover if we're on a user profile page
        if (!/\/u\d+$/.test(window.location.pathname)) return;
        
        // On hover - change left border to accent2
        $(this).closest('.tabs-wrap').css('border-left', '3px solid var(--accent2)');
    },
    function() {
        // Only apply hover if we're on a user profile page
        if (!/\/u\d+$/.test(window.location.pathname)) return;
        
        // On mouse leave - restore original border based on active tab
        var $userProfile = $(this).closest('.user_profile');
        var $tabsWrap = $(this).closest('.tabs-wrap');
        
        if ($userProfile.find('.aeszone1').is(':visible')) {
            // AS ABOVE is active
            $tabsWrap.css('border-left', '3px solid var(--accent1)');
        } else {
            // SO BELOW is active
            $tabsWrap.css('border-left', '3px solid var(--neutral4)');
        }
    }
  );

  $('.so-below').hover(
    function() {
        // Only apply hover if we're on a user profile page
        if (!/\/u\d+$/.test(window.location.pathname)) return;
        
        // On hover - change right border to accent2
        $(this).closest('.tabs-wrap').css('border-right', '3px solid var(--accent2)');
    },
    function() {
        // Only apply hover if we're on a user profile page
        if (!/\/u\d+$/.test(window.location.pathname)) return;
        
        // On mouse leave - restore original border based on active tab
        var $userProfile = $(this).closest('.user_profile');
        var $tabsWrap = $(this).closest('.tabs-wrap');
        
        if ($userProfile.find('.aeszone1').is(':visible')) {
            // AS ABOVE is active (aeszone1 is visible)
            $tabsWrap.css('border-right', '3px solid var(--neutral4)');
        } else {
            // SO BELOW is active (aeszone2 is visible)
            $tabsWrap.css('border-right', '3px solid var(--accent1)');
        }
    }
  );

  // Field moving logic - adapted for user profile structure
  jQuery(function($) {
    // Only run field moving if we're on a user profile page
    if (!/\/u\d+$/.test(window.location.pathname)) {
      return;
    }
    
    var path = ".user_profile .profile_infos .profile_content .profile_field";
    var parent = ".user_profile";
    
    // Fields to move to midbot
    var fieldsToMove = [
        "Pronoms", "Âge", "Sentiments", "Appartenance", "Occupation(s)",  "Habitation", 
        "Pouvoirs", "Inventaire", "Autre"
    ];

    var twToMove = [
        "Thèmes abordés", "Thèmes refusés"
    ];
    
    var customDestinations = {
        "Icone": ".custom-icon",
        "Autre identité": ".custom-name",
        "Rang personnalisé": ".custom-rank",
        "Icone HRP": ".custom-icon-hrp",
        "Faceclaim": ".faceclaim",
        "Pseudo": ".pseudo",
        "Zone libre 1": ".aeszone1",
        "Zone libre 2": ".aeszone2"
    };
    
    // Only hide labels (without moving)
    var fieldsToHideLabel = ["Zone libre 1", "Zone libre 2"];
    
    $(path).each(function() {
        var $field = $(this);
        var $label = $field.find('label span');
        var fieldName = $label.text().replace(':', '').trim();
        
        // Check if this field has a custom destination
        if (customDestinations[fieldName]) {
            var $userProfile = $field.closest('.user_profile');
            var destinationSelector = customDestinations[fieldName];
            var $destination = $userProfile.find(destinationSelector);
            
            if ($destination.length > 0) {
                var $fieldContent = $field.find('.field_uneditable, .field_editable');
                var $contentToMove = $fieldContent.html();
                $destination.html($contentToMove);
            }
            
            // Remove the entire field after moving its content
            $field.remove();
        }
        // Check if field should move to midbot
        else if (fieldsToMove.includes(fieldName)) {
            var $midbot = $field.closest(parent).find('.midbot');
            $midbot.append($field);
        }
        // Check if field should move to twinfo
        else if (twToMove.includes(fieldName)) {
            var $tw = $field.closest(parent).find('.twinfo');
            $tw.append($field);
        }
        // Check if field should just have its label hidden
        else if (fieldsToHideLabel.includes(fieldName)) {
            $field.find('label').remove();
        }
    });

    $('.profile_field').css('visibility', 'visible');
  });
});