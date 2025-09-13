# 使用指南

## 快速开始

### 1. 安装脚本

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 复制 `scripts/ps-calendar-to-ics.user.js` 中的所有代码
3. 在 Tampermonkey 中创建新脚本并粘贴代码
4. 保存脚本

### 2. 使用步骤

1. **登录系统**：访问浙大 PeopleSoft 选课系统
   ```
   https://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOYEE/HRMS/c/NUI_FRAMEWORK.PT_LANDINGPAGE.GBL
   ```

2. **进入课表**：选择【选课】→【我的每周课程表】

3. **切换视图**：确保选择【列表查看】而非【查看每周日历】

4. **导出课表**：点击页面右下角的"导出 ICS"按钮

5. **导入日历**：将下载的 `.ics` 文件导入你的日历应用

## 测试功能

### 离线测试
```bash
# 用浏览器打开测试文件
file:///path/to/test/test-schedule.html
```

### 在线测试
1. 在 PeopleSoft 页面保存完整网页 (Ctrl+S)
2. 用浏览器打开保存的 HTML 文件
3. 验证"导出 ICS"按钮是否出现并可正常使用

## 导入日历应用

### Google Calendar
1. 打开 [Google Calendar](https://calendar.google.com)
2. 左侧点击 "+" → "从文件创建"
3. 选择下载的 `.ics` 文件
4. 选择要导入的日历

### Outlook
1. 打开 Outlook
2. 文件 → 打开和导出 → 导入/导出
3. 选择"导入 iCalendar (.ics) 或 vCalendar 文件"
4. 选择下载的 `.ics` 文件

### Apple Calendar (macOS/iOS)
1. 双击 `.ics` 文件
2. 或在 Calendar 应用中：文件 → 导入

### 其他日历应用
大多数日历应用都支持标准的 iCalendar (.ics) 格式导入。

## 故障排除

### 常见问题

**Q: 按钮不显示**
- 确认已正确安装 Tampermonkey 脚本
- 确认处于"列表查看"模式
- 刷新页面重试

**Q: 导出文件为空**
- 检查课表是否有实际的课程数据
- 确认时间不是"TBA"或"待定"
- 查看浏览器控制台错误信息

**Q: 时间显示不正确**
- 脚本使用 Asia/Shanghai 时区
- 检查课程的开始/结束日期是否正确

**Q: 课程名称显示为"课程 1"**
- 这是因为无法自动识别课程名称
- 可以在导入日历后手动修改事件标题

### 调试信息

按 F12 打开浏览器开发者工具，在 Console 标签中查看可能的错误信息。

## 高级配置

### 修改时区
在脚本中找到这行并修改：
```javascript
const TZID = "Asia/Shanghai"; // 修改为你需要的时区
```

### 修改匹配规则
脚本会自动匹配包含以下模式的网址：
```javascript
// @match        https://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOYEE/HRMS/*
// @match        file:///*
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

