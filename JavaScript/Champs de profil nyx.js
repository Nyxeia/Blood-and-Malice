var selectedColor = {
  "text-transform" : "uppercase"
};
  
var defaultColor = {
  "text-transform" : "lowercase"
};
  
  $( function(){
    $('body')
      .on('click', '.as-above', function(){

        var above = $(this).nextAll(".tabcontent:first");
        var below = $(this).nextAll(".tabcontent2:first");

        if (below.is(":visible")) {
  
          below.hide();
          above.show();
  
          $(this).css(selectedColor);
          $(this).nextAll(".so-below:first").css(defaultColor);
        }
      });
  });
  
  $( function(){
    $('body')
      .on('click', '.so-below', function(){
  
      var above = $(this).nextAll(".tabcontent:first");
      var below = $(this).nextAll(".tabcontent2:first");
  
        if (above.is(":visible")) {
  
          above.hide();
          below.show();
  
          $(this).css(selectedColor);
          $(this).prevAll(".as-above:first").css(defaultColor);
        }
  
      });
  });
  
  
jQuery(function($) {
  var path = ".post_profile .post_userinfo .tabcontent1 .user_field";
  var parent = ".post_profile";
  
  // Configuration: fields to move and fields to hide labels
  var fieldsToMove = [
      "Avatar", "Credits", "Messages", "Date d'inscription",
      "Triggers", "Warnings", "Pseudo", "Multicomptes",
      "Habitudes RPG", "Points"
  ];
  
  var fieldsToHideLabel = ["Icone", "Zone libre 1", "Zone libre 2"];
  
  $(path).each(function() {
      var $field = $(this);
      var $label = $field.find('.field_label .label');
      var fieldName = $label.text().replace(':', '').trim();
      
      // Move field to tabcontent2 if it's in the move list
      if (fieldsToMove.includes(fieldName)) {
          var $tabcontent2 = $field.closest(parent).find('.tabcontent2');
          $tabcontent2.append($field);
      }
      
      // Handle the Icone field specially
      if (fieldName === "Icone") {
          // Find the image in this field
          var $image = $field.find('.field_content img');
          
          if ($image.length > 0) {
              // Find the custom-icon div in the same post profile
              var $customIcon = $field.closest('.post_profile').find('.custom-icon');
              
              // Move the image to the custom-icon div
              if ($customIcon.length > 0) {
                  $customIcon.append($image);
              }
          }
          
          // Remove the entire Icone field since we've moved its content
          $field.remove();
      }
      // Handle other fields that need their labels hidden
      else if (fieldsToHideLabel.includes(fieldName)) {
          // Remove the entire label element
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