<?php
spl_autoload_register(function($class){
	if (0 !== strpos($class, 'CS_')) {
		return;
	}
	
	$path = dirname(__FILE__).'/'.strtolower(str_replace('CS_REST','csrest',$class)).'.php';

	if (!file_exists($path)) {
		return;
	}

	require_once $path;	
});