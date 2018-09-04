.PHONY: zip

zip:
	cat ga/ga.js ga/plugins.js game.js > /tmp/out.js
	closure-compiler --language_in=ECMASCRIPT5 --js /tmp/out.js --js_output_file /tmp/out.min.js
	zip -9 -r /tmp/js13k-2018-offline.zip index.html /tmp/out.min.js ./*.png
