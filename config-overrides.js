const { useBabelRc, override } = require("customize-cra");
const { alias, aliasJest, configPaths } = require("react-app-rewire-alias");

const aliasMap = configPaths("./tsconfig.paths.json");

// eslint-disable-next-line react-hooks/rules-of-hooks
module.exports = override(useBabelRc(), alias(aliasMap));

module.exports.jest = override(aliasJest(aliasMap));
