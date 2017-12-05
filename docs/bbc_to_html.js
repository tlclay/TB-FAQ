$(document).ready(function ()
{
    var colorReg = new RegExp(/^(#?(?:[\da-fA-F]{6}|[\da-fA-F]{3}))$|^((?:rgb|rgba)\(\d{0,3} *?, *?\d{0,3} *?, *?\d{0,3} *?\))$|^([a-zA-Z]+)$/);

    /*
    bbcAliases tag_name : { tag_info }
    tag_info : { requireOption (true|false), validParam (param) { return (true|false) }, validOption (option) { return (''|message) }, replace(param, option) { return replacement_string } }
    replacement_string: The HTML replacement for the BBCode being parsed
    */
    var bbcAliases = {
        question: {
            requireOption: false,
            replace: function (param, option)
            {
                return '<p class="faq_question"><span class="faq_q">Q: </span>' + param + '</p>'
            }
        },
        answer: {
            requireOption: false,
            replace: function (param, option)
            {
                return '<div class="faq_answer"><span class="faq_a">A: </span>' + param + '</div>'
            }
        },
        url: {
            requireOption: true,
            replace: function (param, option)
            {
                return '<a href="' + option + '">' + param + "</a>";
            }
        },
        img: {
            requireOption: true,
            replace: function (param, option)
            {
                return '<img src="' + param + '" alt="' + option + '" />'
            }
        },
        color: {
            requireOption: true,
            validOption: function (option)
            {
                return colorReg.test(option) ? '' : 'Invalid option for {$t}. Must be either a hex value (#ddd | #dddddd), an rgb value, a rgba value, or a colour name'
            },
            replace: function (param, option)
            {
                return '<span style="color:' + option + '">' + param + '</span>'
            }
        },
        size: {
            requireOption: true,
            validOption: function (option)
            {
                //  1-7 digit (legacy)|                        names                         |       measurement        | percentage |   relatives    |   globals
                return (/^ *(?:([1-7])|(xx-small|x-small|small|medium|large|x-large|xx-large)|(\d+ *(?:px|em|rem|vw|vh))|(\d{0,3} *%)|(smaller|larger)|(default|inherit|unset)) *$/).test(option) ? '' : 'Invalid option for {$t}.Must be either single digit [1-7], or a valid argument for the css font-size property.'
            },
            replace: function (param, option)
            {
                var parsedOption;
                var r = new RegExp(/^ *(?:([1-7])|(xx-small|x-small|small|medium|large|x-large|xx-large)|(\d+ *(?:px|em|rem|vw|vh))|(\d{0,3} *%)|(smaller|larger)|(default|inherit|unset)) *$/).exec(option);
                console.warn(r + ', ' + option);
                if (r[1]) // single digit, kept for legacy purposes (forum uses this style with <font> tags which are long depricated, need to keep syntax but update HTML produced)
                {
                    var names = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'];
                    parsedOption = names[parseInt(r[1])];
                } else 
                {
                    parsedOption = option;
                }
                return '<span style="font-size:' + parsedOption + '">' + param + '</span>';
            }
        },
        font: {
            requireOption: true,
            replace: function (param, option)
            {
                return '<span style="font-family:' + option + '">' + param + '</span>';
            }
        },
        b: {
            requireOption: false,
            replace: function (param, option)
            {
                return '<strong style="font-weight:bold">' + param + '</strong>';
            }
        },
        i: {
            requireOption: false,
            replace: function (param, option)
            {
                return '<em style="font-style:italic">' + param + '</em>';
            }
        },
        u: {
            requireOption: false,
            validOption: function (option)
            {
                return colorReg.test(option) ? '' : 'Invalid option for {$t}. Must be either a hex value (#hhh | #hhhhhh), an rgb value, a rgba value, or a colour name'
            },
            replace: function (param, option)
            {
                return '<span style="text-decoration:' + option + ' underline">' + param + '</span>';
            }
        },
        s: {
            requireOption: false,
            replace: function (param, option)
            {
                return '<s>' + param + '</s>';
            }
        },
        dropdown: {
            requireOption: true,
            replace: function (param, option)
            {
                return '<div class="dropdown_bbc"><strong class="drop_title_bbc">' + option + '<span class="drop_arrow_bbc">►</span></strong><div class="drop_content_bbc">' + param + '</div></div>';
            }
        },
        spoiler: {
            requireOption: true,
            replace: function (param, option)
            {
                return '<div class="spoiler_bbc"><div class="spoiler_header_bbc"><p class="spoiler_title_bbc">' + option + '</p><button type="button" class="spoiler_button_bbc">Show</button><hr class="spoiler_hr_bbc" style="display:none" /></div><div class="spoiler_content_bbc" style="display:none">' + param + '</div></div>';
            }
        },
        noparse: null,
        olist: {
            requireOption: false,
            validOption: function (option)
            {
                // need to move options and their tags into xml files, the number of list-style-types is insanely huge
                return (/(?:(a|A|i|I|1)|(lower-alpha|upper-alpha|lower-roman|upper-roman|decimal))/).test(option) ? '' : 'Invalid option for {$t}. Must be one of: [a|A|i|I|1] or [lower-alpha|upper-alpha|lower-roman|upper-roman|decimal]';
            },
            replace: function (param, option)
            {
                var parsedOption;
                var r = new RegExp(/^a|A|i|I|1/).exec(option);
                var names = {
                    a: 'lower-alpha',
                    A: 'upper-alpha',
                    i: 'lower-roman',
                    I: 'upper-roman',
                    1: 'decimal'
                };

                if (r !== null)
                {
                    parsedOption = names[r[0]];
                } else
                {
                    parsedOption = option;
                }
                return '<ol style="list-style-type:' + parsedOption + '">' + param + '</ol>';
            }
        },
        ulist: {
            requireOption: false,
            replace: function (param, option)
            {
                return '<ul>' + param + '</ul>';
            }
        },
        code: {
            requireOption: false,
            replace: function (param, option)
            {
                return '<pre class="code_bbc"><code>' + param + '</code></pre>';
            }
        },
        snippet: {
            requireOption: false,
            replace: function (param, option)
            {
                return '<span class="faq_code_snippet"><code>' + param + '</code></span>';
            }
        },
        anchor: {
            requireOption: true,
            replace: function (param, option)
            {
                return '<span id="'  + option + '" class="anchor_bbc">' + param + '</span>';
            }
        },
        gotoanchor: {
            requireOption: true,
            replace: function (param, option)
            {
                return '<a href="#' + option + '">' + param + '</a>'
            }
        },
        align: {
            requireOption: true,
            validOption: function (option)
            {
                (/^(left|center|right)$/).test(option) ? '' : 'Invalid option for {$t}. Must be one of: [left|center|right]';
            },
            replace: function (param, option)
            {
                var alignItems = '';
                var aligns = {
                    left: 'flex-start',
                    center: 'center',
                    right: 'flex-end'
                };
                if (aligns[option])
                {
                    alignItems =  aligns[option];
                }
                return '<div style="display: flex; flex-direction: column; align-items:' + alignItems + '; text-align:' + option + ';">' + param + '</div>';
            }
        },
        right: {
            requireOption: false,
            replace: function (param, option)
            {
                return bbcAliases.align.replace(param, 'right');
            }
        },
        center: {
            requireOption: false,
            replace: function (param, option)
            {
                return bbcAliases.align.replace(param, 'center');
            }
        },
        left: {
            requireOption: false,
            replace: function (param, option)
            {
                return bbcAliases.align.replace(param, 'left');
            }
        },
        table: {
            requireOption: false,
            replace: function (param, option)
            {
                return '<table class="faq_table">' + param + '</table>';
            }
        },
        tr: {
            requireOption: false,
            replace: function (param, option)
            {
                return '<tr>' + param + '</tr>';
            }
        },
        td: {
            requireOption: false,
            replace: function (param, option)
            {
                return '<td>' + param + '</td>';
            }
        },
        important:
        {
            requireOption: false,
            replace: function (param, option)
            {
                return '<div class="faq_importantInfo">' + param + '</div>'
            }
        }
    };

    function getbbcTags()
    {
        return Object.keys(bbcAliases);
    }

    function escapeRegExp(str)
    {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    function catchErrors(tagName, tagOption, tagParam)
    {
        var syntaxErrorOutput = $('#syntax_warning_text');
        // -1 = fine, 0 = crossed tag, 1 = option err
        var output = [-1, ''];
        if (tagParam)
        {
            var tagInfo = bbcAliases[tagName];
            if (!tagOption)
            {
                if (tagInfo.requireOption === true)
                {
                    console.warn('missing option: ' + tagName);
                    output[0] = 1;
                    output[1] += 'Tag [' + tagName + '] requires an option';

                }
            } else if (tagInfo.validOption)
            {
                var optionMessage = tagInfo.validOption(tagOption).replace(/{\$t}/g, '[' + tagName + ']' + '<br /><strong>Option supplied:</strong> ' + tagOption + '<br />');
                if (optionMessage !== '')
                {
                    console.warn('invalid option');
                    output[0] = 1;
                    output[1] += optionMessage;
                }
            }
        } else if (tagName != 'list')
        {
            output[0] = 0;
            output[1] = 'Unmatched tag (' + tagName + ')';
        } else
        {
            output[0] = 0;
            output[1] = '[list] tags are depricated. Use [olist] or [ulist]';
        }
        if (output[0] > -1)
        {
            var styles = ['warning', 'option_error'];
            syntaxErrorOutput.append('<div class="syntax_' + styles[output[0]] + '"><strong>Error:</strong> ' + output[1] + '</div>');
            return true;
        }
        return false;
    }

    function replaceTag(tagName, tagOption, tagParam)
    {
        //alert(tagName + ' | ' + tagOption + ' | ' + tagParam);
        if (tagOption)
        {
            console.log('top: ' + tagOption);
            tagOption = tagOption.replace(/^(\"?)(.*?)\1$/, '$2');
            console.log('top`:' + tagOption);
        }
        var tagParamSansLonelyTags = tagParam.replace(/\[(\/.+?)\]/g, '{?}$1]');
        //var tagParamSansLonelyTags = tagParam;
        if (tagName.toLowerCase() === 'noparse')
        {
            return '{NP}' + tagName + (tagOption ? '=' + tagOption : '') + ']' + tagParamSansLonelyTags + '[/' + tagName + ']';
        }
        else if (catchErrors(tagName, tagOption, tagParam))
        {
            return '{!}' + tagName + (tagOption ? '=' + tagOption : '') + ']' + tagParamSansLonelyTags + '{!}/' + tagName + ']';
        } else
        {
            return bbcAliases[tagName].replace(tagParamSansLonelyTags, tagOption);
        }
    }

    function isOpenTag(tag)
    {
        console.log('isopen(' + tag + ')?');
        if (bbcAliases[tag.replace(/\/|\s|(=.*)/g, '').toLowerCase()]) // if this is a real bbcode
        {
            //alert('>> ' + tag.replace(/\/|\s|(=.*)/g, ''));
            console.warn('is ' + tag + ' open?: ' + (/^(?!\/).+/i).test(tag));
            return (/^(?!\/).+/i).test(tag); // anything goes unless the first character is a '/'
        }
        return false;
    }

    function matchingTags(leftTag, rightTag)
    {
        console.log('matching(' + leftTag + ', ' + rightTag + ')?');
        var reg = new RegExp("^\\/?(" + escapeRegExp(leftTag) + "(?![\\s\\S]))", 'i'); // capture everything excluding a potential leading '/', fail if any extra characters aside from the tag itself
        if (reg.test(leftTag) === reg.test(rightTag))
        {
            console.log('\tyes');
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
        var reg = new RegExp("\\[(" + tagList + ")(?:=(.+?))?\\]([\\s\\S]*?)(?:\\[(\\/?(" + tagList + "))\\])", 'i'); // group 1: tag name, group 2: tag option, group 3: tag param, group 4: end tag name (m)
        console.log(reg);
        console.warn(reg.test(text));
        return reg.exec(text);
    }


    function parse(text, iterLevel = 0)
    {
        var tagPair = getNextTagPair(text);
        //alert('parse[' + iterLevel + ']');
        console.warn(text);
        //console.log('tp: ' + tagPair[1] + ', ' + tagPair[2] + ', ' + tagPair[3] + ', ' +  tagPair[4]);
        
        if (tagPair)
        {
            console.log('>>' + tagPair[4]);
            if (matchingTags(tagPair[1], tagPair[4]) && !isOpenTag(tagPair[4]))
            {
                // push us along if the right tag is an open tag OR if the left tag ISN'T an opening tag OR if we find a noparse tag
                tagPair[1] = tagPair[1].toLowerCase();
                tagPair[4] = tagPair[4].toLowerCase();

                var isNoParse = (/noparse/i).test(tagPair[1]);
                var htmlTemplate = bbcAliases[tagPair[1]];
                if (htmlTemplate)
                {
                    var r = new RegExp("\\[" + escapeRegExp(tagPair[4]) + "\\]", 'i');
                    var endOfThisTagPair = (text.substring(tagPair.index).search(r) + tagPair.index + tagPair[4].length + 2);
                    console.log(tagPair[1] + ' | ' + ' | ' + tagPair[3]);
                    var convertedText = text.replace(text.substring(tagPair.index, endOfThisTagPair), replaceTag(tagPair[1], (tagPair[2]) ? tagPair[2] : '', tagPair[3]));

                    // handle exceptional tags
                    if ((/noparse/i).test(tagPair[1]))
                    {
                        return convertedText.substring(0, endOfThisTagPair - (tagPair[1].length + tagPair[4].length + 4)) + parse(convertedText.substring(endOfThisTagPair - (tagPair[1].length + tagPair[4].length + 4)), iterLevel + 1);
                    } else
                    {
                        console.log('nopushed');
                        return parse(convertedText, iterLevel + 1);
                    }
                }
            } else 
            {
                console.log('pushed');
                return parse(text.replace(text.substring(tagPair.index + tagPair[1].length + 2 + ((tagPair[2]) ? tagPair[2].length + 1 : 0)), parse(text.substring(tagPair.index + tagPair[1].length + 2 + ((tagPair[2]) ? tagPair[2].length + 1 : 0)), iterLevel + 1)), iterLevel + 1);
            }

            
            if (!tagPair[4])
            {
                return text.replace(/\[(\/?.+?)\]/g, '{?}$1]')
            }
        }
        //alert('.');
        return text;
    }

    function prepare(input)
    {
        
        var output = input.replace(/\[(?:\*|(\d+))\]/g, function (match, number) { return number ? '<li value="' + number + '">' : '<li>' });
        output = output.replace(/(?:\r\n|\r|\n)/g, '<br />');

        return output;
    }

    function cleanup(parsed)
    {
        var rawOutput = parsed;


        var r = new RegExp(/(\[{\?}.*?\])/g)
        var tag;
        while ((tag = r.exec(parsed)) !== null)
        {
            catchErrors(tag[1]);
        }

        var tagList = '';
        var first = true;
        for (var tag of getbbcTags())
        {
            tagList += (first ? '' : '|') + tag;
            first = false;
        }
        r = new RegExp("(\\[\/?(" + tagList + ")(?:=(.+?))?\\])", 'gi');
        var unmatched;
        while ((unmatched = r.exec(parsed)) !== null)
        {
            console.warn(unmatched[2]);
            catchErrors(unmatched[2], unmatched[3]);
        }
        parsed = parsed.replace(r, '<span style="background-color: orange">$1</span>');

        var oldLists;
        r = new RegExp(/(\[(list)\])/gi);
        while ((oldLists = r.exec(parsed)) !== null)
        {
            console.warn('[list] is deprecated; use [ulist] or [olist]');
            catchErrors(oldLists[2]);
        }
        parsed = parsed.replace(r, '<span style="background-color: orange">$1</span>');

        parsed = parsed.replace(/{!}(.*?)\](.*?){!}\/(.*?)\]/g, '<span style="background-color: rgb(255, 114, 114); display: inline-block;">[$1]$2[/$3]</span>');
        parsed = parsed.replace(/{!}/g, '');

        //parsed = parsed.replace(/{(\?|!)}/g, '');


        rawOutput = rawOutput.replace(/{!}/g, '[');
        rawOutput = rawOutput.replace(/{\?}/g, '[');
        $('#html_output_text').html(rawOutput);


        return parsed;
    }

    // listener for button click
    $('#input_wrapper').on('click', '#bbc_input_submit', function ()
    {
        var start = performance.now();
        $('#syntax_warning_text').html('');
        var out = cleanup(parse(prepare($('#bbc_input_text').val())));
        var displayArea = $('#html_display_area');
        displayArea.css('display', 'block');
        displayArea.find('.tcat').html($('#bbc_input_title').val());
        displayArea.find('.alt1').html(out);
        console.warn('Took ' + (performance.now() - start) + 'ms');
    });
});