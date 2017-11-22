function toggleSpoilerState(spoiler) {
    var spoilerHeader = $(spoiler).find('.spoiler_header_bbc:first');
    var spoilerContent = $(spoiler).find('.spoiler_content_bbc');
    var spoilerButton = $(spoiler).find('.spoiler_button_bbc:first');
    var spoilerHR = $(spoiler).find('.spoiler_hr_bbc:first');

    if ($(spoiler).find('.spoiler_content_bbc').is(':hidden')) {
        spoilerHeader.css('padding-bottom', '0');
        spoilerContent.show();
        spoilerButton.text('Hide');
        spoilerHR.show();
    } else {
        spoilerHeader.css('padding-bottom', '0.2rem');
        spoilerContent.hide();
        spoilerButton.text('Show');
        spoilerHR.hide();
    }
}

// Click listener
$(document).ready(function() {
    $('body').on('click', '.spoiler_button_bbc', function(e) {
        var spoiler = $(e.target).closest('.spoiler_bbc');
        toggleSpoilerState(spoiler);
    });
});

// DOM prep: locate spoiler, insert button after title.
$(document).ready(function() {
    var spoiler = $('.spoiler_bbc');
    $('<button class="spoiler_button_bbc"></button>').insertAfter($(spoiler).find('.spoiler_title_bbc:first'));
    $('<hr class="spoiler_hr_bbc"/>').insertAfter($(spoiler).find('.spoiler_button_bbc'));
    toggleSpoilerState(spoiler);
});

