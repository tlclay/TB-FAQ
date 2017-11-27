from tbfaq_config import gitdir,tgtdir
import os
from html.parser import HTMLParser
from css_html_js_minify import js_minify, css_minify

## This script is Windows specific.
## I don't have a Linux system set up for testing.
## If you want to generalize it, you're on your own for now.
## ~suomy

TAB_SPACE = "    "
TAB_LENGTH = len(TAB_SPACE)

faqitems = dict() ## A dictionary of faq item tags to cleaned faq item HTML files.

def isnotWS(s):
    l = len(s)
    i = 0
    while i < l:
        if not s[i] in " \t\n":
            return True
        i+=1
    return False

singleton_tags = {"hr","img","input"} # tags which can exist on their own without internal data.

class faqparser(HTMLParser):
    cf = ""
    titlenext = False
    title = ""
    scriptnext = False
    script = ""
    sfound = False
    scount = 1
    
    lasttag = ""
    lastattr = []
    datasince = False
    droparrowsadded = 0

    def handle_starttag(self, tag, attrs):
        self.lasttag = tag
        self.lastattr = attrs
        self.datasince = False

        if tag == 'td':
            self.datasince = True ## Assume that empty columns are okay.

        duplicate_attr = False
        attrset = set()
        for k,v in attrs:
            if not k in attrset:
                attrset.add(k)
            else:
                print(" -!-: faqparser: duplicate HTML attribute found in <" + tag + ">.")
        del attrset

        if self.sfound:
            newdat = '<'+tag
            if (len(attrs) > 0):
                for k,v in attrs:
                    if v:
                        newdat += ' ' + k + '="' + v + '"'
                    else:
                        newdat += ' ' + k
            newdat += '>'
            if tag == 'td':
                self.scount += 1
            self.cf += newdat
        elif ('class','tcat') in attrs:
            self.titlenext = True
        elif ('class','alt1') in attrs:
            self.sfound = True
        elif not self.sfound and self.scount == 0:
            if tag == "script":
                self.scriptnext = True
                

    def handle_endtag(self, tag):
        if self.sfound:
            if tag == 'td':
                self.scount -= 1
                if self.scount == 0:
                    self.sfound = False
                    return
            if tag == 'br':
                return
            newdat = '</' + tag + '>'
            if tag == self.lasttag and not (tag in singleton_tags):
                if tag == 'span':
                    if ('class', 'drop_arrow_bbc') in self.lastattr:
                        if not self.datasince:
                            self.droparrowsadded += 1
                            self.cf += "►"
                elif not self.datasince:
                    print(" -?- faqparser: <" + tag + "> discarded")
                    i = len(self.cf)-1
                    while self.cf[i] != '<':
                        i -= 1
                    self.cf = self.cf[0:i]
                    return
            self.cf += newdat

    def handle_data(self, data):
        if isnotWS(data):
            self.datasince = True
        if self.sfound:
            if self.lasttag == "style" and isnotWS(data):
                print(" -?- faqparser: non-empty <style> found in main body.")
            newdat = data
            l = len(newdat)
            self.cf += newdat
        elif self.titlenext:
            self.title = data
            self.titlenext = False
        elif self.scriptnext:
            self.scriptnext = False
            if isnotWS(data):
                self.script = data
                print(" -!- faqparser: non-empty <script> found. This is [DEPRECATED].")

