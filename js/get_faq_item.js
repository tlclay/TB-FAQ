function getItem(title)
{
	var itemItself;
	alert("t: " + title);
	$('.tcat').each(function() {
		if($(this).text() == title)
		{		
			itemItself = $(this).parent().next();
		}
	});
	return itemItself;
}
