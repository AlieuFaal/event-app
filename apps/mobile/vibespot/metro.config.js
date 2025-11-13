const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
 
const config = getDefaultConfig(__dirname);

// Enable package exports
config.resolver.unstable_enablePackageExports = true;

// Add workspace packages to watchFolders
const workspaceRoot = path.resolve(__dirname, '../../..');
const packagesPath = path.resolve(workspaceRoot, 'packages');

config.watchFolders = [
  workspaceRoot,
  path.resolve(packagesPath, 'validation'),
];

// Resolve node_modules from workspace root and app directory
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });