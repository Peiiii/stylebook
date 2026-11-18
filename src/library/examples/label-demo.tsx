import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

export default function LabelDemo() {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox id="label-demo-terms" />
        <Label htmlFor="label-demo-terms">同意服务条款</Label>
      </div>
    </div>
  )
}
