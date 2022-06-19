module.exports = {
	// parser: 'eslint',
	// plugins: ['eslint'],
	extends: ['airbnb-base', 'prettier'],
	parserOptions: {
	  ecmaVersion: 6,
	  sourceType: 'module',
	},
	env: { jest: true, browser: true, node: true },
	rules: {
	  'no-console': 'off',
	  // Added to fix `aws-sdk` being in devDeps instead of Deps (in order to avoid including it in the pkgs)
	  "import/no-extraneous-dependencies": [
	    "error",
	    { "devDependencies": true }
	  ],
	  // Fix problem that causes eslint to request that all importsinclude the extension, thus breaking them
	  'import/extensions': [
	    'error',
	    'ignorePackages',
	    {
	      ts: 'never',
	    },
	  ],
	  // Replace eslint's 'no-unused-vars' rule for tslint's one
	//   "@typescript-eslint/no-unused-vars-experimental": "error",
	  "no-unused-vars": "off",
	  // Disable rule. Rationale: awaits in loops are useful when used to re-try an operation till it works
	  "no-await-in-loop": "off",
	  // Disable rule. Rationale: code is much more readable when this rule is not enabled
	  "prefer-destructuring": "off",
	  // Rationale: Want to use 'new InternalError()' to report errors to sentry
	  "no-new": "off",
	},
	overrides: [
	  {
	    // Remove rule that disables "for of" loops in test files. Rationale: it doesnt matter if the generated code is large there as it never gets shipped to production
	    files: ["*.test.js", "*/__mocks__/*"],
	    rules: {
	      "no-restricted-syntax": "off",
	      "no-irregular-whitespace": "off"
	    }
	  }
	],
	settings: {
	  'import/resolver': {
	    node: {
	      paths: ['src'],
	      extensions: ['.js', '.ts'],
	    },
	  },
	},
      };