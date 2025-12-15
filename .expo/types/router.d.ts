/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/calendar` | `/(tabs)/map` | `/(tabs)/profile` | `/(tabs)/stats` | `/_sitemap` | `/calendar` | `/forgot-password` | `/login` | `/map` | `/password-changed` | `/profile` | `/reset-password` | `/stats` | `/verify-code`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
