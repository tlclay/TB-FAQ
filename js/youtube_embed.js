function embedAllYouTube(item)
{
	alert("item: " + item.text());
	item.find(".youtube").each(function() {
			alert("youtube detected: " + $(this).text());
			var url;
			var exp = /=(\S+)/;
			var linkText = $(this).text();
			
			var videoID = exp.exec(linkText);
			if(videoID != null)
			{
				url = "https://www.youtube.com/embed/" + videoID[1];
			}
			alert(url);
			$(this).replaceWith('<iframe width="560" height="315" src="' + url + '" frameborder="0" allowfullscreen=""></iframe>');
	});
}
