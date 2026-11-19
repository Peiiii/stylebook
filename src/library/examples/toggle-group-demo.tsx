import { useState } from "react";
import { Bold, Italic, Underline } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

import {
  SegmentedControl,
  SegmentedControlItem,
} from "../ui/segmented-control";

export default function ToggleGroupDemo() {
  const [period, setPeriod] = useState("week");
  return (
    <div className="grid justify-items-center gap-3">
      <SegmentedControl
        aria-label="选择时间范围"
        value={period}
        onValueChange={setPeriod}
      >
        <SegmentedControlItem value="day">日</SegmentedControlItem>
        <SegmentedControlItem value="week">周</SegmentedControlItem>
        <SegmentedControlItem value="month">月</SegmentedControlItem>
      </SegmentedControl>
      <ToggleGroup variant="outline" type="multiple" aria-label="文本格式">
        <ToggleGroupItem value="bold" aria-label="切换加粗">
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="切换斜体">
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="strikethrough" aria-label="切换删除线">
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
