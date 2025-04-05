document.addEventListener('DOMContentLoaded', () => {
    let subforums = document.querySelectorAll(".subforum");
    
    for (var i=0; i<subforums.length; i++) {
      var subforum = subforums[i];
      
      if (subforum.scrollHeight > 30) {
        subforum.insertAdjacentHTML("afterbegin", '<span class="ext box2">＋</span>');
      }
      
      subforum.addEventListener("mouseover", function() {
        this.style.height = this.scrollHeight + "px";
      });
      
      subforum.addEventListener("mouseout", function() {
        this.style.height = "27px";
      });
    }
  });
  
  