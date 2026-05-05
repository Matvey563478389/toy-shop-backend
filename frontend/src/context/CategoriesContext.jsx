import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../shared/api.js';

const CategoriesContext = createContext({
  categories: [],
  refreshCategories: () => {},
});

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);

  const refreshCategories = useCallback(() => {
    return api
      .get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    void refreshCategories();
  }, [refreshCategories]);

  const value = useMemo(
    () => ({ categories, refreshCategories }),
    [categories, refreshCategories]
  );

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useShopCategories() {
  return useContext(CategoriesContext).categories;
}

export function useRefreshShopCategories() {
  return useContext(CategoriesContext).refreshCategories;
}
