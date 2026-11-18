import { Separator } from "../ui/separator"

export default function SeparatorDemo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          一套开源、可组合的界面组件。
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>文章</div>
        <Separator orientation="vertical" />
        <div>文档</div>
        <Separator orientation="vertical" />
        <div>源码</div>
      </div>
    </div>
  )
}
