import { Button } from "../ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip"

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">查看提示</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>添加到资料库</p>
      </TooltipContent>
    </Tooltip>
  )
}
