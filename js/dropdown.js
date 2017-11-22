$(document).ready(function() {
	$('.drop_arrow_bbc').html(' ►');
	$('.drop_arrow_bbc').css('color', 'black');

    $('body').on('click', '.drop_title_bbc', function(e) {
        var dropdown = $(e.target).closest('.dropdown_bbc');
        var dropArrow = $(dropdown).find('.drop_arrow_bbc:first');
        var dropContent = $(dropdown).find('.drop_content_bbc:first');

        if (dropContent.is(':hidden')) {
            dropArrow.html(' ▼');
            dropContent.slideDown(75);
        } else {
            dropArrow.html(' ►');
            dropContent.slideUp(75);
        }
    });
});