def clean_file(ifname):
    with open(ifname,"rb") as file:
        fcontents = file.read()
    fp = faqparser()
    fp.feed(fcontents.decode("utf-8"))
    cleanstr = fp.cf

    if fp.sfound:
        print(" -!- faqparser: sfound is still on -- this file DID NOT parse correctly.")

    if fp.droparrowsadded > 0:
        print(" -?- faqparser: " + str(fp.droparrowsadded) + " drop arrow(s) were added.")

    ## Delete blank lines.
    newstr = []
    for line in cleanstr.split('\n'):
        if isnotWS(line):
            newstr.append(line)

    ## Determine common WS at front:
    minws = len(cleanstr)
    tmpstr = []
    for line in newstr:
        l = len(line)
        i = 0
        c = 0
        while (i < l):
            if line[i] == ' ':
                c += 1
            elif line[i] == '\t':
                c += TAB_LENGTH
            else:
                break
            i+=1

        if c < minws:
            minws = c
        s = ""
        nt = int(c/TAB_LENGTH)
        ns = c%TAB_LENGTH

        for x in range(nt):
            s += "\t"
        for x in range(ns):
            s += " "
        tmpstr.append(s + line[i:])

    
    del newstr[:]
    i = int(minws/TAB_LENGTH) + (minws%TAB_LENGTH)
    for line in tmpstr:
        newstr.append(line[i:])
    
    cleanstr = '\n'.join(newstr)

    if cleanstr[0] in ' \t':
        print(" -!- clean_file: First line is not indent level 0.")
    
    ret = (fp.title,cleanstr)
    del fp
    return ret

def clean_html():
    for root, dirs, files in os.walk(gitdir):
        path_parts = root.split("\\") ## This is Windows specific.
        gitpath = '/'.join(path_parts)
        path_parts[0] = tgtdir
        tgtpath = '/'.join(path_parts)
    
        if(not os.path.exists(tgtpath)):
            os.mkdir(tgtpath)
        
        for f in files:
            ## Some items have been deprecated, let's ignore them.
            if "[DEPRECATED]" in f:
                continue
            ## Ignore item_template.html
            if f == "item_template.html":
                continue
            fname = f.split('.')
            if len(fname) != 2:
                continue
            if fname[1] != "html":
                continue
            print("Cleaning: " + gitpath + "/" + f)
            cleaned = clean_file(gitpath + "/" + f)
            newtitle = fname[0] + "." + cleaned[0]
            with open(tgtpath + "/" + newtitle, "wb") as of:
                of.write(cleaned[1].encode("utf-8"))
                print(' --> "' + tgtpath + "/" + newtitle + '" saved.')

            if fname[0] in faqitems:
                faqitems[fname[0]].add(tgtpath+"/"+newtitle)
            else:
                faqitems[fname[0]] = {tgtpath+"/"+newtitle}

    for k,v in faqitems.items():
        if len(v) > 1:
            print(" -!- clean_html: FAQ tag `" + k + "` is used multiple times:")
            for f in v:
                print("               : --> " + f)
            print("               : This cannot be implemented on live!")

def clean_js():
    if not os.path.exists(gitdir + "/../js"):
        print (" -!- clean_js: JavaScript directory not found.")
    alljs = ""
    for root, dirs, files in os.walk(gitdir + "/../js"):
        for f in files:
            if f == "include_all.js":
                continue ## This one is unnecessary in the final version, since min.js won't require any additional includes.
            fname = f.split('.')
            if fname[len(fname)-1] == "js" and fname[len(fname)-2] != "min":
                with open(root + "/" + f, "rb") as ijs:
                    alljs += ijs.read().decode()
                    alljs += "\n"
    minjs = js_minify(alljs)
    with open(tgtdir + "/min.js","wb") as ojs:
        ojs.write(minjs.encode())

def clean_css():
    if not os.path.exists(gitdir + "/../css"):
        print (" -!- clean_css: JavaScript directory not found.")
    allcss = ""
    for root, dirs, files in os.walk(gitdir + "/../css"):
        for f in files:
            fname = f.split('.')
            if fname[len(fname)-1] == "css" and fname[len(fname)-2] != "min":
                with open(root + "/" + f, "rb") as icss:
                    allcss += icss.read().decode()
                    allcss += "\n"
    mincss = css_minify(allcss)
    with open(tgtdir + "/min.css","wb") as ocss:
        ocss.write(mincss.encode())

def clean_all():
    clean_js()
    clean_css()
    clean_html()
