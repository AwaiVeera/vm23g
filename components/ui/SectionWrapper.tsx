import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';

import { colors } from '@/systems/theme/colors';

export type SectionAlign = 'center' | 'left';
export type SectionSpacing = 'small' | 'medium' | 'large';
export type SectionAsymmetry = 'left' | 'center' | 'right';

type SectionWrapperProps = PropsWithChildren<{
  align?: SectionAlign;
  asymmetry?: SectionAsymmetry;
  spacing?: SectionSpacing;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}>;

const MOBILE_BREAKPOINT = 768;

// Editorial inset for left/right-biased sections — desktop only.
// Collapses to 0 on mobile so content fills the full safe width.
const ASYMMETRY_OFFSET = 80;

// Desktop values preserve the existing luxury breathing room.
// Mobile values ensure usable viewport height on narrow screens.
const SPACING: Record<SectionSpacing, { mobile: number; desktop: number }> = {
  small:  { mobile: 48, desktop: 48  },
  medium: { mobile: 60, desktop: 88  },
  large:  { mobile: 80, desktop: 140 },
};

const MAX_WIDTH = {
  wide:   1120, // center-aligned sections
  narrow: 1040, // offset sections: left/right asymmetry and Hero align="left"
} as const;

export function SectionWrapper({
  children,
  align = 'center',
  asymmetry,
  spacing = 'medium',
  style,
  contentStyle,
}: SectionWrapperProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const verticalPad = isMobile ? SPACING[spacing].mobile : SPACING[spacing].desktop;

  // Offset sections (left/right asymmetry or explicit left alignment) use the
  // narrower max-width to reinforce the editorial bias on large screens.
  const isOffset = asymmetry === 'left' || asymmetry === 'right' || align === 'left';
  const maxWidth = isOffset ? MAX_WIDTH.narrow : MAX_WIDTH.wide;

  const offset = isMobile ? 0 : ASYMMETRY_OFFSET;

  let positionStyle: ViewStyle;
  if (asymmetry === 'left' || (!asymmetry && align === 'left')) {
    positionStyle = { alignSelf: 'flex-start', paddingRight: offset };
  } else if (asymmetry === 'right') {
    positionStyle = { alignSelf: 'flex-end', paddingLeft: offset };
  } else {
    positionStyle = { alignSelf: 'center' };
  }

  return (
    <View style={[styles.section, { paddingVertical: verticalPad }, style]}>
      <View style={[styles.content, { maxWidth }, positionStyle, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    paddingHorizontal: 28,
    backgroundColor: colors.background.base,
  },
  content: {
    width: '100%',
  },
});
