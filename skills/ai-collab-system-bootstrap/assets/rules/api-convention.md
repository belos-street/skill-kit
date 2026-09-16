---
name: api-convention
description: API 层对接约定，约束 LLM 正确编写接口代码并知晓拦截器的隐式行为
alwaysApply: true
---

# API 层对接约定

> 本模板以「HTTP 客户端 + 统一封装」为例。**移植时按目标项目技术栈改写**；若无独立 API 层则删除本规则并同步 `AGENTS.md` 规则表。

## 一、统一使用封装客户端

- 所有请求必须经由统一导出的请求客户端（`{{FETCH_CLIENT}}`），**禁止在业务代码中直接使用底层 HTTP 库或新建实例**。
- 接口函数集中放在 `{{API_DIR}}/<module>/index.ts`，按模块划分。

## 二、URL 与端点集中维护

```ts
import { GlobalConfig } from '@/config'
import { fetchClient } from '@/fetch'

const BASE_URL = GlobalConfig.baseUrl

const baseApi = {
  search: `${BASE_URL}/auditlog/search`, // 日志条件查询
  export: `${BASE_URL}/auditlog/export` // 日志导出
}
```

- 基础路径一律取自全局配置，不要硬编码域名/前缀。
- 用 `baseApi` 对象集中维护端点，每个端点附简短中文注释说明用途。

## 三、公共类型

列表/通用响应统一复用公共类型（`ApiResponse<T>` / `ApiListRequest<T>` / `ApiListResponse<T>` / `SortEnum` 等），从公共入口引入，不要各自重复定义。

请求参数（`XxxReq`）与列表项（`XxxItem`）接口定义在对应模块 `index.ts` 中，**每个字段附 JSDoc 注释**说明含义（含枚举取值，如「是否成功：1-成功，0-失败」）。

## 四、响应拦截器行为（写调用代码时必须知道）

拦截器已统一处理响应，业务侧无需重复判断：

- **普通 JSON**：成功时拦截器**直接返回解包后的数据**；失败时 reject 并通过事件总线抛出错误事件，业务通常只需 `try/catch`。
- **blob（文件下载）**：指定 `responseType: 'blob'` 时**返回原始响应对象**，不经过解包，需自行处理。
- **401**：触发全局登录过期事件，业务无需单独拦截。

## 五、请求拦截器已自动注入（无需手动设置）

- `Content-Type: application/json`（未显式指定时）
- `Accept-Language`：取自 locale store（随当前语言切换）
- `Authorization: Bearer <token>`：取自本地存储

因此业务代码**不要手动设置上述 header**。

## 六、示例（导出/blob）

```ts
/** 日志导出 */
export const auditLogExportApi = (data: AuditLogExportReq) =>
  fetchClient.post(baseApi.export, data, { responseType: 'blob' })
```
