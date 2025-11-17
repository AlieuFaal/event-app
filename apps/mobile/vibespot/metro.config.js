const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
 
const config = getDefaultConfig(__dirname);

// Workspace root
const workspaceRoot = path.resolve(__dirname, '../../..');
const packagesPath = path.resolve(workspaceRoot, 'packages');

// Enable package exports
config.resolver.unstable_enablePackageExports = true;

// Add workspace packages to watchFolders
config.watchFolders = [
  workspaceRoot,
  path.resolve(packagesPath, 'validation'),
  path.resolve(packagesPath, 'database'),
];

// Resolve node_modules ONLY from workspace root to prevent duplicates
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, 'node_modules'),
];

// Block duplicate packages - force resolution to workspace root
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force React and React Native to resolve from root only
  if (moduleName === 'react' || moduleName === 'react-native' || moduleName.startsWith('react/') || moduleName.startsWith('react-native/')) {
    return context.resolveRequest(
      {
        ...context,
        resolveRequest: null,
      },
      moduleName,
      platform
    );
  }
  
  // Let Metro handle other modules normally
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
