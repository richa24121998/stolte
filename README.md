# STOLTE WEBSITE


## Local Craft CMS setup:

* Clone from bitbucket - use "master" branch for this update
* You will need to point to your local LAMP environment.  PHP 8.1 please.  Mysql 5.X
* Setup local MYSQL db.  Import database .sql export from _setup_files into your DB server
* Copy CMS files.  CMS files (web/assets/cms) are not in the repo.  So copy _setup_files/web/assets/cms to the web/asset/cms folder
* Run composer install.  Use composer 2.x
* Point local php 8.1 apache instance to "web"
* update your .env file with your local db settings.  


## CSS/JS Compiling
* go to __node and run grunt off node 14.x ("node n" lets you switch local node versions easily https://github.com/tj/n )
* Sources files are in __source.  You can mostly ignore "stick.engine" folder and edit JS and SCSS in stick.site
* I have a more modern webpack way of doing it now - this is slightly old school and could be better.  But it works fine enough, ish ) 


## HTML
All HTML is in templates.  It uses .twig style of craft cms queries

## CMS PASSWORD
Once set up, you can log in a /admin
user:admin
pass: sdfDFG34ssdfg@^dsfd
