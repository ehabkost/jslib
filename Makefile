all: jstest.js

#XXX: using jsgen.sh is useful for simple pages, but for more complex
# projects, it won't work because some files may get included twice

jsobjects.js: compat.js overlays.js objects.js
	sh jsgen.sh $^ > $@

jstest.js: compat.js overlays.js objects.js test.js
	sh jsgen.sh $^ > $@

clean:
	rm -f js*.js


upload: jstest.js
	rsync --exclude .git --exclude .*.swp -vaP . alameda:raisama.net/maps/jslib/
