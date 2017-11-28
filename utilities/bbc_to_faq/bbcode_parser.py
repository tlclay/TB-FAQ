
def trim_outer_ws(txt):
    l = len(txt)
    lws = 0
    tws = l-1
    while lws < l and txt[lws] in " \n\t":
        lws += 1
    while tws > lws and txt[tws] in " \n\t":
        tws -= 1
    return txt[lws:tws+1]

def trim_trailing_ws(txt):
    l = len(txt)
    tws = l-1
    while tws > 0 and txt[tws] in " \n\t":
        tws -= 1
    return txt[:tws+1]

def bbc_b(data):
    if len(data) == 2: ## no option passed
        return [("final","<strong>"),("ndata",data[1]),("final","</strong>")]
    else: ## option handled as style
        return [("final",'<strong style="' + data[1] + '">'),("ndata",data[2]),("final","</strong>")]

def bbc_i(data):
    if len(data) == 2:
        return [("final","<em>"),("ndata",data[1]),("final","</em>")]
    else:
        return [("final",'<em style="' + data[1] + '">'),("ndata",data[2]),("final","</em>")]

def bbc_list(data):
    ret = []
    if len(data) == 2: ## unordered list
        ot = "<ul>"
        ct = "</ul>"
        li = first_level_split(data[1],"[*]")
    else: ## ordered list
        ot = "<ol>"
        ct = "</ol>"
        li = first_level_split(data[2],"[*]")
    if len(li) > 1:
        ret.append(("final",ot))
        for i in li[1:]:
            ret.append(("final","<li>"))
            ret.append(("data",trim_outer_ws(i))) ## drop first (hopefully empty) element and trim outer whitespace on each
            ret.append(("final","</li>"))
        ret.append(("final",ct))
        return ret
    print("Empty list?")
    return [("final","[list][/list]")]

def bbc_url(data):
    if len(data) == 3:
        return [("final",'<a href="' + data[1] + '">'),("ndata", data[2]),("final","</a>")]
    else:
        return [("final",'<a href="' + data[1] + '">' + data[1] + '</a>')]
        
def bbc_img(data):
    if len(data) == 2:
        return [("final",'<img src="'+data[1]+'"/>')]
    else:
        return [("final",'<img src="'+data[2]+'" title="'+data[1]+'"/>')]

def bbc_dropdown(data):
    if len(data) == 3:
        ret = [("final",'<div class="dropdown_bbc"><strong class="drop_title_bbc">' + data[1] + ' <span class="drop_arrow_bbc">►</span></strong><div class="drop_content_bbc"><p>')]
        ret.append(("data",data[2]))
        ret.append(("final",'</p></div></div>'))
        return ret
    return [("final",'[dropdown]'),("data",data[1]),("final","[/dropdown]")]

def bbc_importantInfo(data):
    if len(data) == 2:
        return [('final','<p class="faq_importantInfo">'),('ndata',data[1]),('final','</p>')]
    return [("final",'[important='+data[1]+']'),('ndata',data[2]),('final','[/important]')]

def bbc_codeSnippet(data):
    if len(data) == 2:
        return [('final','<span class="faq_code_snippet">'),('ndata',data[1]),('final','</span>')]
    return [("final",'[snippet='+data[1]+']'),('ndata',data[2]),('snippet','[/snippet]')]

def bbc_table(data):
    if len(data) == 3:
        content = data[2]
        delim = data[1]
    else:
        content = data[1]
        delim = "|"

    csplit = first_level_split(content, "\n\n")

    if len(csplit) == 1:
        head = []
        mtmp = csplit[:]
        main = []
        for i in mtmp:
            for l in first_level_split(i,"\n"):
                if len(l) > 1:
                    main.append(l)
    else:
        head = first_level_split(csplit[0],"\n")
        mtmp = csplit[1:]
        main = []
        for i in mtmp:
            for l in first_level_split(i,"\n"):
                if len(l) > 1:
                    main.append(l)
    ret = [('final','<table class="faq_table">')]

    for line in head:
        ret.append(('final','<tr>'))
        for item in line.split(delim):
            ret.append(('final','<th>'))
            ret.append(('data',trim_outer_ws(item)))
            ret.append(('final','</th>'))
        ret.append(('final','</tr>'))

    for line in main:
        ret.append(('final','<tr>'))
        for item in line.split(delim):
            ret.append(('final','<td>'))
            ret.append(('data',trim_outer_ws(item)))
            ret.append(('final','</td>'))
        ret.append(('final','</tr>'))
    ret.append(('final','</table>'))
    return ret

