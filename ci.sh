#!/bin/bash
git submodule update --init
composer install
./server.sh runtests
