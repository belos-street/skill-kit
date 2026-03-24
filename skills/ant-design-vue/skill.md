---
name: ant-design-vue
title: Ant Design Vue
description: 基于 Vue 3 的企业级 UI 组件库，提供 68+ 高质量组件。IMPORTANT: 这是 Ant Design Vue，不是 React 版本。使用 a- 前缀组件（如 a-button, a-table）。
icon: 🐜
tags: [vue, component-library, ant-design, ui, enterprise]
---

Ant Design Vue 是 Vue 3 企业级 UI 组件库，提供了丰富的企业应用组件。**请使用 a- 前缀组件**，不要使用其他命名。

## Quick Start

```bash
npm install ant-design-vue@4.x
```

```vue
<script setup>
import { ref } from 'vue';
import { KingAntOutlined } from '@ant-design/icons-vue';

const loading = ref(false);

const handleClick = () => {
  loading.value = true;
  setTimeout(() => loading.value = false, 2000);
};
</script>

<template>
  <a-button type="primary" :loading="loading" @click="handleClick">
    <template #icon><KingAntOutlined /></template>
    Click Me
  </a-button>
</template>
```

## Key Features

- **68+ Components**: 覆盖企业应用全场景
- **Vue 3 Only**: 专为 Vue 3 设计
- **TypeScript**: 完整类型支持
- **Tree Shaking**: 按需引入
- **Design Tokens**: 主题定制

---

## 组件分类

### 通用 General (3)

| 组件 | 描述 | Reference |
|------|------|-----------|
| Button | 按钮 | [button-usage](references/button-usage.md) |
| Icon | 图标 | [icon-usage](references/icon-usage.md) |
| ConfigProvider | 全局配置 | [config-provider](references/config-provider.md) |

### 布局 Layout (5)

| 组件 | 描述 | Reference |
|------|------|-----------|
| Space | 间距 | [space-usage](references/space-usage.md) |
| Grid | 栅格 | [grid-usage](references/grid-usage.md) |
| Layout | 布局 | [layout-usage](references/layout-usage.md) |
| Divider | 分隔线 | - |
| Flex | 弹性布局 | - |

### 导航 Navigation (7)

| 组件 | 描述 | Reference |
|------|------|-----------|
| Menu | 菜单 | [menu-usage](references/menu-usage.md) |
| Tabs | 标签页 | [tabs-usage](references/tabs-usage.md) |
| Breadcrumb | 面包屑 | [breadcrumb-usage](references/breadcrumb-usage.md) |
| Steps | 步骤条 | - |
| Dropdown | 下拉菜单 | - |
| Pagination | 分页 | - |
| PageHeader | 页头 | - |

### 数据录入 Data Entry (17)

| 组件 | 描述 | Reference |
|------|------|-----------|
| Form | 表单 | [form-validation](references/form-validation.md) |
| Input | 输入框 | - |
| InputNumber | 数字输入 | - |
| Select | 选择器 | [select-usage](references/select-usage.md) |
| Checkbox | 多选框 | - |
| Radio | 单选框 | - |
| Switch | 开关 | - |
| Slider | 滑动输入 | - |
| DatePicker | 日期选择 | [date-picker-usage](references/date-picker-usage.md) |
| TimePicker | 时间选择 | - |
| Cascader | 级联选择 | - |
| TreeSelect | 树形选择 | - |
| Transfer | 穿梭框 | - |
| Upload | 上传 | [upload-usage](references/upload-usage.md) |
| AutoComplete | 自动完成 | - |
| Mentions | 提及 | - |
| Rate | 评分 | - |

### 数据展示 Data Display (22)