def bbc_noparse(data):
    if len(data) == 2:
        return [('final',data[1])]
    else:
        return [('final',data[2])]

def bbc_p(data):
    if len(data) == 2:
        dat = trim_outer_ws(data[1])
        if len(dat) > 0:
            return [('final','<p>'),('data',dat),('final','</p>')]
        else:
            return []
    else:
        dat = trim_outer_ws(data[2])
        if len(dat) > 0:
            return [('final','<p style="' + data[1] + '">'),('data',dat),('final','</p>')]
        else:
            return []

def bbc_hover(data):
    if len(data) == 2:
        return [('final','[hover]'),('data',data[1]),('final','[/hover]')]
    else:
        return [('final','<span class="faq_hoverExplain" title="'+data[1]+'">'),('data',data[2]),('final','</span>')]

## New BBcode are added here. Define a handler function above and then add the tag here:
all_bbc_tags = {"b":bbc_b,"i":bbc_i,"list":bbc_list,"url":bbc_url,"img":bbc_img,"dropdown":bbc_dropdown,"important":bbc_importantInfo,
                "snippet":bbc_codeSnippet,"table":bbc_table,"noparse":bbc_noparse,"p":bbc_p,"hover":bbc_hover}

def is_bbc_tag(tag):
    s = tag.split("=")
    return (s[0].lower() in all_bbc_tags)

## Starting at the opening [
## return value: (region checked through, tag found, closing?, option if any)
def determine_tag_starting_at(text,bbcstart):
    if text[bbcstart] != "[":
        return (bbcstart+1,None,False,None)

    l = len(text)

    is_close = False
    tagstart = bbcstart + 1
    if text[tagstart] == "/":
        is_close = True
        tagstart += 1
    
    tagend = tagstart + 1

    tag = None
    opt = None
    while tagend < l:
        if text[tagend] == "]":
            tag = text[tagstart:tagend].lower()
            if not tag in all_bbc_tags:
                return(tagend+1,None,is_close,opt)
            break
        elif text[tagend] == "=":
            if is_close:
                return(tagend+1,None,is_close,opt) ## closing tags don't have options!
            tag = text[tagstart:tagend].lower()
            if not tag in all_bbc_tags:
                return(tagend+1,None,is_close,opt)

            optstart = tagend+1
            if text[optstart] == '"':
                optstart += 1
                optend = optstart+1
                while optend < l:
                    if text[optend] == '"' and text[optend-1] != '\\':
                        if text[optend+1] != "]":
                            return(optend+1,None,is_close,opt)
                        opt = text[optstart:optend]
                        optend += 1
                        break
                    optend += 1
                if optend == l:
                    return(optstart,None,is_close,opt) ## could return l, but that'd kill some semi-valid parsing ability
            else:
                optend = optstart+1
                while optend < l and text[optend] != "]":
                    optend += 1
                if optend == l:
                    return(optstart,None,is_close,opt) ## could return l, but that'd kill some semi-valid parsing ability
                opt = text[optstart:optend]
            break
        tagend += 1
    if not opt is None:
        tagend = optend + 1
    else:
        tagend += 1
    return (tagend, tag, is_close, opt)

## finds closing tag.
## returns tuple: (start of closing tag, end of closing tag + 1)
## returns None if no such tag exists.
def determine_closing_tag(tag,text,start):
    noparse_depth = False
    if tag == "noparse":
        noparse_depth = True
    bbc_depth = 1

    l = len(text)
    i = start
    found_close = False

    while i < l:
        if text[i] == "[":
            newtag = determine_tag_starting_at(text,i)
            if noparse_depth:
                if newtag[1] == "noparse" and newtag[2]:
                    noparse_depth = False
                else:
                    i += 1
                    continue
            else:
                if newtag[1] == "noparse" and not newtag[2]:
                    noparse_depth = True
                    i = newtag[0] ## noparse is a valid tag, so if it closed we can skip to its close.
                    continue
            if newtag[1] == tag:
                if newtag[2]:
                    bbc_depth -= 1
                    if bbc_depth == 0:
                        found_close = True
                        break
                else:
                    bbc_depth += 1
            i = newtag[0]
            continue
        i += 1

    if not found_close:
        return None
    else:
        return (i, newtag[0])

