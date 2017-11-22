// Listens for click event on .spoiler_button_bbc, then toggles css.
$(document).ready(function() {
    $('body').on('click', '.spoiler_button_bbc', function(e) {
        var spoiler = $(e.target).closest('.spoiler_bbc');
        var spoilerHeader = $(spoiler).find('.spoiler_header_bbc:first');
        var spoilerContent = $(spoiler).find('.spoiler_content_bbc:first');
        var spoilerButton = $(spoiler).find('.spoiler_button_bbc:first');
        var spoilerHR = $(spoiler).find('.spoiler_hr_bbc:first');

        if (spoilerContent.is(':hidden')) {
            spoilerHeader.css('padding-bottom', '0');
            spoilerContent.slideDown(75);
            spoilerButton.text('Hide');
            spoilerHR.show();
        } else {
            spoilerHeader.css('padding-bottom', '0.2rem');
            spoilerContent.slideUp(75);
            spoilerButton.text('Show');
            spoilerHR.hide();
        }
    });
});
