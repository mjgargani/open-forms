import { renderHook, waitFor } from '@testing-library/react';
import { useGetForm } from '../useGetForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

describe('useGetForm', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  it('should fetch form data correctly', async () => {
    const mockForm = { id: '1', title: 'Test Form' };
    (api.get as jest.Mock).mockResolvedValue({ data: mockForm });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGetForm('1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockForm);
    expect(api.get).toHaveBeenCalledWith('/forms/1');
  });

  it('should not fetch if formId is empty', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGetForm(''), { wrapper });

    expect(result.current.isPending).toBe(true);
    expect(api.get).not.toHaveBeenCalled();
  });
});
