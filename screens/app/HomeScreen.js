import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../tools/api';
import Endpoint from '../../tools/endpoint';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [dashboardData, setDashboardData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Örnek veriler - gerçek uygulamada API'den gelecek

  useEffect(() => {
    getData()
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };



  const getData = async () => {
    console.log('geldi')
    try {
      const { data } = await api.post(Endpoint.DashboardData);
      console.log(data)
      if (data.status) {
        setDashboardData([
          {
            id: 1,
            title: 'Bekleyen',
            subtitle: 'Randevular',
            count: data.obj.active_count,
            icon: '⏳',
            gradient: ['#667eea', '#764ba2'],
            shadowColor: '#667eea',
            percentage: 15,
            trend: '+12%'
          },
          {
            id: 2,
            title: 'Tamamlanan',
            subtitle: 'Randevular',
            count: data.obj.ok_count,
            icon: '✨',
            gradient: ['#f093fb', '#f5576c'],
            shadowColor: '#f093fb',
            percentage: 78,
            trend: '+8%'
          },
          {
            id: 3,
            title: 'İptal Edilen',
            subtitle: 'Randevular',
            count: data.obj.cancel_count,
            icon: '💔',
            gradient: ['#4facfe', '#00f2fe'],
            shadowColor: '#4facfe',
            percentage: 4,
            trend: '-5%'
          },
          {
            id: 4,
            title: 'Pasif',
            subtitle: 'Randevular',
            count: data.obj.passive_count,
            icon: '⚡',
            gradient: ['#43e97b', '#38f9d7'],
            shadowColor: '#43e97b',
            percentage: 6,
            trend: '+2%'
          }
        ])
      }

      setTotalCount(data.obj.total)
    } catch (error) {
      console.log(error)
    }
  };

  const FloatingCard = ({ item, index }) => {
    const cardScale = useRef(new Animated.Value(1)).current;
    const cardRotate = useRef(new Animated.Value(0)).current;


    const handlePress = () => {
      Animated.sequence([
        Animated.timing(cardScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <Animated.View
        style={[
          styles.floatingCardContainer,
          {
            transform: [
              { scale: cardScale },
              {
                rotateZ: cardRotate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '2deg'],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
          <LinearGradient
            colors={item.gradient}
            style={[
              styles.floatingCard,
              {
                shadowColor: item.shadowColor,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardTopSection}>
              <View style={styles.iconContainer}>
                <Text style={styles.cardIcon}>{item.icon}</Text>
              </View>
            </View>

            <View style={styles.cardMiddleSection}>
              <Text style={styles.floatingCardCount}>{item.count}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.percentage}%` }
                  ]}
                />
              </View>
            </View>

            <View style={styles.cardBottomSection}>
              <Text style={styles.floatingCardTitle}>{item.title}</Text>
              <Text style={styles.floatingCardSubtitle}>{item.subtitle}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
          style={styles.backgroundGradient}
        >
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.welcomeText}>👋 Merhaba</Text>
                <Text style={styles.title}>Ana Sayfa</Text>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Text style={styles.notificationIcon}>🔔</Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>Randevu analitiklerinizi keşfedin</Text>
          </Animated.View>

          {dashboardData.length === 0 ? (
            <Text>Yükleniyor...</Text>
          ) : (
            <View style={styles.statsContainer}>
              {dashboardData.map((item, index) => (
                <FloatingCard key={item.id} item={item} index={index} />
              ))}
            </View>
          )}
          <Animated.View
            style={[
              styles.summarySection,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    rotateX: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['45deg', '0deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
              style={styles.glassCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.glassCardContent}>
                <Text style={styles.glassCardTitle}>🎯 Toplam Randevu</Text>
                <Text style={styles.glassCardCount}>
                 {totalCount}
                </Text>
                <Text style={styles.glassCardSubtitle}>Toplam randevu sayısı</Text>

           
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.actionSection}>
            
          </View>
        </LinearGradient>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    minHeight: height,
    paddingBottom: 30,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    fontStyle: 'italic',
  },
  notificationButton: {
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    shadowColor: '#64748b',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  floatingCardContainer: {
    marginBottom: 20,
  },
  floatingCard: {
    borderRadius: 25,
    padding: 25,
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.2)',
    shadowColor: '#64748b',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 24,
  },
  trendContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.2)',
    shadowColor: '#64748b',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  trendText: {
    color: '#1e293b',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardMiddleSection: {
    marginBottom: 15,
  },
  floatingCardCount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 3,
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
  },
  cardBottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatingCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  floatingCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  summarySection: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  glassCard: {
    borderRadius: 25,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    backgroundColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#64748b',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  glassCardContent: {
    alignItems: 'center',
  },
  glassCardTitle: {
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 15,
    fontWeight: '600',
  },
  glassCardCount: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  glassCardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  miniStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniStatItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  miniStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  miniStatLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  miniStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(148,163,184,0.4)',
  },
  actionSection: {
    paddingHorizontal: 25,
  },
  actionButton: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.2)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logoutButton: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
});