all: jstest.js

jsobjects.js: objects.js
	sh jsgen.sh $^ > $@

jstest.js: compat.js overlays.js objects.js test.js
	sh jsgen.sh $^ > $@

clean:
	rm -f js*.js


upload: jstest.js
	rsync --exclude .git --exclude .*.swp -vaP . alameda:raisama.net/maps/jslib/
