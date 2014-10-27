#!/bin/bash

cd w
rm *.html
make
cd ..

python extractMusings.py
python styleMusings.py

cat musingsStart.stub musingsMiddle.stub musingsEnd.stub > musings.html