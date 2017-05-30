$(document).on("click", function() {
   var dropdown = $(event.target).closest('div.dropdown_bbc');
   var title = $(dropdown).children('strong.drop_title_bbc');
   var content = $(dropdown).children('ul.drop_content_bbc');
   var arrow = $(title).children('span.drop_arrow_bbc');
   
   //alert("t: " + title.html() + "\nc: " + content.html() + "\na: " + arrow.html());
   if (content.attr('hidden') !== undefined) {
      content.removeAttr('hidden');
      content.css('border-left', '1px dashed black');
      content.children().each(function() {
         if (!$(this).hasClass('drop_content_item_bbc')) {
            $(this).remove();
         }
      });
      content.contents().filter(function() {
         return (this.nodeType == 3);
      }).remove();
      arrow.text('▼');
   } else {
      content.attr('hidden', 'hidden');
      arrow.text('►');
   }
});
