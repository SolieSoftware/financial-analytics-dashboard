import '@testing-library/jest-dom'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/market-overview',
    query: {},
    asPath: '/market-overview',
  }),
}))

jest.mock('@/components/redux/store', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn(() => ({ isOpen: false })),
}))

jest.mock('@/utils/hooks/useStockProfile', () => ({
  useStockProfile: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
}))

jest.mock('@/utils/hooks/useMarketProfile', () => ({
  useMarketProfile: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
}))