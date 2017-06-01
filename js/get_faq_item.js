function getItem(title)
{
	var itemItself;
	alert("t: " + title);
	$('.tcat').each(function() {
		if($(this).text() == title)
		{
			itemItself = $(this).parent().next('.alt1');
		}
	});
	alert("i: " + itemItself.text());
	return itemItself;
}
