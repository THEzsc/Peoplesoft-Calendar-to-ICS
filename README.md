# PS Calendar to ICS (iZJU)

将 PeopleSoft「我的每周课程表-列表查看」一键导出为 .ics 日历文件（Asia/Shanghai）。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-0.5.1-blue.svg)](./VERSION.md)
[![Platform](https://img.shields.io/badge/Platform-Tampermonkey-green.svg)](https://www.tampermonkey.net/)

## 链接

- [👍Greasyfork脚本](https://greasyfork.org/zh-CN/scripts/561424-ps-calendar-to-ics-izju)
- [Openusejs脚本](https://openuserjs.org/scripts/THEzsc/PS_Calendar_to_ICS_(iZJU)/)
- [博客](https://tzblog.tech/posts/iZJUCalendar/)
- [Github](https://github.com/THEzsc/Peoplesoft-Calendar-to-ICS)

## 功能

- 结构化解析课程表（`PAGROUPDIVIDER` + `CLASS_MTG_VW`），不依赖课程名文本
- 中英文时间格式支持（Mo/Tu/We/Th/Fr/Sa/Su、AM/PM、24小时制）
- 节假日停课 + 调休补课（EXDATE/RDATE 处理偏差）
- 内置 2025-2026 春夏学期行事历与全日重要事件
- 支持本地保存的 HTML（`file://`）调试导出

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)
2. 打开脚本链接并安装

## 使用

1. 进入 PeopleSoft → 我的每周课程表 → 列表查看
2. 点击页面右上角「导出 ICS」

## 说明

- 仅支持列表查看（非“每周日历”视图）
- 时区固定为 `Asia/Shanghai`
