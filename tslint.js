module.exports = {
  "defaultSeverity": "error",
  "extends": [
      "tslint:recommended"
  ],
  "jsRules": {
  },
  "rules": {
    "indent": [true, "spaces", 2],
    "quotemark": [true, "single"],
    "object-literal-sort-keys": false,
    "variable-name": [ true,
      "allow-leading-underscore",
      "allow-pascal-case",
      "ban-keywords"
    ],
    "no-console": process.argv[2] === 'production' ? true : false,
  },
  "rulesDirectory": []
}