def first_level_split(text,delim):
    parts = []
    l = len(text)
    ld = len(delim)
    lc = l-ld

    last = 0
    i = 0
    while i <= lc:
        if text[i:i+ld] == delim:
            parts.append(text[last:i])
            last = i+ld
            i = last
            continue
        if text[i] == "[":
            tag = determine_tag_starting_at(text,i)
            if tag[1] is None:
                i += 1
                continue
            if tag[2] == True:
                i = tag[0]
                continue
            closetag = determine_closing_tag(tag[1],text,tag[0])
            if closetag is None:
                i = tag[0]
                continue
            else:
                i = closetag[1]
                continue
        i += 1
    parts.append(text[last:])
    
    return parts

def parse_error_handler(data):
    print("parse error encountered, see output!")
    return [("final","[parse-error]"+str(data)+"[/parse_error]")]

def bbcode_outerbreak(text):
    res = []
    bbc_depth = 0
#    noparse_depth = False

    lastdata = 0
    bbcstart = lastdata

    l = len(text)
    while bbcstart < l:
        if text[bbcstart] == "[":
            bbc = determine_tag_starting_at(text,bbcstart)
            if bbc[1] is None:
                bbcstart = bbc[0]
                continue
            if bbc[2] == True:
                ## closing tag before opening tag
                bbcstart = bbc[0]
                continue

            closetag = determine_closing_tag(bbc[1], text, bbc[0])

            ## we may or may not have found a close tag by now:
            if not closetag is None:
                ## we found the closing tag, push any old data to the list.
                if lastdata != bbcstart:
                    ## this data has already been found to contain no new interesting things, pass as a final
                    res.append(("nfinal",text[lastdata:bbcstart]))
                tagname = "+"+bbc[1]
                tagdata = text[bbc[0]:closetag[0]]
                if bbc[3] is None:
                    res.append((tagname,tagdata))
                else:
                    res.append((tagname,bbc[3],tagdata))
                lastdata = closetag[1]
                bbcstart = closetag[1]
                continue
            else:
                bbcstart = bbc[0]
        else:
            bbcstart += 1
    ## we have left the loop, so we know any remaining data does not contain bbcodes!
    if lastdata < l:
        res.append(("nfinal",text[lastdata:]))
    return res

def process_bbcode(rtype,text):
    final = ""
    recursor = [(rtype,text)]

    new_recursor = []
    
    while len(recursor) > 0:
        ## start with the first element, break it into chunks, and attempt to finalize these chunks
        new_recursor.clear()
        insert_final = True
        for item in recursor:
            if insert_final and (item[0] == "final" or item[0] == "nfinal"):
                i = item[1]
                if item[0] == "nfinal":
                    i = i.replace("\n","<br/>")
                final += i ## final will only ever have data.
            else:
                ## only the first portion of the finals can be inserted into final
                ## everything else will need to go to a new recursor.
                insert_final = False
                if item[0] == "final":
                    new_recursor.append(item)
                    continue ## special case, we don't want the [t] cleanup at the end
                elif item[0] == "nfinal":
                    new_recursor.append(("final",item[1].replace("\n","<br/>")))
                    continue ## special case, we don't want the [t] cleanup at the end
                elif item[0] == "data":
                    t = bbcode_outerbreak(trim_outer_ws(item[1]))
                elif item[0] == "ndata":
                    clist = first_level_split(item[1],"\n")
                    content = "<br/>".join(clist)
                    t = bbcode_outerbreak(trim_outer_ws(item[1].replace("\n","<br/>")))
                elif item[0] == "pdata":
                    clist = first_level_split(item[1],"\n\n")
                    t = []
                    for l in clist:
                        cl = trim_outer_ws(l)
                        if len(cl) > 0:
                            t.append(("+p",cl))
                else:
                    if item[0][0] == '+' and item[0][1:] in all_bbc_tags:
                        t = all_bbc_tags[item[0][1:]](item)
                    else:
                        t = parse_error_handler(item)
                for i in t:
                    new_recursor.append(i)
        recursor = new_recursor[:]
    return final
