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
