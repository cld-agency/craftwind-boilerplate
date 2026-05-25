<?php

$globalTransforms = $transformsToEagerLoad = [
	'ogImg' => [[ 'mode' =>'crop', 'width' => 1200, 'height' => 630 ]],
	'halfWidth' => [
		['width' => 280],
		['width' => 400],
		['width' => 600],
		// ['width' => 800],
		['width' => 1000],
		['width' => 1200]
	],
	'fullWidth' => [
		['width' => 580],
		['width' => 800],
		['width' => 1200],
		// ['width' => 1600],
		['width' => 1920],
		['width' => 2200]
	],
	'fullWidthContained' => [
		['width' => 400],
		['width' => 800],
		['width' => 1200],
		['width' => 1600],
		['width' => 1824]
	],
	'longformBodyImageFull' => [
		['width' => 500],
		['width' => 900],
		['width' => 1200],
		['width' => 1600]
	],
	'longformBodyImageHalf' => [
		['width' => 400],
		['width' => 642]
	],
	'longformBodyImageThirds' => [
		['width' => 250],
		['width' => 444]
	],
	'cardTransforms' =>[
		['width' =>576],
		['width' =>888]
	]
];

// add webp and avif transforms for each of the above keys
$expanded = [];
foreach ($transformsToEagerLoad as $key => $transformArray) {
	$expanded[$key] = [];
	foreach ($transformArray as $transform) {
		$expanded[$key][] = $transform;
		$expanded[$key][] = $transform + ['format' => 'webp'];
		$expanded[$key][] = $transform + ['format' => 'avif'];
	}
}

$transformsToEagerLoad = $expanded;

return [
	'globalTransforms' => $globalTransforms,
	'transformsToEagerLoad' => $transformsToEagerLoad
];