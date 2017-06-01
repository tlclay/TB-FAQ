var thisItem = document.scripts[document.scripts.length - 1].parentNode; // get current faq item so we don't interfere with others
//var thisItem = $(script)[$(script).length - 1].parent(); // attempt

$(document).ready { function()
{
	alert(thisItem.html());
	$('.faq_clanSquad').attr("href", "http://forum.toribash.com/faq.php?faq=clans_main#faq_clans_staff"));
});
