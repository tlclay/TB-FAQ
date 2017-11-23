// finds links with class name starting with 'staff_', then sets their href attribute as their forum profile
$(document).ready(function () {
    $('a[class^="staff_"]').attr('href', function () { return 'http://forum.toribash.com/member.php?username=' + $(this).html() });
})