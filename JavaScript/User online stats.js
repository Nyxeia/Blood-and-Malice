function replaceTotalUsersText() {
    const totalUsersSpan = document.getElementById('total_users');
    
    if (!totalUsersSpan) {
      console.error("Couldn't find the total_users span");
      return;
    }
    
    // Get the original text
    const originalText = totalUsersSpan.textContent;
    
    // Extract numbers from the original text using regex
    // Looking for patterns like "Il y a en tout X" and "X Enregistré, Y Invisible et Z Invité"
    const totalMatch = originalText.match(/Il y a en tout (\d+)/i);
    const detailsMatch = originalText.match(/(\d+) Enregistré.*?(\d+) Invisible.*?(\d+) Invité/i);
    
    if (!totalMatch || !detailsMatch) {
      console.error("Couldn't extract numbers from the original text");
      return;
    }
    
    // Extract the numbers
    const totalSpirits = parseInt(totalMatch[1], 10);
    const registered = parseInt(detailsMatch[1], 10);
    const invisible = parseInt(detailsMatch[2], 10);
    const guests = parseInt(detailsMatch[3], 10);
    
    const pluralize = (count, singular, plural) => count === 1 ? singular : plural;
    
    const newText = `${totalSpirits} &nbsp; ${pluralize(totalSpirits, 'esprit erre', 'esprits errent')}, &nbsp; dont ${registered} &nbsp; ${pluralize(registered, 'habitué', 'habitués')}, &nbsp; ${invisible} &nbsp; ${pluralize(invisible, 'visiteur', 'visiteurs')} &nbsp; et &nbsp; ${guests} &nbsp; ${pluralize(guests, 'fantôme', 'fantômes')}`;
    
    // Replace the text inside the span, keeping any HTML tags that might be inside
    totalUsersSpan.innerHTML = newText;
  }
  
  // Execute the function when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', replaceTotalUsersText);
  
  // If the page is already loaded, run the function immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    replaceTotalUsersText();
  }