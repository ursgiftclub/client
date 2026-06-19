import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mobileMenuOpen: false,
  cartDrawerOpen: false,
  sidebarOpen: false,
  searchOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false
    },
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen
    },
    closeCartDrawer: (state) => {
      state.cartDrawerOpen = false
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen
    },
    closeSearch: (state) => {
      state.searchOpen = false
    },
  },
})

export const {
  toggleMobileMenu,
  closeMobileMenu,
  toggleCartDrawer,
  closeCartDrawer,
  toggleSidebar,
  closeSidebar,
  toggleSearch,
  closeSearch,
} = uiSlice.actions
export default uiSlice.reducer
