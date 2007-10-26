all: jstest.js

jsobjects.js: objects.js
	cat $^ > $@

jstest.js: jsobjects.js test.js
	cat $^ > $@

clean:
	rm -f js*.js


upload: jstest.js
	rsync --exclude .git --exclude .*.swp -vaP . alameda:raisama.net/maps/jslib/
