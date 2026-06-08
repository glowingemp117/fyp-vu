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
import { fetchListings } from '../../store/slices/marketplace';
import { colors } from '../../utils/assets';
import { SafeAreaView } from 'react-native-safe-area-context';

const MarketplaceScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { listings, isLoading, pagination } = useSelector(
    state => state.marketplace,
  );

  const loadListings = useCallback(
    (page = 1) => {
      dispatch(fetchListings({ page, limit: 20 }));
    },
    [dispatch],
  );

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const renderListing = ({ item }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() =>
        navigation.navigate('ListingDetail', { listingId: item._id })
      }
    >
      <View style={styles.listingHeader}>
        <Text style={styles.listingDenom}>
          Rs. {item.denomination?.toLocaleString()}
        </Text>
        <Text style={styles.listingQty}>{item.quantity} bonds</Text>
      </View>
      <Text style={styles.listingPrice}>
        Rs. {item.pricePerBond?.toLocaleString()} / bond
      </Text>
      <Text style={styles.listingCity}>📍 {item.city}</Text>
      <View style={styles.sellerRow}>
        <Text style={styles.sellerName}>{item.seller?.name || 'Unknown'}</Text>
        {item.seller?.isVerified && (
          <Text style={styles.verifiedBadge}>✅ Verified</Text>
        )}
      </View>
      {item.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <TouchableOpacity
          style={styles.sellBtn}
          onPress={() => navigation.navigate('CreateListing')}
        >
          <Text style={styles.sellBtnText}>+ Sell</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listings}
        renderItem={renderListing}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => loadListings(1)}
            colors={[colors.primary]}
          />
        }
        onEndReached={() => {
          if (pagination && pagination.page < pagination.pages) {
            loadListings(pagination.page + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48 }}>🏪</Text>
            <Text style={styles.emptyTitle}>No listings yet</Text>
            <Text style={styles.emptySubtitle}>
              Be the first to post a prize bond for sale
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
  sellBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  sellBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  listingCard: {
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
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  listingDenom: { fontSize: 16, fontWeight: '700', color: colors.primary },
  listingQty: { fontSize: 13, color: colors.textSecondary },
  listingPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  listingCity: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sellerName: { fontSize: 13, fontWeight: '600', color: colors.text },
  verifiedBadge: { fontSize: 12, color: colors.success },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 19,
  },
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

export default MarketplaceScreen;
