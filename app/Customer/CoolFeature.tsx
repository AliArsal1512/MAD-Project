import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useThemeContext } from '../contexts/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { height: screenHeight } = Dimensions.get('window');

const CIRCLE_SIZE = 40;
const STROKE_WIDTH = 4;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CoolFeature({ navigation }: { navigation?: any }) {
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [showConnecting, setShowConnecting] = useState(false);
  // @ts-ignore
  const connectingTimer = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const fillAnimation = useRef(new Animated.Value(0)).current;
  const [sendScale] = useState(new Animated.Value(1));

  const { theme, isDark, colors } = useThemeContext();

  // Timer duration in ms
  const TIMER_DURATION = 1000;
  const CONNECTING_DELAY = 30000; // 30 seconds

  const router = useRouter();
  useEffect(() => {
      const onBackPress = () => {
        router.replace('/Customer/CustomerSettings'); // Replace '/Role' with your target route path
        return true;
      };
  
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => backHandler.remove();
    }, [router]);
  
  

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const threshold = 50;
    if (offsetY > threshold && !isScrolledUp && !inCall) {
      setIsScrolledUp(true);
      startFillAnimation();
    } else if ((offsetY <= threshold && isScrolledUp) || inCall) {
      setIsScrolledUp(false);
      stopFillAnimation();
    }
  };

  const startFillAnimation = () => {
    setIsFilling(true);
    setTimerCompleted(false);
    setShowConnecting(false);
    fillAnimation.setValue(0);
    Animated.timing(fillAnimation, {
      toValue: 1,
      duration: TIMER_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setTimerCompleted(true);
        // Start connecting timer
        connectingTimer.current = setTimeout(() => {
          setShowConnecting(true);
        }, CONNECTING_DELAY);
      }
    });
  };

  const stopFillAnimation = () => {
    fillAnimation.stopAnimation();
    setIsFilling(false);
    setTimerCompleted(false);
    setShowConnecting(false);
    fillAnimation.setValue(0);
    if (connectingTimer.current) {
      clearTimeout(connectingTimer.current);
      connectingTimer.current = null;
    }
  };

  const handleScrollEndDrag = () => {
    if (isScrolledUp && timerCompleted) {
      setInCall(true);
      setShowConnecting(false);
      if (connectingTimer.current) {
        clearTimeout(connectingTimer.current);
        connectingTimer.current = null;
      }
    }
    if (isScrolledUp) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      setIsScrolledUp(false);
      stopFillAnimation();
    }
  };

  useEffect(() => {
    return () => {
      fillAnimation.stopAnimation();
      if (connectingTimer.current) {
        clearTimeout(connectingTimer.current);
      }
    };
  }, []);

  // Animated stroke for SVG circle
  const animatedStroke = fillAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  // Animate send button on press
  const handleSendPress = () => {
    Animated.sequence([
      Animated.timing(sendScale, {
        toValue: 0.8,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(sendScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    // Add send logic here if needed
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>  
      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContentContainer}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern empty chat area */}
        <View style={styles.emptyChatContainer}>
          <Ionicons 
            name="chatbubble-ellipses-outline" 
            size={90} 
            color={colors.primary} 
            style={{ marginBottom: 16 }}
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Welcome to your chat!</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Scroll up to reveal the call button and start a conversation.</Text>
        </View>
        {/* Additional content to ensure scrolling is possible */}
        <View style={styles.scrollableContent}>
          <View style={[styles.contentItem, { backgroundColor: colors.surface }]}> 
            <Text style={[styles.contentText, { color: colors.text }]}>Message 1</Text>
          </View>
          <View style={[styles.contentItem, { backgroundColor: colors.surface }]}> 
            <Text style={[styles.contentText, { color: colors.text }]}>Message 2</Text>
          </View>
          <View style={[styles.contentItem, { backgroundColor: colors.surface }]}> 
            <Text style={[styles.contentText, { color: colors.text }]}>Message 3</Text>
          </View>
        </View>
        <View style={{ height: 200 }} />
      </ScrollView>
      {/* Floating Action Button for Call */}
      {(isScrolledUp || inCall) && (
        <Animated.View style={[
          styles.fabContainer,
          { backgroundColor: colors.primary, shadowColor: colors.primary, opacity: inCall ? 0.7 : 1 },
        ]}>
          {!inCall ? (
            <TouchableOpacity
              style={styles.fabButton}
              activeOpacity={0.8}
              onPressIn={startFillAnimation}
              onPressOut={stopFillAnimation}
            >
              <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                {/* Background Circle */}
                <Circle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={RADIUS}
                  stroke={colors.surface}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                />
                {/* Animated Progress Circle */}
                <AnimatedCircle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={RADIUS}
                  stroke={timerCompleted ? colors.success : colors.secondary}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={animatedStroke}
                  strokeLinecap="round"
                />
              </Svg>
              <Ionicons name="call" size={22} color={colors.surface} style={{ position: 'absolute' }} />
            </TouchableOpacity>
          ) : (
            <View style={styles.callCardContent}>
              <Ionicons name="call" size={28} color={colors.surface} style={{ marginRight: 8 }} />
              <TouchableOpacity
                style={styles.endCallButton}
                onPress={() => setInCall(false)}
              >
                <Ionicons name="call" size={18} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                <Text style={styles.endCallText}>End</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      )}
      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: colors.surface, shadowColor: colors.primary }]}> 
        <View style={[styles.inputBox, { backgroundColor: colors.card }]}> 
          <Text style={[styles.inputPlaceholder, { color: colors.textSecondary }]}> 
            Type your message here...
          </Text>
        </View>
        <Animated.View style={{ transform: [{ scale: sendScale }] }}>
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={handleSendPress}> 
            <Ionicons name="send" size={20} color="#fff" /> 
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  chatContentContainer: {
    paddingBottom: 100,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  scrollableContent: {
    padding: 16,
    gap: 16,
  },
  contentItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  contentText: {
    fontSize: 16,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 20,
  },
  fabButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  callCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  endCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53935',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  endCallText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0,
    borderRadius: 30,
    margin: 12,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    backgroundColor: 'transparent',
  },
  inputBox: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 12,
  },
  inputPlaceholder: {
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  connectingText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});