// function getItem(title)
// ----
// Arguments:
// [1]. 'title': The title, in plain text, of the faq item you want to access.
// ----
// Return:
// Always attempts to return a jquery object representing the row immediately after the row containing the title (the content of the item).

function getItem(title)
{
	var itemItself;
	$('.tcat').each(function() {
		if($(this).text() == title)
		{		
			itemItself = $(this).parent().next();
		}
	});
	return itemItself;
}
