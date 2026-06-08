import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBonds, deleteBond } from '../../store/slices/bonds';
import { colors } from '../../utils/assets';
import { DENOMINATION_LABELS } from '../../constants/network';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyBondsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { bonds, isLoading, pagination } = useSelector(state => state.bonds);
  const [activeFilter, setActiveFilter] = useState('all');

  const loadBonds = useCallback(
    (page = 1) => {
      const params = { page, limit: 20 };
      if (activeFilter !== 'all') params.status = activeFilter;
      dispatch(fetchMyBonds(params));
    },
    [dispatch, activeFilter],
  );

  useEffect(() => {
    loadBonds();
  }, [loadBonds]);

  const handleDelete = id => {
    Alert.alert('Delete Bond', 'Are you sure you want to remove this bond?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deleteBond(id));

            Toast.show({
              type: 'success',
              text1: 'Bond removed successfully!',
            });
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: error?.message || 'Failed to delete bond',
            });
          }
        },
      },
    ]);
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'winner', label: '🏆 Winners' },
    { key: 'pending', label: '⏳ Pending' },
    { key: 'checked', label: '✅ Checked' },
  ];

  const renderBondItem = ({ item }) => (
    <View style={styles.bondCard}>
      <View style={styles.bondHeader}>
        <Text style={styles.bondNumber}>{item.bondNumber}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'winner' && styles.winnerBadge,
            item.status === 'pending' && styles.pendingBadge,
            item.status === 'checked' && styles.checkedBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'winner' && { color: '#059669' },
              item.status === 'pending' && { color: '#F59E0B' },
              item.status === 'checked' && { color: '#6366F1' },
            ]}
          >
            {item.status?.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={styles.bondDenom}>
        {DENOMINATION_LABELS[item.denomination]}
      </Text>
      {item.nickname && (
        <Text style={styles.bondNickname}>"{item.nickname}"</Text>
      )}
      {item.status === 'winner' && (
        <Text style={styles.winAmount}>
          Won: Rs. {item.winAmount?.toLocaleString()} ({item.prizeCategory}{' '}
          prize)
        </Text>
      )}
      <View style={styles.bondActions}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.deleteBtnText}>🗑️ Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bonds</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddBond')}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterBtn,
              activeFilter === f.key && styles.filterBtnActive,
            ]}
            onPress={() => setActiveFilter(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={bonds}
        renderItem={renderBondItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => loadBonds(1)}
            colors={[colors.primary]}
          />
        }
        onEndReached={() => {
          if (pagination && pagination.page < pagination.pages) {
            loadBonds(pagination.page + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48 }}>📋</Text>
            <Text style={styles.emptyTitle}>No bonds yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your prize bond numbers to track them automatically
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: colors.primary },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  bondCard: {
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
  bondHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bondNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 3,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  winnerBadge: { backgroundColor: '#ECFDF5' },
  pendingBadge: { backgroundColor: '#FEF3C7' },
  checkedBadge: { backgroundColor: '#EEF2FF' },
  statusText: { fontSize: 11, fontWeight: '700' },
  bondDenom: { fontSize: 14, color: colors.textSecondary, marginBottom: 2 },
  bondNickname: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  winAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginTop: 6,
  },
  bondActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  deleteBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  deleteBtnText: { fontSize: 13, color: colors.error },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 40,
  },
});

export default MyBondsScreen;
