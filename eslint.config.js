const eslintPluginPrettier = require("eslint-plugin-prettier");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
	{
    plugins: {
      eslintPluginPrettier
    },
    files: ["packages/*/src/**/*.ts"],
		rules: {
			"prefer-const": "error"
		},
	},
]);