.PHONY: sass

sass:
	sass css/main.scss css/main.css
	sass css/main.scss css/main.min.css --style compressed
	sass css2/main.scss css2/main.css
	sass css2/main.scss css2/main.min.css --style compressed

img:
	sh img/compress.sh img
	sh img/compress.sh img/projects
