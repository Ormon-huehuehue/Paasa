import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    runOnJS,
    Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const BaseScreen: React.FC = () => {
    const [showButton, setShowButton] = useState(false);
    const logoScale = useSharedValue(0);
    const logoOpacity = useSharedValue(0);
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(50);
    const subtitleOpacity = useSharedValue(0);
    const subtitleTranslateY = useSharedValue(30);
    const backgroundOpacity = useSharedValue(1);
    const pulseScale = useSharedValue(1);

    useEffect(() => {
        // Start the animation sequence
        const startAnimation = () => {
            // Logo animation
            logoScale.value = withTiming(1, {
                duration: 800,
                easing: Easing.out(Easing.back(1.7)),
            });
            logoOpacity.value = withTiming(1, { duration: 600 });

            // Pulse effect for logo
            pulseScale.value = withSequence(
                withDelay(400, withTiming(1.1, { duration: 300 })),
                withTiming(1, { duration: 300 }),
                withDelay(200, withTiming(1.05, { duration: 200 })),
                withTiming(1, { duration: 200 })
            );

            // Title animation
            titleOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
            titleTranslateY.value = withDelay(600, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));

            // Subtitle animation
            subtitleOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
            subtitleTranslateY.value = withDelay(1000, withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) }));

            // Show button after animation
            setTimeout(() => {
                runOnJS(setShowButton)(true);
            }, 2500);
        };

        startAnimation();
    }, []);

    const logoAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: logoScale.value * pulseScale.value },
            ],
            opacity: logoOpacity.value,
        };
    });

    const titleAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: titleOpacity.value,
            transform: [{ translateY: titleTranslateY.value }],
        };
    });

    const subtitleAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: subtitleOpacity.value,
            transform: [{ translateY: subtitleTranslateY.value }],
        };
    });

    const buttonOpacity = useSharedValue(0);
    const buttonScale = useSharedValue(0.8);

    useEffect(() => {
        if (showButton) {
            buttonOpacity.value = withTiming(1, { duration: 600 });
            buttonScale.value = withTiming(1, {
                duration: 600,
                easing: Easing.out(Easing.back(1.2))
            });
        }
    }, [showButton]);

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: buttonOpacity.value,
            transform: [{ scale: buttonScale.value }],
        };
    });

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0B0F1A', '#111827', '#1E293B', '#0B0F1A']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.content}>
                    {/* Logo/Icon */}
                    <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                        <View style={styles.logo}>
                            <Text style={styles.logoText}>₱</Text>
                        </View>
                    </Animated.View>

                    {/* App Title */}
                    <Animated.Text style={[styles.title, titleAnimatedStyle]}>
                        PAASA
                    </Animated.Text>

                    {/* Subtitle */}
                    <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
                        Your Financial Future
                    </Animated.Text>

                    {/* Loading indicator - only show when button is not visible */}
                    {!showButton && (
                        <View style={styles.loadingContainer}>
                            <View style={styles.loadingDots}>
                                {[0, 1, 2].map((index) => (
                                    <LoadingDot key={index} delay={index * 200} />
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Get Started Button */}
                    {showButton && (
                        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
                            <Link href="/(tabs)/explore" asChild>
                                <TouchableOpacity style={styles.getStartedButton} activeOpacity={0.8}>
                                    <Text style={styles.buttonText}>Get Started</Text>
                                </TouchableOpacity>
                            </Link>
                        </Animated.View>
                    )}
                </View>
            </LinearGradient>
        </View>
    );
};

const LoadingDot: React.FC<{ delay: number }> = ({ delay }) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        const animate = () => {
            opacity.value = withSequence(
                withDelay(delay, withTiming(1, { duration: 400 })),
                withTiming(0.3, { duration: 400 })
            );
        };

        animate();
        const interval = setInterval(animate, 1200);
        return () => clearInterval(interval);
    }, [delay]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export default BaseScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    logoContainer: {
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 12,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 16,
        color: '#9CA3AF',
        marginBottom: 60,
        textAlign: 'center',
        letterSpacing: 1,
    },
    loadingContainer: {
        position: 'absolute',
        bottom: 100,
    },
    loadingDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginHorizontal: 4,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
    },
    getStartedButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 30,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});