export default function customImageLoader({ src, width, quality }) {
  if (src.startsWith('data:')) return src
  if (src.startsWith('http')) return src
  return `${process.env.NEXT_PUBLIC_IMAGE_URL}${src}?w=${width}&q=${quality || 75}`
}