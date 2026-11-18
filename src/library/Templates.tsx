import "./templates.css";

import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";

const initialProjects = [
  { name: "产品文档", detail: "整理上手指南与常见问题", status: "进行中" },
  { name: "品牌素材", detail: "确认图标和发布素材", status: "已完成" },
  { name: "春季发布", detail: "核对上线检查清单", status: "待复核" },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  return (
    <>
      <header className="kit-template-heading">
        <div>
          <p>工作区 / 项目</p>
          <h1>项目看板</h1>
          <p>从一处查看项目进展与待办。</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>新建项目</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新建项目</DialogTitle>
              <DialogDescription>为工作区添加一项新项目。</DialogDescription>
            </DialogHeader>
            <form
              className="kit-stack"
              onSubmit={(e) => {
                e.preventDefault();
                const name = String(
                  new FormData(e.currentTarget).get("name") ?? "",
                ).trim();
                if (!name) return;
                setProjects((items) => [
                  ...items,
                  { name, detail: "等待补充项目说明", status: "进行中" },
                ]);
                e.currentTarget.reset();
                setOpen(false);
              }}
            >
              <label className="kit-label">
                项目名称
                <Input name="name" required />
              </label>
              <div className="kit-actions">
                <DialogClose asChild>
                  <Button variant="outline">取消</Button>
                </DialogClose>
                <Button type="submit">添加项目</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>
      <div className="kit-metrics">
        <Section title="全部项目">
          <strong>{projects.length}</strong>
        </Section>
        <Section title="进行中">
          <strong>
            {projects.filter((p) => p.status === "进行中").length}
          </strong>
        </Section>
        <Section title="已完成">
          <strong>
            {projects.filter((p) => p.status === "已完成").length}
          </strong>
        </Section>
      </div>
      <Section title="最近项目" description="查看工作区内的项目状态。">
        <ul className="kit-projects">
          {projects.map((p, i) => (
            <li key={i}>
              <div>
                <b>{p.name}</b>
                <small>{p.detail}</small>
              </div>
              <Badge
                variant={
                  p.status === "已完成"
                    ? "default"
                    : p.status === "待复核"
                      ? "outline"
                      : "secondary"
                }
              >
                {p.status}
              </Badge>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState("");
  return (
    <>
      <header className="kit-template-heading">
        <div>
          <p>工作区 / 偏好</p>
          <h1>工作区设置</h1>
          <p>管理显示名称与通知偏好。</p>
        </div>
      </header>
      <form
        className="kit-stack"
        onChange={() => setSaved("")}
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(String(new FormData(e.currentTarget).get("name")));
        }}
      >
        <Section title="工作区资料" description="用于项目看板和成员列表。">
          <label className="kit-label">
            工作区名称
            <Input name="name" defaultValue="Studio North" required />
          </label>
        </Section>
        <Section title="通知偏好">
          <div className="kit-setting">
            <label htmlFor="project-updates">
              项目更新<small>项目状态改变时接收通知</small>
            </label>
            <Switch
              id="project-updates"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </Section>
        <div className="kit-actions">
          <Button type="submit">保存设置</Button>
          <span role="status">{saved && `已在当前预览保存「${saved}」`}</span>
        </div>
      </form>
    </>
  );
}
