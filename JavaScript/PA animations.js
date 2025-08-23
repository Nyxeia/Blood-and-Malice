$(document).ready(function(){
  // --- PANEL TOGGLE FUNCTIONALITY ---
  var savedPanelState = $.cookie("pa_state");
  var savedImgState = $.cookie("pa_img_state");
  
  // Set initial panel state
  if (savedPanelState === "closed") {
    $("#pa").hide();
    $("#pa-btn").html("<i class='ion-chevron-down'></i>");
  } else if (savedPanelState === "open") {
    $("#pa-btn").html("<i class='ion-chevron-up'></i>");
  } else {
    var currentUrl = window.location.href;
    var isForumIndex = currentUrl === "https://bloodandmalice.forumactif.com/";
    
    if (isForumIndex) {
      // Open by default on forum index
      $("#pa-btn").html("<i class='ion-chevron-up'></i>");
    } else {
      // Close by default on other pages
      $("#pa").hide();
      $("#pa-btn").html("<i class='ion-chevron-down'></i>");
    }
  }
  
  // Panel button click handler
  $("#pa-btn").click(function(){
    $("#pa").slideToggle("normal", function(){
      var state;
      
      if ($(this).is(":hidden")) {
        state = "closed";
        $("#pa-btn").html("<i class='ion-chevron-down'></i>");
      } else {
        state = "open";
        $("#pa-btn").html("<i class='ion-chevron-up'></i>");
        
        // If panel was closed but now opened, and image was saved as expanded
        if (savedPanelState === "closed" && savedImgState === "expanded") {
          // Wait for panel animation to complete
          setTimeout(function() {
            applyExpandedImageState();
          }, 100);
        }
        
        // Update saved panel state
        savedPanelState = "open";
      }
      
      $.cookie("pa_state", state);
      console.log($.cookie("pa_state"));
    });
  });
  
  // --- IMAGE EXPAND/COLLAPSE FUNCTIONALITY ---
  // Store original image width
  var $img = $("#pa-img");
  var originalWidth = $img.width();
  $img.data("originalWidth", originalWidth);
  
  // Apply initial image state if panel is open
  if (savedPanelState !== "closed" && savedImgState === "expanded") {
    applyExpandedImageState();
  }
  
  // Function to apply expanded image state
  function applyExpandedImageState() {
    var $container = $("#pa-contexte");
    var $textDiv = $("#pa-contexte .pa-texte");
    var containerWidth = $container.width();
    
    // Hide the text and expand the image
    $textDiv.hide();
    $img.width(containerWidth);
    $img.addClass("expanded");
  }
  
  // Image click handler
  $("#pa-img").click(function(){
    var $img = $(this);
    var $container = $("#pa-contexte");
    var $textDiv = $("#pa-contexte .pa-texte");
    
    // Check if image is already expanded
    if ($img.hasClass("expanded")) {
      // Restore to original size
      $img.animate({
        width: $img.data("originalWidth")
      }, 400, function() {
        // Show the text after animation completes
        $textDiv.fadeIn();
        $img.removeClass("expanded");
        // Save the state in a cookie
        $.cookie("pa_img_state", "collapsed");
        savedImgState = "collapsed";
      });
    } else {
      // Get container width and expand the image
      var containerWidth = $container.width();
      
      // Hide the text first
      $textDiv.fadeOut(200, function() {
        // Then expand the image
        $img.animate({
          width: containerWidth
        }, 400);
        $img.addClass("expanded");
        // Save the state in a cookie
        $.cookie("pa_img_state", "expanded");
        savedImgState = "expanded";
      });
    }
  });

});