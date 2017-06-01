function getItem(title)
{
	alert("getItem");
	var itemItself;
	
	$('.tcat').each(function() {
		if($(this).text() == title)
		{
			itemItself = $(this).siblings('.alt1');
		}
	});

	return itemItself;
}
