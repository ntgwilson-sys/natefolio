# natekidd.com

your portfolio as a small blog. github pages builds it on its own every time something changes.

## getting it live

1. the repo name in `admin/config.yml` is already set to ntgwilson-sys/natefolio
2. upload everything in this folder to that repo (keep the folders as they are). if the repo already has a file called `CNAME`, leave it there, that's what points natekidd.com at the site
3. delete the old `index.html` if it's still there, this folder has a new one
4. in the repo go to settings, then pages, and check it's building from the `main` branch
5. give it a minute or two, then load the site

## logging in to the admin panel

the panel is at natekidd.com/admin (there's also a link at the bottom of every page).

it logs in with a github token, so nobody can get in without one:

1. on github go to settings, developer settings, personal access tokens, fine grained tokens, generate new token
2. repository access: only select repositories, then pick your site's repo
3. permissions: contents, read and write
4. set it to expire in a year, generate it, and copy it somewhere safe like your password manager
5. on the admin page press **sign in using access token** and paste it in

ignore the "sign in with github" button, that one needs extra setup and isn't switched on.

only log in on your own devices, the token gets saved in that browser.

## using it

- **work** is all your posts. press new to add one: title, date, a one line description, a status if it's still going, a cover image, more images and a write up
- tick **show as a highlight on the homepage** and set a position from 1 to 5 to put it on the front page. only the top five show. if nothing's ticked, the five newest posts show instead
- **site details** is the blurb under your name, your titles, the bottom left text, your email and your links
- hit publish and the site updates in about a minute

every post gets its own page at natekidd.com/work/post-name, and natekidd.com/work lists everything.
