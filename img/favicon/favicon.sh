#!/bin/bash

pngquant -- favicon.png
convert favicon-fs8.png -bordercolor white -border 0 \
      \( -clone 0 -resize 16x16 \) \
      \( -clone 0 -resize 128x128 \) \
      -delete 0 -alpha on -colors 256 favicon.ico
