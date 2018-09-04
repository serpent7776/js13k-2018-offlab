.PHONY: zip

zip:
	mkdir -p build
	cat ga.js game.js > build/game.js
	closure-compiler --language_in=ECMASCRIPT5 --js build/game.js --js_output_file build/game.min.js
	cp index.html ./*.png build/
	cd build && zip -9 -r js13k-2018-offline.zip index.html game.min.js ./*.png
