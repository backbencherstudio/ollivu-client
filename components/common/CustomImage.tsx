import Image from 'next/image'
import { useState } from 'react'

interface CustomImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function CustomImage({ src, alt, width, height, className, priority }: CustomImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  if (error || !src) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400">{alt?.charAt(0) || '?'}</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${loading ? 'blur-sm' : 'blur-0'}`}
      priority={priority}
      onError={() => setError(true)}
      onLoad={() => setLoading(false)}
      unoptimized
    />
  )
}