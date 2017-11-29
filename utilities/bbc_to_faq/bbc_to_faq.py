## suomy's simple FAQ markup language
## this program is designed to convert a BBcode like syntax into a valid FAQ item
## it is heavily based on the BBcode of forum.toribash.com
## designed for the TB-FAQ project

from bbcode_parser import process_bbcode, trim_outer_ws, first_level_split

def process_qa(title,text):
    final = '<p class="faq_question"><span class="faq_q">Q:</span> ' + title + '</p>\n'
    final+= '<div class="faq_answer"><span class="faq_a">A:</span> '
    first = True
    for line in text.split("\n"):
        if first:
            first = False
        else:
            final += "\t"
        final += line + "\n"
    final += '</div>\n'
    return final

def process_p(text):
    final = '<p>\n'
    for line in text.split("\n"):
        final += "\t" + line + "\n"
    final += "</p>\n"
    return final

def generate_min_html(t):
    text = t
    text = text.replace("\r\n","\n") ## convert Windows to Unix line endings
    text = text.replace("\r","\n") ## convert Mac to Unix line endings

    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")

    ## initial pass, find QA blocks (or paragraphs, if no QA-blocks)
    i = 0
    l = len(text)
    blocks = []
    while i < l:
        if text[i] == "Q":
            if i + 2 <= l and text[i:i+2] == "Q:":
                qstart = i
                astart = i+2
                afound = False
                while astart < l-2:
                    if text[astart:astart+3] == "\nA:":
                        afound = True
                        break
                    astart += 1
                if afound:
                    qdat = trim_outer_ws(text[qstart+2:astart])
                    nextqfound = False
                    aend = astart + 2
                    while aend < l:
                        if aend+3 <= l and text[aend:aend+3] == "\nQ:":
                            nextqfound = True
                            break
                        aend += 1
                    adat = trim_outer_ws(text[astart+3:aend])
                    blocks.append(('qa',qdat,adat))

                    i = aend + 1                        
                    continue
                else:
                    blocks.append(('p',trim_outer_ws(text[qstart:])))
        elif text[i] in " \n\t":
            i += 1
            continue
        else:
            pstart = i
            pend = i+1
            while pend < l:
                if pend+2 <= l and text[pend:pend+2] == "\n\n":
                    break
                pend += 1
            blocks.append(('p',trim_outer_ws(text[pstart:pend])))
            i = pend
        i += 1


    final = ""
    for item in blocks:
        if item[0] == 'qa':
            final += process_qa(process_bbcode("data",item[1]),process_bbcode("pdata",item[2]))
        elif item[0] == 'p':
            final += process_p(process_bbcode("data",item[1]))
        else:
            print("Unknown data block encountered in process_min_html: " + str(item))
    
    return final

def generate_html(title,text):
    final = '<!DOCTYPE html>\n<html><head><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>'
    final += '<script src="https://tb-faq.github.io/TB-FAQ/min.js"></script>'
    final += '<link rel="stylesheet" type="text/css" href="https://tb-faq.github.io/TB-FAQ/min.css">'
    final += '</head><body><table class="tborder" cellpadding="6" cellspacing="1" border="0" width="100%" align="center">\n'
    final += '<tr>\n\t<td class="tcat">'+title+'</td>\n</tr>\n'
    final += '<tr>\n\t<td class="alt1">\n'
    flist = []
    for line in generate_min_html(text).split("\n"):
        flist.append("\t" + line)
    final += "\n".join(flist)
    final += "\n</td></tr></table></body></html>"
    return final

def make_html_from_file(ifn,ofn):
    with open(ifn,"rb") as file:
        intext = file.read().decode("utf-8")
    title = ifn.split(".")[0]
    outtext = generate_html(title,intext)
    with open(ofn,"wb") as file:
        file.write(outtext.encode("utf-8"))
