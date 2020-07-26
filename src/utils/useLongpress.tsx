import { useCallback, useRef, useState } from "react"

const useLongPress = (
  onLongPress: (even: React.TouchEvent| React.MouseEvent) => void,
  onClick: (even: React.TouchEvent | React.MouseEvent) => void,
  { shouldPreventDefault = true, delay = 300 } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const timeout = useRef<NodeJS.Timeout>()
  const target = useRef<EventTarget>()

  const isTouchEvent = (event: React.TouchEvent | React.MouseEvent): event is React.TouchEvent => {
    return "touches" in event
  }

  const preventDefault = (event: React.TouchEvent | React.MouseEvent) => {
    if (!isTouchEvent(event)) return

    if (event.touches.length < 2 && event.preventDefault) {
      event.preventDefault()
    }
  }

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (shouldPreventDefault && event.target) {
        //@ts-ignore
        event.target.addEventListener("touchend", preventDefault, {
          passive: false
        })

        target.current = event.target
      }
      timeout.current = setTimeout(() => {
        onLongPress(event)
        setLongPressTriggered(true)
      }, delay)
    },
    [onLongPress, delay, shouldPreventDefault]
  )

  const clear = useCallback(
    (event, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current)
      shouldTriggerClick && !longPressTriggered && onClick(event)
      setLongPressTriggered(false)
      if (shouldPreventDefault && target.current) {
        //@ts-ignore
        target.current.removeEventListener("touchend", preventDefault)
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  )

  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e)
  }
}

export default useLongPress
