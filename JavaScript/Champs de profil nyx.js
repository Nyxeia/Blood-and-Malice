$(function() {
  // AS ABOVE
  $('body').on('click', '.as-above', function() {
      var $postProfile = $(this).closest('.post_profile');
      
      $postProfile.find('.tabcontent1').show();
      $postProfile.find('.tabcontent2').hide();

      // Show AS ABOVE elements
      $postProfile.find('.custom-icon').show();
      $postProfile.find('.custom-name').show();
      $postProfile.find('.custom-rank').show();
      
      // Hide SO BELOW elements
      $postProfile.find('.custom-icon-hrp').hide();
      $postProfile.find('.custom-fc').hide();
      $postProfile.find('.custom-pseudo').hide();

      // Update border colors
      $postProfile.find('.tabs-wrap').css({
          'border-left': '3px solid var(--accent1)',
          'border-right': '3px solid var(--neutral4)'
      });
  });
  
  // SO BELOW
  $('body').on('click', '.so-below', function() {
      var $postProfile = $(this).closest('.post_profile');
      
      $postProfile.find('.tabcontent1').hide();
      $postProfile.find('.tabcontent2').show();

      // Hide AS ABOVE elements
      $postProfile.find('.custom-icon').hide();
      $postProfile.find('.custom-name').hide();
      $postProfile.find('.custom-rank').hide();
      
      // Show SO BELOW elements
      $postProfile.find('.custom-icon-hrp').show();
      $postProfile.find('.custom-fc').show();
      $postProfile.find('.custom-pseudo').show();

      // Update border colors
      $postProfile.find('.tabs-wrap').css({
          'border-left': '3px solid var(--neutral4)',
          'border-right': '3px solid var(--accent1)'
      });
  });

// Hover effects for tabs
$('.as-above').hover(
  function() {
      // On hover - change left border to accent2
      $(this).closest('.tabs-wrap').css('border-left', '3px solid var(--accent2)');
  },
  function() {
      // On mouse leave - restore original border based on active tab
      var $postProfile = $(this).closest('.post_profile');
      var $tabsWrap = $(this).closest('.tabs-wrap');
      
      if ($postProfile.find('.tabcontent1').is(':visible')) {
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
      // On hover - change right border to accent2
      $(this).closest('.tabs-wrap').css('border-right', '3px solid var(--accent2)');
  },
  function() {
      // On mouse leave - restore original border based on active tab
      var $postProfile = $(this).closest('.post_profile');
      var $tabsWrap = $(this).closest('.tabs-wrap');
      
      if ($postProfile.find('.tabcontent1').is(':visible')) {
          // AS ABOVE is active (tabcontent1 is visible)
          $tabsWrap.css('border-right', '3px solid var(--neutral4)');
      } else {
          // SO BELOW is active (tabcontent2 is visible)
          $tabsWrap.css('border-right', '3px solid var(--accent1)');
      }
  }
);

  
});


  jQuery(function($) {
    var path = ".post_profile .post_userinfo .tabcontent1 .user_field";
    var parent = ".post_profile";
    
    // Move to tabcontent2
    var fieldsToMove = [
        "Messages", "Cristaux", "Date d'inscription", "Aka", "Pronoms IRL", "Thèmes abordés", "Thèmes refusés", "Infos RP", 
        "Zone libre 2", "Note", "Crédits"
    ];
    
    var customDestinations = {
        "Icone": ".custom-icon",
        "Autre identité": ".custom-name",
        "Rang personnalisé": ".custom-rank",
        "Icone HRP": ".custom-icon-hrp",
        "Faceclaim": ".faceclaim",
        "Pseudo": ".pseudo"
    };
    
    // Only hide labels (without moving)
    var fieldsToHideLabel = ["Zone libre 1", "Zone libre 2"];
    
    $(path).each(function() {
        var $field = $(this);
        var $label = $field.find('.field_label > .label');
        var fieldName = $label.text().replace(':', '').trim();
        
        // Check if this field has a custom destination
        if (customDestinations[fieldName]) {
            var $postProfile = $field.closest('.post_profile');
            var destinationSelector = customDestinations[fieldName];
            var $destination = $postProfile.find(destinationSelector);
            
            if ($destination.length > 0) {

                var $fieldContent = $field.find('.field_content');
                var $contentToMove = $fieldContent.html();
                $destination.html($contentToMove);
            }
            
            // Remove the entire field after moving its content
            $field.remove();
        }
        // Check if field should move to tabcontent2
        else if (fieldsToMove.includes(fieldName)) {
            var $tabcontent2 = $field.closest(parent).find('.tabcontent2');
            $tabcontent2.append($field);
        }
        // Check if field should just have its label hidden
        else if (fieldsToHideLabel.includes(fieldName)) {
            $field.find('.field_label').remove();
        }
    });
    
    // Additional cleanup for any remaining labels
    $('.field_label .label').each(function() {
        var text = $(this).text().replace(':', '').trim();
        if (fieldsToHideLabel.includes(text)) {
            $(this).parent('.field_label').remove();
        }
    });

    // Placeholder links

    var placeholderUrls = [
        "presentation.com",
        "journal.com", 
        "moodboard.com",
        "playlist.com"
    ];
    
    $('.profil_contact a').each(function() {
        var $link = $(this);
        var href = $link.attr('href');
        
        if (href) {
            // Check if the href contains any of the placeholder URLs
            var shouldRemove = placeholderUrls.some(function(placeholderUrl) {
                return href.includes(placeholderUrl);
            });
            
            if (shouldRemove) {
                $link.remove();
            }
        }
    });

    $('.user_field').css('visibility', 'visible');
});