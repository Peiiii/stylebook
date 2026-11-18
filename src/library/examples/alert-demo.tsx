import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../ui/alert"

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>修改已保存</AlertTitle>
        <AlertDescription>
          你可以继续编辑，或返回列表查看最新内容。
        </AlertDescription>
      </Alert>
      <Alert>
        <PopcornIcon />
        <AlertTitle>
          设置已更新
        </AlertTitle>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>付款未完成</AlertTitle>
        <AlertDescription>
          <p>请核对付款信息后重试。</p>
          <ul className="list-inside list-disc text-sm">
            <li>核对银行卡信息</li>
            <li>确认账户余额充足</li>
            <li>核对账单地址</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
