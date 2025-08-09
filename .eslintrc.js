// src/templates/.eslintrc.js
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['fs-web-rules'],
	rules: {
		'fs-web-rules/no-direct-http': 'error',
	},
};