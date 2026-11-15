#!/bin/bash
# usage: mvdl.sh <target.png> ; moves newest ~/Downloads PNG only if <90 s old
t="$1"; f=$(ls -t ~/Downloads/*.png 2>/dev/null | head -1)
[ -z "$f" ] && { echo "NO PNG"; exit 1; }
age=$(( $(date +%s) - $(stat -f %m "$f") ))
[ $age -gt 90 ] && { echo "REFUSE: newest '$f' is ${age}s old"; exit 1; }
mv "$f" "$t" && python3 -c "from PIL import Image;im=Image.open('$t');print('moved',im.size,'age',$age)"
