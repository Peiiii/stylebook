import { Label } from "../ui/label"
import { Switch } from "../ui/switch"

export default function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">飞行模式</Label>
    </div>
  )
}
