import React, { useEffect, useRef } from 'react';
import { Platform, View, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native';
import { useDesignMode } from '@/context/DesignModeContext';

const STYLE_ID = 'martfury-ambient-engine-style';
const LAYER_ID = 'martfury-ambient-engine-layer';

const AMBIENT_CSS = `
@keyframes mfSmokeFlow1 {
  0%   { transform: translate3d(-6%, -4%, 0) scale(1) rotate(-8deg); }
  50%  { transform: translate3d(8%, 6%, 0) scale(1.16) rotate(6deg); }
  100% { transform: translate3d(-6%, -4%, 0) scale(1) rotate(-8deg); }
}

@keyframes mfSmokeFlow2 {
  0%   { transform: translate3d(8%, 5%, 0) scale(1.06) rotate(10deg); }
  50%  { transform: translate3d(-8%, -6%, 0) scale(1.2) rotate(-6deg); }
  100% { transform: translate3d(8%, 5%, 0) scale(1.06) rotate(10deg); }
}

@keyframes mfPulseAura {
  0%, 100% { opacity: 0.45; transform: scale(0.96); }
  50%      { opacity: 0.95; transform: scale(1.12); }
}

@keyframes mfEmberFloat {
  0% {
    transform: translate3d(0, 0, 0) scale(0.7);
    opacity: 0;
  }
  12% {
    opacity: 1;
  }
  80% {
    opacity: 0.9;
  }
  100% {
    transform: translate3d(var(--drift, 28px), -105vh, 0) scale(1.3);
    opacity: 0;
  }
}

#${LAYER_ID} {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 9998;
}

#${LAYER_ID} .mf-smoke-1 {
  position: absolute;
  top: 4%;
  left: -8%;
  width: 65vw;
  height: 55vh;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(225, 29, 72, 0.34) 0%, rgba(190, 18, 60, 0.14) 45%, transparent 72%);
  filter: blur(44px);
  animation: mfSmokeFlow1 11s ease-in-out infinite;
}

#${LAYER_ID} .mf-smoke-2 {
  position: absolute;
  bottom: 4%;
  right: -8%;
  width: 68vw;
  height: 58vh;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 30, 66, 0.30) 0%, rgba(159, 18, 57, 0.12) 48%, transparent 74%);
  filter: blur(50px);
  animation: mfSmokeFlow2 14s ease-in-out infinite;
}

#${LAYER_ID} .mf-pulse {
  position: absolute;
  top: 18%;
  left: 20%;
  width: 60vw;
  height: 60vh;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(225, 29, 72, 0.24) 0%, transparent 70%);
  filter: blur(54px);
  animation: mfPulseAura 5.5s ease-in-out infinite;
}

#${LAYER_ID} .mf-ember {
  position: absolute;
  bottom: 58px;
  border-radius: 50%;
  background: #FF4D79;
  box-shadow: 0 0 14px 4px rgba(255, 30, 66, 0.95), 0 0 28px 8px rgba(225, 29, 72, 0.55);
  animation-name: mfEmberFloat;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

#${LAYER_ID}.is-glass .mf-smoke-1 {
  background: radial-gradient(circle, rgba(251, 191, 36, 0.26) 0%, transparent 70%);
}

#${LAYER_ID}.is-glass .mf-smoke-2 {
  background: radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, transparent 70%);
}

#${LAYER_ID}.is-glass .mf-pulse,
#${LAYER_ID}.is-glass .mf-ember {
  display: none;
}
`;

const EMBERS = [
  { left: '5%', leftPct: 0.05, size: 6, dur: '6.2s', durMs: 6200, delay: '0s', delayMs: 0, drift: '32px', driftNum: 24 },
  { left: '12%', leftPct: 0.12, size: 8, dur: '7.8s', durMs: 7800, delay: '0.9s', delayMs: 900, drift: '-26px', driftNum: -20 },
  { left: '19%', leftPct: 0.19, size: 5, dur: '5.6s', durMs: 5600, delay: '1.7s', delayMs: 1700, drift: '24px', driftNum: 18 },
  { left: '27%', leftPct: 0.27, size: 7, dur: '7.1s', durMs: 7100, delay: '0.4s', delayMs: 400, drift: '-34px', driftNum: -26 },
  { left: '35%', leftPct: 0.35, size: 6, dur: '6.6s', durMs: 6600, delay: '2.2s', delayMs: 2200, drift: '28px', driftNum: 22 },
  { left: '43%', leftPct: 0.43, size: 9, dur: '8.3s', durMs: 8300, delay: '0.2s', delayMs: 200, drift: '-30px', driftNum: -24 },
  { left: '51%', leftPct: 0.51, size: 5, dur: '5.9s', durMs: 5900, delay: '1.3s', delayMs: 1300, drift: '36px', driftNum: 28 },
  { left: '59%', leftPct: 0.59, size: 8, dur: '7.5s', durMs: 7500, delay: '2.6s', delayMs: 2600, drift: '-24px', driftNum: -18 },
  { left: '67%', leftPct: 0.67, size: 6, dur: '6.4s', durMs: 6400, delay: '0.8s', delayMs: 800, drift: '30px', driftNum: 22 },
  { left: '75%', leftPct: 0.75, size: 7, dur: '7.9s', durMs: 7900, delay: '1.9s', delayMs: 1900, drift: '-32px', driftNum: -24 },
  { left: '83%', leftPct: 0.83, size: 5, dur: '5.8s', durMs: 5800, delay: '0.5s', delayMs: 500, drift: '22px', driftNum: 16 },
  { left: '90%', leftPct: 0.90, size: 8, dur: '7.2s', durMs: 7200, delay: '1.5s', delayMs: 1500, drift: '-26px', driftNum: -20 },
  { left: '96%', leftPct: 0.96, size: 6, dur: '6.1s', durMs: 6100, delay: '0.3s', delayMs: 300, drift: '20px', driftNum: 14 },
];

function NativeEmber({ ember, screenWidth, screenHeight }: { ember: (typeof EMBERS)[number]; screenWidth: number; screenHeight: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(ember.delayMs),
        Animated.timing(progress, {
          toValue: 1,
          duration: ember.durMs,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [ember.delayMs, ember.durMs, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(screenHeight * 0.92)],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, ember.driftNum * 0.6, ember.driftNum],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.12, 0.8, 1],
    outputRange: [0, 0.95, 0.85, 0],
  });

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1.3],
  });

  return (
    <Animated.View
      style={[
        nativeStyles.ember,
        {
          left: ember.leftPct * screenWidth,
          width: ember.size,
          height: ember.size,
          borderRadius: ember.size / 2,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    />
  );
}

function NativeAmbientOverlay({ isCrimson }: { isCrimson: boolean }) {
  const { width, height } = useWindowDimensions();
  const auraPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(auraPulse, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(auraPulse, {
          toValue: 0,
          duration: 4200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [auraPulse]);

  const smoke1TranslateX = auraPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 22],
  });
  const smoke1TranslateY = auraPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [-12, 18],
  });
  const smoke1Scale = auraPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.15],
  });

  const smoke2TranslateX = auraPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -20],
  });
  const smoke2TranslateY = auraPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [15, -15],
  });

  return (
    <View pointerEvents="none" style={nativeStyles.overlay}>
      <Animated.View
        style={[
          nativeStyles.smokeTop,
          {
            backgroundColor: isCrimson ? 'rgba(225, 29, 72, 0.16)' : 'rgba(251, 191, 36, 0.14)',
            transform: [
              { translateX: smoke1TranslateX },
              { translateY: smoke1TranslateY },
              { scale: smoke1Scale },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          nativeStyles.smokeBottom,
          {
            backgroundColor: isCrimson ? 'rgba(255, 30, 66, 0.14)' : 'rgba(56, 189, 248, 0.12)',
            transform: [
              { translateX: smoke2TranslateX },
              { translateY: smoke2TranslateY },
              { scale: smoke1Scale },
            ],
          },
        ]}
      />
      {isCrimson &&
        EMBERS.map((ember, index) => (
          <NativeEmber
            key={index}
            ember={ember}
            screenWidth={width}
            screenHeight={height}
          />
        ))}
    </View>
  );
}

export function CrimsonAmbientBackdrop() {
  const { isCrimson } = useDesignMode();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    let styleTag = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = STYLE_ID;
      styleTag.textContent = AMBIENT_CSS;
      document.head.appendChild(styleTag);
    }

    let container = document.getElementById(LAYER_ID);
    if (!container) {
      container = document.createElement('div');
      container.id = LAYER_ID;

      const s1 = document.createElement('div');
      s1.className = 'mf-smoke-1';
      const s2 = document.createElement('div');
      s2.className = 'mf-smoke-2';
      const pulse = document.createElement('div');
      pulse.className = 'mf-pulse';

      container.appendChild(s1);
      container.appendChild(s2);
      container.appendChild(pulse);

      EMBERS.forEach((e) => {
        const dot = document.createElement('div');
        dot.className = 'mf-ember';
        dot.style.left = e.left;
        dot.style.width = `${e.size}px`;
        dot.style.height = `${e.size}px`;
        dot.style.animationDuration = e.dur;
        dot.style.animationDelay = e.delay;
        dot.style.setProperty('--drift', e.drift);
        container?.appendChild(dot);
      });

      document.body.appendChild(container);
    }

    container.className = isCrimson ? 'is-crimson' : 'is-glass';
  }, [isCrimson]);

  if (Platform.OS !== 'web') {
    return <NativeAmbientOverlay isCrimson={isCrimson} />;
  }

  return null;
}

const nativeStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
    overflow: 'hidden',
  },
  smokeTop: {
    position: 'absolute',
    top: 40,
    left: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  smokeBottom: {
    position: 'absolute',
    bottom: 70,
    right: -50,
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  ember: {
    position: 'absolute',
    bottom: 64,
    backgroundColor: '#FF4D79',
    shadowColor: '#FF1E42',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 8,
    elevation: 6,
  },
});
