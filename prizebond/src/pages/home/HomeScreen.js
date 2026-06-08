import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBondStats } from '../../store/slices/bonds';
import { fetchLatestDraws } from '../../store/slices/draws';
import { colors } from '../../utils/assets';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { stats } = useSelector(state => state.bonds);
  const { latestDraws, isLoading } = useSelector(state => state.draws);

  const loadData = useCallback(() => {
    dispatch(fetchBondStats());
    dispatch(fetchLatestDraws());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const quickActions = [
    { id: 'scan', icon: '📷', label: 'Scan Bond', screen: 'Scan' },
    { id: 'mybonds', icon: '📋', label: 'My Bonds', screen: 'MyBonds' },
    { id: 'draws', icon: '🏆', label: 'Draw Results', screen: 'Draws' },
    { id: 'market', icon: '🏪', label: 'Marketplace', screen: 'Market' },
  ];

  const renderHeader = () => (
    <View>
      {/* Greeting */}
      <View style={styles.greeting}>
        <View>
          <Text style={styles.greetText}>Assalam o Alaikum 👋</Text>
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Total Winnings</Text>
        <Text style={styles.statsAmount}>
          Rs. {(stats?.totalWinnings || 0).toLocaleString()}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.totalBonds || 0}</Text>
            <Text style={styles.statLabel}>Total Bonds</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.winners || 0}</Text>
            <Text style={styles.statLabel}>Winners</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.pending || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={() => navigation.navigate(action.screen)}
          >
            <Text style={{ fontSize: 28 }}>{action.icon}</Text>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Latest Draws */}
      <Text style={styles.sectionTitle}>Latest Draw Results</Text>
    </View>
  );

  const renderDrawItem = ({ item }) => (
    <TouchableOpacity
      style={styles.drawCard}
      onPress={() => navigation.navigate('DrawDetail', { drawId: item._id })}
    >
      <View style={styles.drawHeader}>
        <Text style={styles.drawDenom}>
          Rs. {item.denomination?.toLocaleString()}
        </Text>
        <Text style={styles.drawDate}>
          {new Date(item.drawDate).toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>
      <Text style={styles.drawCity}>📍 {item.city}</Text>
      <Text style={styles.drawNumber}>Draw #{item.drawNumber}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={latestDraws}
        renderItem={renderDrawItem}
        keyExtractor={item => item._id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadData}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No draw results yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  greetText: { fontSize: 14, color: colors.textSecondary },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statsCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  statsTitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  statsAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  drawCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  drawHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  drawDenom: { fontSize: 16, fontWeight: '700', color: colors.primary },
  drawDate: { fontSize: 13, color: colors.textSecondary },
  drawCity: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
  drawNumber: { fontSize: 12, color: colors.textSecondary },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
  },
});

export default HomeScreen;
