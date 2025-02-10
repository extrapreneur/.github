// commitlint.config.cjs

module.exports = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ["#"],
    },
  },
  rules: {
    "subject-case": [2, "always", ["lower-case"]],
    "body-max-line-length": [2, "always", 256],
  },
};
