function staffLinkAll(item)
{
	alert(item.text());
	item.find('a.faq_clanSquad').attr("href", "http://forum.toribash.com/faq.php?faq=clans_main#faq_clans_staff");
}

function staffLinkThis(item, text)
{
}
