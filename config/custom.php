<?php

$globalTransforms = $transformsToEagerLoad = [
	'ogImg' => [[ 'mode' =>'crop', 'width' => 1200, 'height' => 1200 ]],
	'halfWidth' => [
		['width' => 200],
		['width' => 400],
		['width' => 600],
		['width' => 800],
		['width' => 1000],
		['width' => 1200]
	],
	'fullWidth' => [
		['width' => 400],
		['width' => 800],
		['width' => 1200],
		['width' => 1600],
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
	'cardTransforms' =>[
		['width' =>576],
		['width' =>888]
	]
];

foreach ($transformsToEagerLoad as &$transformArray) {
	foreach ($transformArray as &$transform) {
		$transform += ['format' => 'webp'];
	}
}

$transformsToEagerLoad = array_merge_recursive($globalTransforms, $transformsToEagerLoad);

return [
	'globalTransforms' => $globalTransforms,
	'transformsToEagerLoad' => $transformsToEagerLoad
];