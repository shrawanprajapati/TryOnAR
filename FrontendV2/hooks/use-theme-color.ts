/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { theme, accent, isDark } = useTheme();
  const mode = isDark ? 'dark' : 'light';
  const colorFromProps = props[mode];

  const palette = {
    text: theme.text,
    background: theme.background,
    tint: accent,
    icon: theme.subText,
    tabIconDefault: theme.subText,
    tabIconSelected: accent,
  };

  return colorFromProps ?? palette[colorName];
}
