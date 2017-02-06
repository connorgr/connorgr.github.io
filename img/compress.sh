#!/bin/bash

# NOTE meant to be called with `make img` from project root
# sh compress.sh img
# can also call locally via sh compress.sh
if [ $# -gt 0 ]
then
  PREFIX=$1/
else
  PREFIX=""
fi

rm $PREFIX*.min.svg
for f in $PREFIX*.svg
do
  svgo $f "$PREFIX`basename "$f" .svg`.min.svg"
done

pngquant -- $PREFIX*.png
