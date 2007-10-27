echo "// DO NOT EDIT"
echo "// File generated from $*"
echo
for f;do
	echo "// BEGIN $f"
	cat "$f"
	echo "// END $f"
done
