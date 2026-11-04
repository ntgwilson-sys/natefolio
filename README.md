# natefolio

your portfolio as a small blog. github pages rebuilds it by itself every time something changes, usually within a minute or two.

## putting it on github

1. upload everything in this folder to the top level of the natefolio repo, not inside another folder
2. in the repo go to settings, then pages, and check it's set to deploy from `main` and `/ (root)`
3. wait for the green tick in the actions tab, then load the site

## where it lives

`_config.yml` has a line called `baseurl`.

- on ntgwilson-sys.github.io/natefolio it needs to be `"/natefolio"` (that's what it's set to now)
- if you move it to natekidd.com, change it to `""`

## the admin panel

it's at the `/admin` page, and there's a link at the bottom of every page.

log in with **sign in using access token**. the token is a fine grained github token with access to only the natefolio repo, and one permission: contents, read and write. ignore the "sign in with github" button.

only log in on your own devices, the token gets saved in that browser.

## using it

- **work** is all your posts. press new to add one: title, date, a one line description, a status, a cover image, more images, files and media, and a write up
- tick **show as a highlight on the homepage** and give it a position from 1 to 5 to put it in the numbered list on the front page. if nothing's ticked, the five newest posts show instead
- **files and media** takes anything. mp3s and videos get their own players, pdfs open up, anything else downloads. or add a youtube, vimeo or soundcloud link, or paste an embed code from bandcamp or spotify. uploads are capped at 25mb, so put long videos on youtube or vimeo
- photos get shrunk automatically when you add them
- **site details** is the blurb under your name, your titles, the bottom left text, your email and your links

## how a post page works

writing on the left, and a board of everything on the right (photos, videos, tracks, pdfs, embeds), each scrolling on its own. click anything on the board to open it big, and use the arrows to flick through. on phones it all goes into one column.
