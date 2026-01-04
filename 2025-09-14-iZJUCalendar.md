---
layout: post
title: 工具 - 将iZJU的PS课表导出为ics文件并导入至日历
page.author: THEzsc
date: '2026-01-05 01:55:00 +0800'
categories:
  - 技术
  - 工具
tags:
  - 浙江大学
  - PeopleSoft
  - 课表
  - 日历
  - ICS
  - Tampermonkey
  - 脚本
toc: true
description: 通过Tampermonkey脚本将浙江大学iZJU PeopleSoft系统的课表导出为ICS格式文件，并导入到各种日历应用的详细教程。
image: /assets/img/datas/202601050137_0002.png
---

> [!LINK] 
> - [脚本](https://openuserjs.org/scripts/THEzsc/PS_Calendar_to_ICS_(iZJU)/)
> - [博客](/posts/iZJUCalendar/)
> - [Github](https://github.com/THEzsc/Peoplesoft-Calendar-to-ICS)

## 前言

> 背景故事：某一谈在跟dalao吃饭的时候，聊到课表的问题，dalao说ZJU本部是有人写脚本将课表导入到手机calendar中的，突发奇想，iZJU的PS既然有“打印机友好界面”，那是不是也可以一键将所有的日程导入到calendar？

---

> 相关的课表程序有很多，比如说iZJU小程序，支付宝。但是诸如iCloud Calendar或者outlook calendar还有google calendar，都不支持类似支付宝的“截图导入”功能，这些应用支持的是导入ics文件。另外，使用这些跟邮箱绑定的calendar还可以直接导入至手机自带的calendar应用，享受顶级的提醒服务。

---

> 脚本全程使用 Cursor 和 Codex 搭建。

<span style="color:#00b0f0">工具支持中英文双语。</span>

<span style="color:#00b0f0">请使用该脚本的同学可以帮我核对一下，使用脚本后导出的课表是否与ps上的课表完全一致！（这是不可能的，因为我帮你处理调休了，也正是这一步我可能出错）</span>

> [!NOTE] 2026 更新
> 本次更新添加了对 「2026 春夏学期」的支持，包括 「小学期」「寒假」「其他节假日」的适配。
> 提醒：新学期拉取课表时，在 Peoplesoft 中需要点击 「filter/过滤」来拉取完整课表，否则将导出失败，如图。
> ![img0](/assets/img/datas/202601050137_0001.png)

## 让我们从零开始

### 1. 安装脚本

1. 安装 [Tampermonkey](https://www.tampermonkey.net/){:target="_blank"} 浏览器扩展
2. 访问[链接](https://openuserjs.org/scripts/THEzsc/PS_Calendar_to_ICS_(iZJU)){:target="_blank"}安装脚本
3. <span style="color:#ff0000">打开浏览器扩展管理界面 → 打开开发者模式</span>
	1. [Google](chrome://extensions/){:target="_blank"}
	2. [Edge](edge://extensions/){:target="_blank"}
	3. [Opera](opera://extensions){:target="_blank"}
4. <span style="color:#ff0000">转到油猴扩展设置</span>
5. <span style="color:#ff0000">打开“允许用户运行脚本”</span>（没有就不用）

<img src="/assets/img/datas/202509142239_0001.png" alt="img1" width="200"/>
![img2](/assets/img/datas/202509142239_0002.png)


### 2. 使用步骤

1. **登录系统**：访问浙大 [PeopleSoft 选课系统](https://scrsprd.zju.edu.cn){:target="_blank"} → 右上角显示English时登录（即用中文模式登录）
2. **进入课表**：选择【学期选课】→【我的每周课程表】
3. **切换视图**：选择【列表查看】
4. **导出课表**：点击页面右上角的"导出 ICS"按钮
5. **导入日历**：将下载的 `.ics` 文件导入你的日历应用

![img3](/assets/img/datas/202509142239_0003.png)
<img src="/assets/img/datas/202509142239_0004.png" alt="img4" width="200"/>
![img5](/assets/img/datas/202509142239_0005.png)
![img6](/assets/img/datas/202509142239_0006.png)

## 导入日历应用

### Outlook（推荐）

1. 打开 [Outlook Calendar](https://outlook.office.com/calendar)
2. 进入日历模块
3. 添加日历 → 创建空白日历
4. 转到“从文件上传”
5. 选择下载的 `.ics` 文件

### Google Calendar

1. 打开 [Google Calendar](https://calendar.google.com)
2. 左侧【其他日历】点击 "+" → "导入"
3. 选择下载的 `.ics` 文件
4. 选择要导入的日历，时区选择上海

### Apple Calendar (macOS/iOS) 

<span style="color:#ff0000">注意：网页端不支持</span>
1. 双击 `.ics` 文件
2. 或在 Calendar 应用中：文件 → 导入

### 其他日历应用

大多数日历应用都支持标准的 iCalendar (.ics) 格式导入。

## 加载到iPhone

1. 设置 → Apps → Mail → Mail Accounts → Add Account（intl邮箱需要使用Microsoft Exchange）
2. 在 Calendar 应用底部 “Calendars” 选择刚才创建的日历（默认直接加载）
3. 可以选择 Event Alert

## 高级配置

  

### 修改时区

在脚本中找到这行并修改：

```javascript

const TZID = "Asia/Shanghai"; // 修改为你需要的时区

```

  

### 修改匹配规则

脚本会自动匹配包含以下模式的网址：

```javascript

// @match        https://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOYEE/HRMS/*

// @match        file:///*

```

如果需要支持其他 PeopleSoft 系统，可以添加相应的 `@match` 规则。
  

## 支持的数据格式

### 时间格式

- ✅ `星期一 8:00AM - 9:50AM`
- ✅ `周二 08:00 - 09:35`
- ✅ `一三五 13:00-14:35`
- ✅ `MoWe 10:00AM - 11:15AM`

### 日期格式

- ✅ `16/09/2024 - 17/01/2025` (DD/MM/YYYY)
- ✅ `09/16/2024 - 01/17/2025` (MM/DD/YYYY)
- ✅ `2024-09-16 - 2025-01-17` (YYYY-MM-DD)

### 表格结构

脚本会寻找包含这些列标题的表格：

- 日期和时间 / Days & Times
- 教室 / Room
- 讲师 / Instructor / 教师
- 开始/结束日期 / Start/End Date