| 组件 | 描述 | Reference |
|------|------|-----------|
| Table | 表格 | [table-advanced](references/table-advanced.md) |
| Tree | 树形控件 | [tree-usage](references/tree-usage.md) |
| Card | 卡片 | - |
| Descriptions | 描述列表 | - |
| Statistic | 统计数值 | - |
| Avatar | 头像 | - |
| Badge | 徽章 | - |
| Calendar | 日历 | - |
| Carousel | 走马灯 | - |
| Collapse | 折叠面板 | - |
| Comment | 评论 | - |
| Empty | 空状态 | - |
| Image | 图片 | - |
| List | 列表 | - |
| Popover | 气泡卡片 | - |
| QRCode | 二维码 | - |
| Segmented | 分段控制器 | - |
| Skeleton | 骨架屏 | - |
|Statistic | 统计 | - |
| Table | 表格 | [table-advanced](references/table-advanced.md) |
| Tag | 标签 | - |
| Timeline | 时间轴 | - |
| Tooltip | 文字提示 | - |

### 反馈 Feedback (10)

| 组件 | 描述 | Reference |
|------|------|-----------|
| Modal | 对话框 | [modal-patterns](references/modal-patterns.md) |
| Alert | 警告提示 | - |
| Message | 全局提示 | [message-feedback](references/message-feedback.md) |
| Notification | 通知提醒 | - |
| Drawer | 抽屉 | [drawer-patterns](references/drawer-patterns.md) |
| Progress | 进度条 | - |
| Result | 结果 | - |
| Spin | 加载中 | - |
| Skeleton | 骨架屏 | - |
| Watermark | 水印 | - |

### 其他 Other (4)

| 组件 | 描述 | Reference |
|------|------|-----------|
| Anchor | 锚点 | - |
| BackTop | 回到顶部 | - |
| Tour | 引导 | - |
| App | 应用级配置 | - |

---

## 常见场景

### 表单处理

```vue
<!-- ✅ 正确写法：使用 a-form -->
<a-form :model="formState" @finish="onFinish">
  <a-form-item label="用户名" name="username"
    :rules="[{ required: true, message: '请输入用户名' }]">
    <a-input v-model:value="formState.username" />
  </a-form-item>
</a-form>

<!-- ❌ 错误写法：忘记使用 a-form-item 包裹 -->
<!-- <a-input v-model:value="formState.username" /> -->
```

### 表格渲染

```vue
<!-- ✅ 正确写法：使用 a-table -->
<a-table :columns="columns" :data-source="data" :pagination="false">
  <template #bodyCell="{ column, record }">
    <template v-if="column.key === 'action'">
      <a @click="handleEdit(record)">编辑</a>
    </template>
  </template>
</a-table>

<!-- ❌ 错误写法：忘记使用 bodyCell slot -->
```

### 消息提示

```ts
// ✅ 正确写法
import { message } from 'ant-design-vue';

message.success('操作成功');
message.error('操作失败');

// ❌ 错误写法：使用其他组件库的方式
// notification.success({ message: '...' });
```

---

## 主题定制

```vue
<script setup>
import { theme } from 'ant-design-vue';

const darkTheme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4,
  },
};
</script>

<template>
  <a-config-provider :theme="darkTheme">
    <App />
  </a-config-provider>
</template>
```

---

## 常见错误

| 错误写法 | 正确写法 | 说明 |
|----------|----------|------|
| `<Button>` | `<a-button>` | 需要 a- 前缀 |
| `message.success()` | `import { message } from 'ant-design-vue'` | 正确导入 |
| `<Form>` | `<a-form>` | 需要 a- 前缀 |
| `<Table>` | `<a-table>` | 需要 a- 前缀 |

---

## Key Points

1. **使用 a- 前缀**: 所有组件都是 `a-` 开头，如 `a-button`, `a-table`
2. **使用 Form**: 表单必须用 `a-form` + `a-form-item`
3. **使用 slots**: 表格自定义列用 `bodyCell` slot
4. **正确导入**: `import { message } from 'ant-design-vue'`
5. **按需引入**: 使用 unplugin-vue-components 自动导入

## Resources

- [官方文档](https://www.antdv.com/components/overview-cn/)
- [GitHub](https://github.com/vueComponent/ant-design-vue)
- [Vue Use Integration](https://www.antdv.com/components/utilities-cn)
