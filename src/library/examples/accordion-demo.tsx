import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"

export default function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>产品介绍</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            这款产品将简洁设计与实用功能结合，适合日常使用，兼顾性能与可靠性。
          </p>
          <p>
            主要功能包括快速处理和直观操作，新用户与熟练用户都能轻松上手。
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>配送说明</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            我们通过合作物流提供配送服务。普通配送预计需要 3–5 个工作日，加急配送预计需要 1–2 个工作日。
          </p>
          <p>
            订单发出前会妥善包装。发货后，你可以在订单页面查看物流进度。
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>退换说明</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            商品支持 30 天退换。如有不满意，请保持商品完好并在订单页面申请退换。
          </p>
          <p>
            退货寄回并验收后，我们会在 48 小时内处理退款，进度可在订单页面查看。
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
