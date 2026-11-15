#!/bin/bash
# usage: ex.sh ID : age-checked move of newest Downloads PNG to art/extras/raw/ID.png + 400px thumb at /tmp-free path tools/ex-t.png
D=$(cd "$(dirname "$0")" && pwd)
A=/Users/vivek/law-tome/books/true-or-folklore/art
$D/mvdl.sh $A/extras/raw/$1.png || exit 1
python3 -c "
from PIL import Image; im=Image.open('$A/extras/raw/$1.png'); im.thumbnail((400,400)); im.save('$D/ex-t.png')"
