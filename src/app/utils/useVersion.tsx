import { useState, useEffect } from 'react'

const useVersion = (key: string): string => {
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const storedVersion = localStorage.getItem(key)
      if (storedVersion !== null) {
        setVersion(storedVersion)
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    }
  }, [key])

  return version
}

export default useVersion
