import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useToastResponse = () => {
  const onResponse = useCallback(async (response: any) => {
    if (!response.ok) {
      toast.error(response.statusText)
      return response.json()
    }
    const res = await response.json()
    if (res.message) {
      toast.success(res.message)
    }
    return res
  }, [])
  return onResponse
}
