import { useState } from "react"
import { debounce } from "lodash"
import { motion, stagger, useAnimate } from "motion/react"
// `verbatimModuleSyntax` của dự án: gộp type vào import giá trị là esbuild giữ
// nguyên tên type thành import runtime → trang trắng. Xem README của thư mục này.
import type { AnimationOptions } from "motion/react"

interface TextProps {
  label: string
  fromFontVariationSettings: string
  toFontVariationSettings: string
  transition?: AnimationOptions
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number
  className?: string
  onClick?: () => void
  /** Dự án cần truyền màu cho cụm chữ cuối của H1. */
  style?: React.CSSProperties
}

const VariableFontHoverByLetter = ({
  label,
  fromFontVariationSettings = "'wght' 400, 'slnt' 0",
  toFontVariationSettings = "'wght' 900, 'slnt' -10",
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) => {
  const [scope, animate] = useAnimate()
  const [isHovered, setIsHovered] = useState(false)

  const mergeTransition = (baseTransition: AnimationOptions) => ({
    ...baseTransition,
    delay: stagger(staggerDuration, {
      from: staggerFrom,
    }),
  })

  const hoverStart = debounce(
    () => {
      if (isHovered) return
      setIsHovered(true)

      animate(
        ".letter",
        { fontVariationSettings: toFontVariationSettings },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  const hoverEnd = debounce(
    () => {
      setIsHovered(false)

      animate(
        ".letter",
        { fontVariationSettings: fromFontVariationSettings },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  return (
    <motion.span
      className={`${className}`}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <motion.span
            key={i}
            className="inline-block whitespace-pre letter"
            aria-hidden="true"
          >
            {letter}
          </motion.span>
        )
      })}
    </motion.span>
  )
}

export default VariableFontHoverByLetter
