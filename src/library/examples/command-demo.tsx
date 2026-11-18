import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../ui/command"

export default function CommandDemo() {
  return (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput placeholder="输入指令或搜索…" />
      <CommandList>
        <CommandEmpty>没有找到匹配的结果</CommandEmpty>
        <CommandGroup heading="推荐操作">
          <CommandItem>
            <Calendar />
            <span>日历</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>搜索表情</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>计算器</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="设置">
          <CommandItem>
            <User />
            <span>个人资料</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>账单</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>设置</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
