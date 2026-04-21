export * from 'react-native-web';

export const TurboModuleRegistry = {
  get: () => null,
};

export const LogBox = {
  ignoreLogs: () => {},
  ignoreAllLogs: () => {},
};

export const findNodeHandle = () => null;

import * as RNWeb from 'react-native-web';

export default {
  ...RNWeb,
  TurboModuleRegistry,
  LogBox,
  findNodeHandle,
};
