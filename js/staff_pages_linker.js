// function staffLinkAll(item)
// ----
// Arguments:
// [1]. 'item': Represents the contents of an faq item.
// Return:
// None.
// ----
// Details:
// Attempts to set the target of all html links with class in the form 'class="faq_<staffgroup>' where '<staffgroup>' is a staff usergroup (see generic.css) to the correct url
function staffLinkAll(item)
{
	item.find('a.faq_clanSquad').attr("href", "http://forum.toribash.com/faq.php?faq=clans_main#faq_clans_staff");
	item.find('a.faq_clanManagement').attr("href", "http://forum.toribash.com/faq.php?faq=clans_main#faq_clans_staff");
}

// function staffLinkThis(item, link)
// ----
// Arguments:
// [1]. 'item': Represents the contents of an faq item.
// [2]. 'text': Represents a string in the form '<a class="faq_<staffgroup>">...</a>'.
// ----
// Details:
// Attempts to set the target of the html link to the correct url
function staffLinkThis(item, text)
{
	// todo
}
