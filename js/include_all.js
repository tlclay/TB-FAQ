// Includes all other scripts. Also appends .css to <head>

$(document).ready(function () {
    $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://rawgit.com/TB-FAQ/TB-FAQ/master/css/generic.min.css'
    }).appendTo('head');

    $.getScript('https://rawgit.com/TB-FAQ/TB-FAQ/master/js/dropdown.min.js');
    $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://rawgit.com/TB-FAQ/TB-FAQ/master/css/dropdown.min.css'
    }).appendTo('head');

    $.getScript('https://rawgit.com/TB-FAQ/TB-FAQ/master/js/spoiler.min.js');
    $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://rawgit.com/TB-FAQ/TB-FAQ/master/css/spoiler.min.css'
    }).appendTo('head');

    $.getScript('https://rawgit.com/TB-FAQ/TB-FAQ/master/js/youtube_embed.min.js');
});