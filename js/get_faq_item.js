function getItem(title)
{
	var itemItself;
	$(document).ready(function() {
		$('.tcat').each(function() {
			if($(this).text() == title)
			{
				itemItself = $(this).siblings('.alt1');
			}
		});
	});
	return itemItself;
}
