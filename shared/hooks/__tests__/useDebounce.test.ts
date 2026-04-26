import { act, renderHook } from '@testing-library/react-native'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('retorna o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('hello', 500))
    expect(result.current).toBe('hello')
  })

  it('atualiza o valor somente após o delay', () => {
    const { result, rerender } = renderHook<string, { value: string }>(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'ab' })
    rerender({ value: 'abc' })

    expect(result.current).toBe('a')

    act(() => {
      jest.advanceTimersByTime(499)
    })
    expect(result.current).toBe('a')

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(result.current).toBe('abc')
  })

  it('cancela o timer anterior em alterações rápidas', () => {
    const { result, rerender } = renderHook<string, { value: string }>(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'x' } }
    )

    rerender({ value: 'xy' })
    act(() => {
      jest.advanceTimersByTime(200)
    })
    rerender({ value: 'xyz' })
    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(result.current).toBe('x')

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(result.current).toBe('xyz')
  })
})
