import * as React from "react"

let memoryToasts = []

export function toast(props) {
  const id = Date.now().toString()
  memoryToasts = [{ id, ...props }, ...memoryToasts].slice(0, 5)
  return { id, dismiss: () => {} }
}

export function useToast() {
  const [state, setState] = React.useState({ toasts: memoryToasts })
  React.useEffect(() => {
    setState({ toasts: memoryToasts })
  }, [])
  return {
    ...state,
    toast,
    dismiss: () => {},
  }
}

export default useToast



