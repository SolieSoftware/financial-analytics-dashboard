# Redux Type Safety with useAppSelector and useAppDispatch

This project uses typed Redux hooks for better type safety and developer experience.

## Benefits of Typed Hooks

### Before (using plain useSelector/useDispatch)

```typescript
import { useSelector, useDispatch } from "react-redux";

// ❌ No type safety - state is 'any'
const selectedTicker = useSelector((state: any) => state.ticker.selectedTicker);
const dispatch = useDispatch();

// ❌ No autocomplete for state properties
// ❌ No type checking for dispatch actions
```

### After (using useAppSelector/useAppDispatch)

```typescript
import { useAppSelector, useAppDispatch } from "./redux/store";

// ✅ Full type safety - state is properly typed
const selectedTicker = useAppSelector((state) => state.ticker.selectedTicker);
const dispatch = useAppDispatch();

// ✅ Autocomplete for all state properties
// ✅ Type checking for dispatch actions
```

## Key Improvements

1. **Type Safety**: No more `any` types for Redux state
2. **Autocomplete**: IDE will suggest available state properties
3. **Error Prevention**: TypeScript will catch typos and invalid state access
4. **Better DX**: Faster development with proper IntelliSense support

## Usage Examples

### Selecting State

```typescript
// ✅ Typed state selection
const { tickers, isLoading, error } = useAppSelector(
  (state) => state.tickerList
);
const selectedTicker = useAppSelector((state) => state.ticker.selectedTicker);
const { stockData, status, error } = useAppSelector((state) => state.stock);
```

### Dispatching Actions

```typescript
// ✅ Typed dispatch
const dispatch = useAppDispatch();

// TypeScript will ensure correct action types
dispatch(setSelectedTickerState("AAPL"));
dispatch(fetchStockData("AAPL"));
```

## Migration Guide

To migrate existing components:

1. Replace imports:

   ```typescript
   // Old
   import { useSelector, useDispatch } from "react-redux";

   // New
   import { useAppSelector, useAppDispatch } from "../redux/store";
   ```

2. Replace hook usage:

   ```typescript
   // Old
   const dispatch = useDispatch();
   const data = useSelector((state: any) => state.someSlice.data);

   // New
   const dispatch = useAppDispatch();
   const data = useAppSelector((state) => state.someSlice.data);
   ```

3. Remove `any` types - they're no longer needed!

## Type Definitions

The store exports these types for use throughout the app:

- `RootState`: The complete Redux state type
- `AppDispatch`: The typed dispatch function
- `useAppSelector`: Typed selector hook
- `useAppDispatch`: Typed dispatch hook

This ensures consistent type safety across your entire Redux application.
