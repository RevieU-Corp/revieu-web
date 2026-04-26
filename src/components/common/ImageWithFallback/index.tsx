import React, { useEffect, useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTM2IDE3NkwxODAgMTMyTDIwNCAxNTZMMjQwIDEyMCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjEyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48Y2lyY2xlIGN4PSIyNjAiIGN5PSIxMDAiIHI9IjE2IiBmaWxsPSIjOUNBM0FGIi8+PHJlY3QgeD0iMTEyIiB5PSI4OCIgd2lkdGg9IjE3NiIgaGVpZ2h0PSIxMjQiIHJ4PSIxNiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjEyIi8+PC9zdmc+'

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, onError, alt, ...rest } = props
  const [currentSrc, setCurrentSrc] = useState<string>(src || ERROR_IMG_SRC)

  useEffect(() => {
    setCurrentSrc(src || ERROR_IMG_SRC)
  }, [src])

  const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    if (currentSrc !== ERROR_IMG_SRC) {
      setCurrentSrc(ERROR_IMG_SRC)
    }
    onError?.(event)
  }

  return <img {...rest} src={currentSrc} alt={alt} onError={handleError} />
}
