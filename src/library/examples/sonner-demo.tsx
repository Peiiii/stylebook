"use client"

import { toast } from "sonner"

import { Button } from "../ui/button"

export default function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("日程已创建", {
          description: "11 月 20 日（周五）上午 9:00",
          action: {
            label: "撤销",
            onClick: () => console.log("撤销"),
          },
        })
      }
    >
      显示通知
    </Button>
  )
}
