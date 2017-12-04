// Includes all other scripts. Also appends .css to <head>

$(document).ready(function () {
    $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://tb-faq.github.io/TB-FAQ/generic.min.css'
    }).appendTo('head');

    $.getScript('https://tb-faq.github.io/TB-FAQ/dropdown.min.js');
    $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://tb-faq.github.io/TB-FAQ/dropdown.min.css'
    }).appendTo('head');

    $.getScript('https://tb-faq.github.io/TB-FAQ/spoiler.min.js');
    $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://tb-faq.github.io/TB-FAQ/spoiler.min.css'
    }).appendTo('head');

    $.getScript('https://tb-faq.github.io/TB-FAQ/youtube_embed.min.js');

    $.getScript('https://tb-faq.github.io/TB-FAQ/staff_profiles_linker.min.js');
    $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://tb-faq.github.io/TB-FAQ/staff_colours.min.css'
    }).appendTo('head');
});