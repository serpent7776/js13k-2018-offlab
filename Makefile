.PHONY: zip

zip:
	cat ga/ga.js ga/ga.js ga/plugins.js game.js > /tmp/out.js
	closure-compiler --language_in=ECMASCRIPT5 --js /tmp/out.js --js_output_file /tmp/out.min.js
	gzip -f9 /tmp/out.min.js
