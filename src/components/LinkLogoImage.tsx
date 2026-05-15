import Image from 'next-image-export-optimizer';
import Link from 'next/link';

export default function LinkLogoImage({ src, alt, href, size }: {src: string, alt: string, href: URL | string, size: number}) {
  return (
    <Link
      href={href}
      style={{ display: 'inline-flex' }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{
          borderRadius: `50%`
        }}
      />
    </Link>
  )
}


