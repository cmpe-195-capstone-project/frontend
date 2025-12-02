import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function OnboardingBackground({ children }) {
  return (
    <View style={styles.container}>
      {/* Sky Gradient */}
      <View style={styles.sky} />

      {/* Layer 1 */}
      <Svg style={styles.layer1} viewBox="0 0 1440 600">
        <Path
          d="M0,400 L200,300 L400,350 L600,250 L800,300 L1000,280 L1200,320 L1440,300 L1440,600 L0,600 Z"
          fill="#d4625c"
          opacity="0.6"
        />
      </Svg>

      {/* Layer 2 */}
      <Svg style={styles.layer2} viewBox="0 0 1440 600">
        <Path
          d="M0,450 L150,380 L300,420 L500,320 L700,360 L900,300 L1100,350 L1300,320 L1440,360 L1440,600 L0,600 Z"
          fill="#c1495b"
          opacity="0.7"
        />
      </Svg>

      {/* Layer 3 */}
      <Svg style={styles.layer3} viewBox="0 0 1440 600">
        <Path
          d="M0,480 L180,400 L360,430 L540,380 L720,420 L900,360 L1080,400 L1260,380 L1440,420 L1440,600 L0,600 Z"
          fill="#a73e5c"
          opacity="0.8"
        />
      </Svg>

      {/* Layer 4 */}
      <Svg style={styles.layer4} viewBox="0 0 1440 600">
        <Path
          d="M0,500 L120,450 L240,470 L400,420 L560,460 L720,400 L880,440 L1040,410 L1200,450 L1360,430 L1440,460 L1440,600 L0,600 Z"
          fill="#7c3559"
          opacity="0.9"
        />
      </Svg>

      {/* Foreground */}
      <Svg style={styles.layer5} viewBox="0 0 1440 600">
        <Path
          d="M0,540 L100,520 L200,530 L350,500 L500,520 L650,490 L800,510 L950,485 L1100,505 L1250,495 L1440,515 L1440,600 L0,600 Z"
          fill="#5c2a40"
        />
      </Svg>

      {/* Put your screen content on top */}
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7b267",
  },

  sky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f7b267",
  },

  layer1: { position: "absolute", bottom: 0, width: "100%", height: "70%" },
  layer2: { position: "absolute", bottom: 0, width: "100%", height: "60%" },
  layer3: { position: "absolute", bottom: 0, width: "100%", height: "50%" },
  layer4: { position: "absolute", bottom: 0, width: "100%", height: "40%" },
  layer5: { position: "absolute", bottom: 0, width: "100%", height: "25%" },

  childrenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
