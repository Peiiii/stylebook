# ui-atlas

遵循上级探索项目目录规范；项目特有规则写在 DevWeave 受管段之外。

<!-- ai-development-system:start -->
## 共享 AI 开发体系

- 开始开发决策前先读取当前项目的目标、约束与权威事实；项目 `AGENTS.md` 承载项目规则和授权。
- 普通开发从 `.agents/skills/development-lifecycle/SKILL.md` 进入，由它选择流程与当前阶段，命名流程入口见 `.agents/workflows/README.md`（含大型交付）；明确只要调查、设计、验证或 Review 时只完成该范围。
- 每条实际发给用户的普通文字消息发送前核恰好一个真实阶段标记，同阶段进度和最终答复不省略。项目已定义格式优先；开发开启 tracing 时沿原插件，未开启或无专属格式时用内联代码 `[step: understanding/designing/working/reviewing/verifying/fixing/retrospective/finishing]` 中一个值兜底。简单回答可用 understanding，不启动多步流程。工具调用、对外产物及严格机器协议不插入，静默协议保持静默；不为标记额外通信，标记不替代验收或结束门。
- 用户要求打开、启动或查看擎天 / AI 开发体系大盘时，读取 `.agents/wiki/skills/tools/qingtian-dashboard/SKILL.md` 并执行到当前项目可用的入口；单纯讨论设计不启动。
- 修改项目 AI 规则、Skill 拓扑或开发体系时，按需读取 `.agents/wiki/skills/process/agent-instructions-governance/SKILL.md`；先找现有 owner，再做最小、可验证的改动。
- 只读取当前阶段和当前判断需要的 reference；不把整个 Skill 库、历史记录或项目知识一次性载入。
- 保护用户和其它任务的工作区改动。未经用户明确授权或当前项目已有可核对的明确授权，不提交、推送、建 PR、发布或部署。
- 先找事实、状态和行为的权威 owner；复用或修正已有路径，避免复制规则、平行状态与无收益的适配层。
- 修复异常先定义可观察判定条件，再沿真实触发或最近边界验证。修改 TypeScript 类型、导入、导出或运行链路时运行适用范围的类型检查。
- 源码验证后按项目检查入口完成 diff-only 可维护性检查和实现 Review；有 finding 时修正并重验受影响证据。
- 收尾核对最小完整结果、有效证据、用户可用入口和未验证边界；复盘只沉淀有可复用增量的事实或方法。
- 上游管理的 Skill 由 `ai-development-system` 仓库维护；项目专项规则留在本项目。升级通过同步工具审查差异，不直接覆盖受管文件。
<!-- ai-development-system:end -->

- Qingtian 插件 development-step-tracing：开启

## 项目自有约定

- 项目长期目标与事实在 `docs/product-brief.md`；首版功能、界面和落地建议在 `docs/designs/2026-11-18-catalog-v0.1.design.md`。面向通用风格选型，不限定原AI组织工作台的业务领域。
- 用户于2026-11-18已确认首版方向，授权创建公开GitHub仓库Peiiii/ui-atlas、提交推送，并由独立会话开发首版。按既有方案完成可运行页面、实际验证与交付；后续正常维护精确提交并普通推送到origin/main，保护并发改动。不将其它项目的授权迁入本项目。
- 目录服务不写代码的选型者与代码使用者；截图、链接和采用说明是一等使用方式。可运行样例尽量与可复用代码共源，完整场景必须与基础组件一起验证。
- 界面按需使用已有全局clear-ui与oil-ui；规则正文留在各自owner，本项目只记录目录选择与实现事实。受管开发体系文件由上游维护。
- 样例使用通用演示内容。不得直接搬入私人账号、运营记录、会话标识、凭据或用户资料；外部参考和可分发代码记录来源与使用边界。
