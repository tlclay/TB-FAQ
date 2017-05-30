# TB-FAQ

![alt text](http://cache.toribash.com/www/Images/logo.jpg "TORIBASH")

## Step-by-step guide

### 1. Make a GitHub account if you don't have one

To use this site, you must be registered. Accounts are completely free.

### 2. Contact Fear in IRC or on the forum to become part of the FAQ Org here on GitHub

Find me wherever is most accessible to you. I'm online at least daily so I'll catch your message quickly enough. On here, my username is 'Novaras'.

### 3. Read up on GitHub workflow

To work with GitHub, understanding the workflow is essential. It's actually pretty simple and seamless once you get used to it.
1. Make a branch (this is like a copy of all the files we have here)
2. Make edits to files in your branch (will be commited to your branch when you save)
3. After you've made the edits you want to, make a Pull Request
4. When I get around to it, I'll review and then merge your changes into the master branch (the one that will be used for the live faq.php items) if I'm happy with them

You can read a much clearer and more in-depth tutorial [here](https://guides.github.com/activities/hello-world/#branch).

### 4. Making items for the faq

This is mostly covered in the stickied thread in HS HQ. You'll want to use **[item_template.html](https://github.com/TB-FAQ/TB-FAQ/blob/master/FAQ%20Items/item_template.html)** as your base when making a new item since it has the minimum required markup and styling. Common/useful scripts can be found in the [js folder](https://github.com/TB-FAQ/TB-FAQ/tree/master/js).

**Make sure not to edit anything outside of the area's I specify inside the file - these changes cannot and will not be implemented into the live site. Everything outside the marked areas is just there as a framework so you can work in an accurate environment.**

Refer to **[clan_staff.html](https://github.com/TB-FAQ/TB-FAQ/blob/master/FAQ%20Items/Clans/clan_staff.html)** for an example of the template with content added in.

#### MAKE SURE TO READ THE [CODING STANDARDS](https://github.com/TB-FAQ/TB-FAQ/blob/master/CODING%20STANDARDS.MD)

### 4.1. Making folders here

If there isn't a folder for the section you want to write for (i.e, Market), simply make your file as normal. **When you name the file, name it as `FAQ Items/Market/<file_name>.html` and GitHub will create the folder for you.**
