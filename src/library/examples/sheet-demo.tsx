import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">打开</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>编辑个人资料</SheetTitle>
          <SheetDescription>
            修改你的个人资料，完成后点击保存。
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">姓名</Label>
            <Input id="sheet-demo-name" defaultValue="林沐" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">用户名</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">保存修改</Button>
          <SheetClose asChild>
            <Button variant="outline">关闭</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
