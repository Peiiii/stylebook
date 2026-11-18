"use client"

import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Checkbox id="terms" />
        <Label htmlFor="terms">同意服务条款</Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="terms-2" defaultChecked />
        <div className="grid gap-2">
          <Label htmlFor="terms-2">同意服务条款</Label>
          <p className="text-sm text-muted-foreground">
            勾选即表示你已阅读并同意服务条款。
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="toggle" disabled />
        <Label htmlFor="toggle">开启消息通知</Label>
      </div>
      <Label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-accent">
        <Checkbox
          id="toggle-2"
          defaultChecked
          className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">
            开启消息通知
          </p>
          <p className="text-sm text-muted-foreground">
            你可以随时在设置中调整通知。
          </p>
        </div>
      </Label>
    </div>
  )
}
