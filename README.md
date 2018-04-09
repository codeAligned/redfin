Redfin food truck

Introduction

1 This project create a CLI "show-open-food-trucks" which prints out a list of food trucks that are open for today.

2 I use "commander" library, so user can specify page number, note page number is optional
for example, both of these input are valid.
$ show-open-food-trucks           // without any page number
$ show-open-food-trucks -i 5     //show data on page 5
you can use " $ show-open-food-trucks --help " to see manual.

3 I use redis as server side cache so we do not need to load the same data again.

Installation
1 run " git clone https://github.com/jzy521/redfin.git "
2 run  " tar -xvzf redis-stable.tar.gz " to unzip file
3 run " cd  redis-stable/src "
4 run "  redis-server " to start redis server
5 open another terminal, then go back to main folder which contains packpage.json.
6 run " npm install "
7 run " sudo npm install -g " to install show-open-food-trucks
8 run " show-open-food-trucks " or " show-open-food-trucks  -i   3 " // 3 is page num

optional : 9 use " sudo npm uninstall -g foodtruck " if you want to uninstall later.


