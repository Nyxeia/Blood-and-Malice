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