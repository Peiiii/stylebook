import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";

const dateFormat = new Intl.DateTimeFormat("zh-CN", {
  month: "long",
  day: "numeric",
});
const calendarDate = new Date(2026, 10, 20);
const calendarEvents = [
  { date: calendarDate, title: "品牌网站评审", time: "15:00" },
  { date: new Date(2026, 10, 24), title: "设计规范交付", time: "10:30" },
];

export default function CalendarExample() {
  const [day, setDay] = useState<Date | undefined>(calendarDate);
  const event = calendarEvents.find(
    ({ date }) => day && date.getTime() === day.getTime(),
  );
  return (
    <>
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
        <CalendarDays aria-hidden="true" className="size-4 text-primary" />
        交付日历
      </h3>
      <div className="flex flex-wrap items-start gap-3">
        <Calendar
          aria-label="交付日期"
          mode="single"
          selected={day}
          onSelect={setDay}
          defaultMonth={calendarDate}
          modifiers={{ deliverable: calendarEvents.map(({ date }) => date) }}
          modifiersClassNames={{ deliverable: "font-bold text-primary" }}
          showOutsideDays={false}
          className="bg-transparent p-0 [--cell-size:--spacing(7)]"
        />
        <div className="min-w-0 basis-26 flex-1 border-t pt-3">
          <p className="text-sm font-medium">
            {day ? dateFormat.format(day) : "选择日期"}
          </p>
          {event ? (
            <div className="mt-2 space-y-1.5 text-sm">
              <Badge variant="secondary">{event.time}</Badge>
              <p>{event.title}</p>
            </div>
          ) : (
            day && (
              <p className="mt-2 text-xs text-muted-foreground">
                当天没有交付安排。
              </p>
            )
          )}
        </div>
      </div>
    </>
  );
}
