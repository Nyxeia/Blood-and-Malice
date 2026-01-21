$(function() {
var el = $('.topicslist-title');
    
el.find('img[src="https://2img.net/zupimages.net/up/22/46/94n0.png"]').replaceWith('<span style=\"color:var(--textColor2);font-size: 12px;line-height: 17px;\">✦</span>');
});

$(function() {
    var topicType = $('.topic-type');
    topicType.find('strong:contains("Annonce globale:")').text('Important ✧');
    topicType.find('strong:contains("Annonce:")').text('Annonce ✧');
    topicType.find('strong:contains("Note:")').text('Note ✧');
  });


  // CODE BY NYXEIA

document.addEventListener('DOMContentLoaded', () => {

var noNewTemp = "https://2img.net/images2.imgbox.com/1e/8d/dJqoidn7_o.png";
var newTemp = "https://2img.net/images2.imgbox.com/53/dd/9BUrEYyh_o.png";

var currentCatImgList = document.getElementsByClassName("forum-img");
var currentMsgImgList = document.getElementsByClassName("topicslist-img");

// Add class to category img 
for (var currentImg of currentCatImgList) {
  
    switch (currentImg.getAttribute("src"))
    {
        case newTemp:
            currentImg.classList.add("img-new");
            break;
        case noNewTemp: 
        default:
            currentImg.classList.add("img-nonew");
            break;
    }
}

// Same for new message in topic
for (var currentDiv of currentMsgImgList) {
    var currentImg = currentDiv.firstChild;

    switch (currentImg.getAttribute("src"))
    {
        case newTemp: 
            currentImg.classList.add("img-new");
            break;
        case noNewTemp: 
        default:
            currentImg.classList.add("img-nonew");
            break;
    }
}
});