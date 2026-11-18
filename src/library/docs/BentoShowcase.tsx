import { useState } from "react";
import { ArrowUpRight, Bookmark, Layers3, Mail } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function BentoShowcase() {
  const [saved, setSaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  return (
    <main className="mx-auto max-w-6xl px-4 py-5 sm:px-8 sm:py-8">
      <header className="mb-5 flex items-center justify-between gap-2 border-b pb-4">
        <div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
          <Layers3 className="size-4 shrink-0" /> 林沐的设计手记
        </div>
        <a
          href="#bento-notes"
          onClick={(event) => {
            event.preventDefault();
            document.getElementById("bento-notes")?.focus();
          }}
          className="shrink-0 rounded-sm text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          最新手记
        </a>
      </header>

      <div className="grid auto-rows-auto gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        <Card className="justify-between gap-6 bg-secondary p-5 text-secondary-foreground sm:col-span-2 sm:p-7">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback>林</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">林沐</p>
              <p className="text-xs text-muted-foreground">独立设计师</p>
            </div>
          </div>
          <div>
            <h1 className="max-w-md text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">
              从日常里找设计灵感
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              记录界面、排版和生活里的小发现。把观察做成小项目，再把过程写下来。
            </p>
          </div>
        </Card>

        <Card className="min-w-0 gap-3 p-3 sm:col-span-2">
          <div className="grid h-36 grid-cols-[1fr_1.3fr] overflow-hidden rounded-xl bg-primary text-primary-foreground sm:h-44">
            <div className="flex flex-col justify-between border-r border-current/20 p-4">
              <span className="text-xs opacity-80">版式实验 / 03</span>
              <span
                aria-hidden="true"
                className="font-serif text-5xl leading-none"
              >
                Aa
              </span>
            </div>
            <div
              aria-hidden="true"
              className="relative grid grid-cols-4 gap-1.5 overflow-hidden p-4"
            >
              <div className="col-span-3 row-span-2 rounded-t-full bg-primary-foreground/90" />
              <div className="rounded-full bg-primary-foreground/35" />
              <div className="rounded-full bg-primary-foreground/60" />
              <div className="col-span-4 h-2 self-end rounded-full bg-primary-foreground/60" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 px-2 pb-2">
            <div>
              <h2 className="font-medium">版式采样册</h2>
              <p className="text-xs text-muted-foreground">
                网格、留白和文字节奏
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="查看版式采样册"
                >
                  <ArrowUpRight />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>版式采样册</DialogTitle>
                  <DialogDescription>
                    用字号和留白组织同一组信息。
                  </DialogDescription>
                </DialogHeader>
                <p className="text-sm leading-6">
                  第三期用不等宽网格做实验。大字先建立阅读顺序，再让短标签和图形负责补充信息。
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        <Card className="gap-3 p-5">
          <h2 className="text-sm font-medium">本月记录</h2>
          <p className="text-4xl font-semibold tabular-nums">24</p>
          <div
            className="flex h-11 items-end gap-1.5"
            role="img"
            aria-label="近六个月记录数为 8、13、11、19、17、24"
          >
            {[8, 13, 11, 19, 17, 24].map((count) => (
              <span
                key={count}
                className="flex-1 rounded-xs bg-primary/45 last:bg-primary"
                style={{ height: `${(count / 24) * 100}%` }}
              />
            ))}
          </div>
        </Card>

        <Card
          id="bento-notes"
          tabIndex={-1}
          className="justify-between gap-4 p-5 lg:col-span-2"
        >
          <Badge variant="secondary">最新手记</Badge>
          <CardContent className="px-0">
            <h2 className="text-xl font-semibold">让列表读起来轻一点</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              把重复的标签交给分组，把真正需要比较的数字留在每一行。
            </p>
          </CardContent>
          <Button
            variant={saved ? "secondary" : "outline"}
            size="sm"
            aria-pressed={saved}
            className="self-start"
            onClick={() => setSaved(!saved)}
          >
            <Bookmark />
            {saved ? "已收藏" : "收藏手记"}
          </Button>
        </Card>

        <Card className="justify-between gap-3 p-5 sm:col-span-2 lg:col-span-1">
          <Mail className="size-5 text-muted-foreground" />
          <div>
            <h2 className="font-medium">订阅手记</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              每月分享一组新观察。
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="self-start">
                {subscribed ? "查看订阅" : "订阅更新"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>订阅设计手记</DialogTitle>
                <DialogDescription>
                  订阅状态仅在当前预览中保留。
                </DialogDescription>
              </DialogHeader>
              {subscribed ? (
                <p className="text-sm">已订阅更新</p>
              ) : (
                <form
                  className="grid gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubscribed(true);
                    toast.success("已订阅更新");
                  }}
                >
                  <Label htmlFor="bento-email">邮箱</Label>
                  <Input
                    id="bento-email"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                  <Button type="submit" className="justify-self-start">
                    确认订阅
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </main>
  );
}
