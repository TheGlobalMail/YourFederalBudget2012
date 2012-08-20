.PHONY: dev test

dev:
	php -S 0.0.0.0:5000 -t web/ web/index_dev.php

test:
	php -S 0.0.0.0:5000 -t ./ tests/index.php