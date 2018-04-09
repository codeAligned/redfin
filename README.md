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

1 unzip 'redis-stable.tar.gz'
