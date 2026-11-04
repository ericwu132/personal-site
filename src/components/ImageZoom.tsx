import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

function imageBounds(image: HTMLImageElement) {
  const bounds = image.getBoundingClientRect()
  if (getComputedStyle(image).objectFit !== 'contain' || !image.naturalWidth) return bounds
  const scale = Math.min(image.clientWidth / image.naturalWidth, image.clientHeight / image.naturalHeight)
  const rotated = getComputedStyle(image).transform !== 'none'
  const width = (rotated ? image.naturalHeight : image.naturalWidth) * scale
  const height = (rotated ? image.naturalWidth : image.naturalHeight) * scale
  return { width, height, left: bounds.left + (bounds.width - width) / 2, top: bounds.top + (bounds.height - height) / 2 }
}

function ImageViewer({ src, alt, rotateCCW, source, onClose }: { src: string; alt: string; rotateCCW?: boolean; source: HTMLAnchorElement; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const image = useRef<HTMLImageElement>(null)
  const shade = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const animations = useRef<Animation[]>([])
  const closing = useRef(false)
  const thumbnailTransform = useRef('none')

  useLayoutEffect(() => {
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    const thumbnail = source.querySelector('img')
    const bounds = thumbnail ? imageBounds(thumbnail) : source.getBoundingClientRect()
    root.style.overflow = 'hidden'
    dialog.current?.showModal()
    const previousVisibility = source.style.visibility
    closing.current = false

    // Size the frame using the photo's visible orientation. CSS rotation alone
    // leaves the original portrait dimensions in layout and offsets the viewer.
    const fitImage = () => {
      const photo = image.current!
      if (!photo.naturalWidth || !stage.current) return
      const naturalWidth = rotateCCW ? photo.naturalHeight : photo.naturalWidth
      const naturalHeight = rotateCCW ? photo.naturalWidth : photo.naturalHeight
      const scale = Math.min(1, Math.max(1, window.innerWidth - 48) / naturalWidth, Math.max(1, window.innerHeight - 112) / naturalHeight)
      const width = naturalWidth * scale
      const height = naturalHeight * scale
      stage.current.style.width = `${width}px`
      stage.current.style.height = `${height}px`
      photo.style.width = `${rotateCCW ? height : width}px`
      photo.style.height = `${rotateCCW ? width : height}px`
    }

    const expand = () => {
      if (animations.current.length || closing.current || !image.current || !stage.current) return
      fitImage()
      const target = image.current.getBoundingClientRect()
      if (!target.width || !target.height) return
      const x = bounds.left + bounds.width / 2 - target.left - target.width / 2
      const y = bounds.top + bounds.height / 2 - target.top - target.height / 2
      thumbnailTransform.current = `translate3d(${x}px, ${y}px, 0) scale(${bounds.width / target.width}, ${bounds.height / target.height})`
      source.style.visibility = 'hidden'
      const options: KeyframeAnimationOptions = {
        duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      }
      animations.current = [
        stage.current.animate([
          { transform: thumbnailTransform.current, opacity: 1 },
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
        ], options),
        shade.current!.animate([{ opacity: 0 }, { opacity: 1 }], options),
        closeButton.current!.animate([{ opacity: 0 }, { opacity: 1 }], options),
      ]
    }
    const viewerImage = image.current!
    if (viewerImage.complete && viewerImage.naturalWidth) expand()
    else viewerImage.addEventListener('load', expand, { once: true })
    viewerImage.addEventListener('error', onClose, { once: true })
    window.addEventListener('resize', fitImage)
    return () => {
      window.removeEventListener('resize', fitImage)
      viewerImage.removeEventListener('load', expand)
      viewerImage.removeEventListener('error', onClose)
      animations.current.forEach((animation) => animation.cancel())
      animations.current = []
      source.style.visibility = previousVisibility
      root.style.overflow = previousOverflow
      source.focus({ preventScroll: true })
    }
  }, [source])

  const close = () => {
    if (closing.current) return
    closing.current = true
    if (!animations.current.length) { onClose(); return }
    const currentTransform = getComputedStyle(stage.current!).transform
    const shadeOpacity = getComputedStyle(shade.current!).opacity
    const buttonOpacity = getComputedStyle(closeButton.current!).opacity
    animations.current.forEach((animation) => animation.cancel())
    const options: KeyframeAnimationOptions = {
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'both',
    }
    animations.current = [
      stage.current!.animate([
        { transform: currentTransform, opacity: 1 },
        { transform: thumbnailTransform.current, opacity: 1 },
      ], options),
      shade.current!.animate([{ opacity: shadeOpacity }, { opacity: 0 }], options),
      closeButton.current!.animate([{ opacity: buttonOpacity }, { opacity: 0 }], options),
    ]
    void animations.current[0].finished.then(onClose, () => {})
  }

  return createPortal(
    <dialog ref={dialog} className="image-viewer" aria-label="Enlarged image" onCancel={(event) => { event.preventDefault(); close() }} onClick={close}>
      <div ref={shade} className="image-viewer-shade" aria-hidden="true" />
      <button ref={closeButton} className="image-viewer-close" type="button" aria-label="Close image viewer" autoFocus>×</button>
      <div ref={stage} className="image-viewer-stage">
        <img ref={image} className={rotateCCW ? 'image-viewer-rotated' : undefined} src={src} alt={alt} onClick={(event) => event.stopPropagation()} />
      </div>
    </dialog>,
    document.body,
  )
}

export default function ImageZoom({ src, alt, rotateCCW, children }: { src: string; alt: string; rotateCCW?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const source = useRef<HTMLAnchorElement>(null)
  return (
    <>
      <a ref={source} className="image-zoom" href={src} aria-label={`Enlarge image: ${alt}`} onClick={(event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        setOpen(true)
      }}>{children}</a>
      {open && source.current && <ImageViewer src={src} alt={alt} rotateCCW={rotateCCW} source={source.current} onClose={() => setOpen(false)} />}
    </>
  )
}
