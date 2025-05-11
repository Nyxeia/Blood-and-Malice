$(function() {
  // AS ABOVE
  $('body').on('click', '.as-above', function() {
      $('.tabcontent1').show();
      $('.tabcontent2').hide();

      // Show AS ABOVE elements
      $('.custom-icon').show();
      $('.custom-name').show();
      $('.custom-rank').show();
      
      // Hide SO BELOW elements
      $('.custom-icon-hrp').hide();
      $('.custom-fc').hide();
      $('.custom-pseudo').hide();

      // Update border colors
      $('.tabs-wrap').css({
          'border-left': '3px solid var(--accent1)',
          'border-right': '3px solid var(--neutral4)'
      });
  });
  
  // SO BELOW
  $('body').on('click', '.so-below', function() {
      $('.tabcontent1').hide();
      $('.tabcontent2').show();

      // Hide AS ABOVE elements
      $('.custom-icon').hide();
      $('.custom-name').hide();
      $('.custom-rank').hide();
      
      // Show SO BELOW elements
      $('.custom-icon-hrp').show();
      $('.custom-fc').show();
      $('.custom-pseudo').show();

      // Update border colors
      $('.tabs-wrap').css({
      'border-left': '3px solid var(--neutral4)',
      'border-right': '3px solid var(--accent1)'
      });
  });
});


  jQuery(function($) {
    var path = ".post_profile .post_userinfo .tabcontent1 .user_field";
    var parent = ".post_profile";
    
    // Move to tabcontent2
    var fieldsToMove = [
        "Credits", "Messages", "Date d'inscription",
        "Triggers", "Warnings", "Multicomptes",
        "Habitudes RPG", "Points"
    ];
    
    var customDestinations = {
        "Icone": ".custom-icon",
        "Autre identité": ".custom-name",
        "Rang personnalisé": ".custom-rank",
        "Icone HRP": ".custom-icon-hrp",
        "Faceclaim": ".custom-fc",
        "Pseudo": ".custom-pseudo"
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
});