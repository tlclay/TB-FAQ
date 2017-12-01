$(document).ready(function ()
{


    function bbc_faq_question()
    {
        return '<p class="faq_question"><span class="faq_q">Q: </span>{param}</p>';
    }

    function bbc_faq_answer()
    {
        return '<div class="faq_answer"><span class="faq_a">A: </span>{param}</div>';
    }

    function bbc_url()
    {
        return '<a href="{option}">{param}</a>';
    }

    function bbc_color()
    {
        return '<span style="color: {option}">{param}</span>';
    }

    function bbc_b()
    {
        return '<strong>{param}</strong>';
    }

    function bbc_i()
    {
        return '<em>{param}</em>';
    }

    function bbc_dropdown()
    {
        return '<div class="dropdown_bbc"><strong class="drop_title_bbc">{option} <span class="drop_arrow_bbc">►</span></strong><div class="drop_content_bbc">{param}</div></div>';
    }

    function bbc_spoiler()
    {
        return '<div class="spoiler_bbc"><div class="spoiler_header_bbc"><p class="spoiler_title_bbc">{option}</p><button type="button" class="spoiler_button_bbc">Show</button><hr class="spoiler_hr_bbc" style="display:none" /></div><div class="spoiler_content_bbc" style="display:none">{param}</div></div>';
    }

    function bbc_noparse()
    {
        return '{param}';
    }

    function bbc_olist()
    {
        return '<ol type={option}>{param}</ol>';
    }

    function bbc_ulist()
    {
        return '<ul>{param}</ul>';
    }

    var bbcAliases = {
        'question': bbc_faq_question(),
        'answer': bbc_faq_answer(),
        'url': bbc_url(),
        'color': bbc_color(),
        'b': bbc_b(),
        'i': bbc_i(),
        'dropdown': bbc_dropdown(),
        'spoiler': bbc_spoiler(),
        'noparse': bbc_noparse(),
        'olist': bbc_olist(),
        'ulist': bbc_ulist(),
        
    };

    function getbbcTags()
    {
        return Object.keys(bbcAliases);
    }

    function escapeRegExp(str)
    {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    function replaceTag(tagName, tagOption, tagParam)
    {
        var htmlTemplate = bbcAliases[tagName];
        if (htmlTemplate !== undefined)
        {

            return htmlTemplate.replace(/{option}/g, tagOption).replace(/{param}/g, tagParam);
        }
    }

    function isOpenTag(tag)
    {
        if (bbcAliases[tag.replace(/\/\s/g, '')]) // if this is a real bbcode
        {

            return (/^(?!\/).+/).test(tag); // anything goes unless the first character is a '/'
        }
        return false;
    }

    function matchingTags(leftTag, rightTag)
    {
        var reg = new RegExp("^\\/?(" + escapeRegExp(leftTag) + "(?![\\s\\S]))", 'i'); // capture everything excluding a potential leading '/', fail if any extra characters aside from the tag itself
        if (reg.test(leftTag) === reg.test(rightTag))
        {
            return true;
        }
        return false;
    }


    // tag pair means the next two tags, not the next two matching tags, or even tags of the same type
    // expects ws to be cleared
    function getNextTagPair(text)
    {
        var tagList = '';
        var first = true;
        for (var tag of getbbcTags())
        {
            tagList += (first ? '' : '|') + tag;
            first = false;
        }
        var reg = new RegExp("\\[(" + tagList + ")(?:=(\\S+?))?\\]([\\s\\S]*?)\\[(\\/?\\1)\\]", 'i'); // group 1: tag name, group 2: tag option, group 3: tag param, group 4: end tag name (m)
        return reg.exec(text);
    }


    function parse(input, iterLevel = 0)
    {
        var text = input.replace(/\[(?:\*|(\d+))\]/g, function (match, number) { return number ? '<li value="' + number + '">' : '<li>' });
        var tagPair = getNextTagPair(text);
        

        if (tagPair)
        {

            // push us along if the right tag is an open tag OR if the left tag ISN'T an opening tag OR if we find a noparse tag
            if (isOpenTag(tagPair[4]) || !isOpenTag(tagPair[1]))
            {
                return parse(text.replace(text.substring(tagPair.index + tagPair[1].length + 2 + ((tagPair[2]) ? tagPair[2].length + 1 : 0)), parse(text.substring(tagPair.index + tagPair[1].length + 2 + ((tagPair[2]) ? tagPair[2].length + 1 : 0)))), iterLevel + 1);
            } else if (matchingTags(tagPair[1], tagPair[4]))
            {
                var isNoParse = (/noparse/i).test(tagPair[1]);
                var htmlTemplate = bbcAliases[tagPair[1]];
                if (htmlTemplate)
                {
                    var r = new RegExp("\\[" + escapeRegExp(tagPair[4]) + "\\]", 'i');
                    var endOfThisTagPair = (text.substring(tagPair.index).search(r) + tagPair.index + tagPair[4].length + 2);
                    var convertedText = text.replace(text.substring(tagPair.index, endOfThisTagPair), replaceTag(tagPair[1], (tagPair[2]) ? tagPair[2] : '', tagPair[3]));

                    // handle exceptional tags
                    if ((/noparse/i).test(tagPair[1]))
                    {
                        return convertedText.substring(0, endOfThisTagPair - (tagPair[1].length + tagPair[4].length + 4)) + parse(convertedText.substring(endOfThisTagPair - (tagPair[1].length + tagPair[4].length + 4)), iterLevel + 1);
                    } else
                    {
                        return parse(convertedText, iterLevel + 1);
                    }
                }
            }

        }


        return text;

    }

    // listener for button click
    $('#input_wrapper').on('click', '#bbc_input_submit', function ()
    {
        var out = parse($('#bbc_input_text').val());
        $('#html_output_text').val(out);
        $('#html_display_area').html(out).css('display', 'block');
    });

});