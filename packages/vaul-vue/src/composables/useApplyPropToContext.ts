import type { DialogProps } from '../controls'
import { provideDrawerRootContext } from '../context'
import { useDrawer } from '../controls'

export const useApplyPropsToContext = (props: DialogProps) => {
  const {
    snapPoints,
    activeSnapPoint,
    shouldScaleBackground,
    fadeFromIndex,
    onCloseProp,
    onOpenChangeProp,
    onDragProp,
    onReleaseProp,
    nested
  } = provideDrawerRootContext(useDrawer())

  snapPoints.value = props.snapPoints ?? snapPoints.value
  activeSnapPoint.value = props.snapPoints?.[0] ?? activeSnapPoint.value

  onCloseProp.value = props.onClose ?? onCloseProp.value

  shouldScaleBackground.value = props.shouldScaleBackground ?? shouldScaleBackground.value

  fadeFromIndex.value = props.fadeFromIndex ?? (snapPoints.value && snapPoints.value.length - 1)

  onOpenChangeProp.value = props.onOpenChange ?? onOpenChangeProp.value

  onDragProp.value = props.onDrag ?? onDragProp.value

  onReleaseProp.value = props.onRelease ?? onReleaseProp.value

  nested.value = props.nested ?? nested.value
}
