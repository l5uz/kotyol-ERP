import { useState, useEffect, useMemo, useCallback } from 'react';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { dataIntegrityService } from '@/services/dataIntegrity.service';

/**
 * Reusable hook for managing any master data entity.
 * @param {string} entityKey - Key in dynamicSettingsService (e.g. 'productCategories', 'units', 'customerTypes', 'priorities')
 * @param {string} integrityType - Optional entity type string for dataIntegrityService (e.g. 'CATEGORY', 'UNIT', 'CUSTOMER_TYPE')
 */
export const useMasterData = (entityKey, integrityType = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'INACTIVE'
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch / refresh data from service
  const refresh = useCallback(() => {
    setLoading(true);
    try {
      const items = dynamicSettingsService.getList(entityKey, { includeArchived: true });
      setData(items || []);
    } catch (err) {
      console.error(`Error loading master data for ${entityKey}:`, err);
    } finally {
      setLoading(false);
    }
  }, [entityKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Filtered and searched data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status filter
      if (statusFilter === 'ACTIVE' && (item.status === 'INACTIVE' || item.status === 'ARCHIVED')) {
        return false;
      }
      if (statusFilter === 'INACTIVE' && item.status !== 'INACTIVE' && item.status !== 'ARCHIVED') {
        return false;
      }

      // Search term
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const nameMatch = item.name && item.name.toLowerCase().includes(term);
      const codeMatch = item.code && item.code.toLowerCase().includes(term);
      const descMatch = item.description && item.description.toLowerCase().includes(term);
      return nameMatch || codeMatch || descMatch;
    });
  }, [data, searchTerm, statusFilter]);

  // Actions
  const createItem = useCallback(
    (itemData) => {
      const created = dynamicSettingsService.addItem(entityKey, itemData);
      refresh();
      return created;
    },
    [entityKey, refresh]
  );

  const updateItem = useCallback(
    (id, itemData) => {
      const updated = dynamicSettingsService.updateItem(entityKey, id, itemData);
      refresh();
      return updated;
    },
    [entityKey, refresh]
  );

  const archiveItem = useCallback(
    (id) => {
      const archived = dynamicSettingsService.archiveItem(entityKey, id);
      refresh();
      return archived;
    },
    [entityKey, refresh]
  );

  const restoreItem = useCallback(
    (id) => {
      const restored = dynamicSettingsService.restoreItem(entityKey, id);
      refresh();
      return restored;
    },
    [entityKey, refresh]
  );

  const deleteItem = useCallback(
    (id) => {
      const checkType = integrityType || entityKey;
      const res = dynamicSettingsService.deleteItem(entityKey, id, checkType);
      if (res.success) {
        refresh();
      }
      return res;
    },
    [entityKey, integrityType, refresh]
  );

  const canDeleteCheck = useCallback(
    (id) => {
      const checkType = integrityType || entityKey;
      return dataIntegrityService.canDelete(checkType, id);
    },
    [integrityType, entityKey]
  );

  // Bulk actions
  const bulkArchive = useCallback(() => {
    selectedIds.forEach((id) => dynamicSettingsService.archiveItem(entityKey, id));
    setSelectedIds([]);
    refresh();
  }, [entityKey, selectedIds, refresh]);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((d) => d.id || d.code));
    }
  }, [selectedIds, filteredData]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  return {
    data,
    filteredData,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    bulkArchive,
    createItem,
    updateItem,
    archiveItem,
    restoreItem,
    deleteItem,
    canDeleteCheck,
    refresh,
  };
};
