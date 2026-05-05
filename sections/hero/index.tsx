import { SharedValue } from 'react-native-reanimated';
import { Hero } from './Hero';

type HeroSectionProps = {
  scrollY: SharedValue<number>;
};

export function HeroSection({ scrollY }: HeroSectionProps) {
  return <Hero scrollY={scrollY} />;
}
