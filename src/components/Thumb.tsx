type ThumbProps = {
  /** Path to a real image; falls back to an empty placeholder box. */
  src?: string
  alt?: string
  /** CSS aspect-ratio for the box, e.g. '16 / 9'. */
  ratio?: string
}

/**
 * Image slot for a project. Until a real file is dropped in, it renders an
 * empty framed box that holds exactly the space the photo will occupy, so
 * the layout doesn't shift when the images arrive.
 */
export default function Thumb({ src, alt = '', ratio = '16 / 9' }: ThumbProps) {
  return (
    <div className="thumb" style={{ aspectRatio: ratio }}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span aria-hidden="true">image</span>}
    </div>
  )
}
