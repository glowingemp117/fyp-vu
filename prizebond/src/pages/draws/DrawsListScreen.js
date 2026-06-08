import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDraws } from '../../store/slices/draws';
import { colors } from '../../utils/assets';
import { SafeAreaView } from 'react-native-safe-area-context';

const DrawsListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { draws, isLoading, pagination } = useSelector(state => state.draws);

  const loadDraws = useCallback(
    (page = 1) => {
      dispatch(fetchDraws({ page, limit: 20 }));
    },
    [dispatch],
  );

  useEffect(() => {
    loadDraws();
  }, [loadDraws]);

  const renderDrawItem = ({ item }) => (
    <TouchableOpacity
      style={styles.drawCard}
      onPress={() => navigation.navigate('DrawDetail', { drawId: item._id })}
    >
      <View style={styles.drawRow}>
        <View style={styles.denomBadge}>
          <Text style={styles.denomText}>
            Rs. {item.denomination?.toLocaleString()}
          </Text>
        </View>
        <Text style={styles.drawDate}>
          {new Date(item.drawDate).toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>
      <Text style={styles.drawTitle}>Draw #{item.drawNumber}</Text>
      <Text style={styles.drawCity}>📍 {item.city}</Text>
      <View style={styles.prizeRow}>
        <Text style={styles.prizeLabel}>
          1st: Rs. {item.firstPrize?.amount?.toLocaleString()}
        </Text>
        <Text style={styles.prizeLabel}>
          2nd: Rs. {item.secondPrize?.amount?.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Draw Results</Text>

      <FlatList
        data={draws}
        renderItem={renderDrawItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => loadDraws(1)}
            colors={[colors.primary]}
          />
        }
        onEndReached={() => {
          if (pagination && pagination.page < pagination.pages) {
            loadDraws(pagination.page + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No draw results available</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
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
  drawRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  denomBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  denomText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  drawDate: { fontSize: 13, color: colors.textSecondary },
  drawTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  drawCity: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  prizeRow: { flexDirection: 'row', gap: 16 },
  prizeLabel: { fontSize: 12, color: colors.textSecondary },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 40,
  },
});

export default DrawsListScreen;
