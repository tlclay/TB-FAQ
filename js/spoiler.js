// Hide content
function hideSpoilerContent(spoiler) {
    $(spoiler).find('.spoiler_header_bbc').css('padding-bottom', '0.2rem');
    $(spoiler).find('.spoiler_content_bbc').attr('hidden', 'hidden');
    $(spoiler).find('.spoiler_button_bbc').text('Show');
    $(spoiler).find('.spoiler_hr_bbc').remove();
}

// Display content
function showSpoilerContent(spoiler) {
    $(spoiler).find('.spoiler_header_bbc').css('padding-bottom', '0');
    $(spoiler).find('.spoiler_content_bbc').removeAttr('hidden');
    $(spoiler).find('.spoiler_button_bbc').text('Hide');
    $('<hr class="spoiler_hr_bbc"/>').insertAfter($(spoiler).find('.spoiler_button_bbc'));
}

// Click listener
$(document).ready(function() {
    $('body').on('click', '.spoiler_button_bbc', function(e) {
        var spoiler = $(e.target).closest('.spoiler_bbc');
        alert($(spoiler).text());
        var spoilerContent = $(spoiler).find('.spoiler_content_bbc');
        if (spoilerContent.attr('hidden') !== undefined) {
            showSpoilerContent(spoiler);
        } else {
            hideSpoilerContent(spoiler);
        }
    });
});

// DOM prep
$(document).ready(function() {
    var spoiler = $('.spoiler_bbc');
    var spoilerTitle = $(spoiler).find('.spoiler_title_bbc');
    var button = $('<button class="spoiler_button_bbc">aa</button>');
    $(button).insertAfter(spoilerTitle);
    hideSpoilerContent(spoiler);
});
