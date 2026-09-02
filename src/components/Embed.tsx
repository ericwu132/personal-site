type EmbedProps = {
  /** A YouTube *embed* URL (…/embed/<id>), not a watch link. */
  src: string
  title: string
}

/** Responsive 16:9 video frame that holds its space before the iframe loads. */
export default function Embed({ src, title }: EmbedProps) {
  return (
    <div className="embed">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
