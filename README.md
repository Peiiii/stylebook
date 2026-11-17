# UI Atlas

面向所有人的UI风格选型与沟通目录：看效果、做比较，用截图、链接和明确的样式选择与AI沟通，也能查看和复用组件代码。工作名暂定。

**先看 [首版功能与界面设计](docs/designs/2026-11-18-catalog-v0.1.design.md)** · [长期目标与已确认结论](docs/product-brief.md)。

公开仓库：[Peiiii/ui-atlas](https://github.com/Peiiii/ui-atlas)。首版方案已获确认，交由独立开发会话实施；目前已完成项目与设计文档初始化，运行页面尚待交付。

## 首版建议

- 三种浏览入口：整套风格、组件样式、场景组合。
- 两套风格、六组组件、两个完整场景，用真实内容验证。
- 详情预览、同条件对比、截图友好模式、复制采用说明与实际代码。
- 文件维护、静态网站；不要求登录，不依赖AI API或数据库。

## 位置与检查

项目位于探索目录的 `ui-atlas/`，拥有独立Git仓库。

创建入口为探索目录官方工具，接入检查：

```sh
node ../../ai-development-system/bin/ai-development-system.mjs check --target .
```

当前没有产品启动命令或已发布网站。正式依赖、启动和验证入口随实现落地后更新。

界面规范使用已有全局 `$clear-ui`，本项目维护目录内容与视觉样例，不复制另一份Skill规则。演示使用通用内容，私人业务数据不进入此项目。

## License

原创内容采用 [MIT License](LICENSE)。第三方依赖及明确标注来源的内容保留各自许可。开发体系文件来源见 `.agents/ai-development-system.lock.json`。
