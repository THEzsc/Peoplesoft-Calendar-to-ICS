// ==UserScript==
// @name         PS Calendar to ICS (ZJU)
// @namespace    https://github.com/yourname/ps-calendar-to-ics
// @version      0.3.9
// @description  将 PeopleSoft「我的每周课程表-列表查看」导出为 ICS 文件（支持中文/英文标签，Asia/Shanghai）
// @author       You
// @match        https://scrsprd.zju.edu.cn/psc/CSPRD/EMPLOYEE/HRMS/*
// @match        file:///*
// @run-at       document-idle
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  const APP_NAME = "PS Calendar to ICS";
  const TZID = "Asia/Shanghai"; // China Standard Time (no DST)
  const HOST_HINT = "scrsprd.zju.edu.cn";

  // 2025-2026学年秋冬学期学术日历
  const ACADEMIC_CALENDAR_2025_2026 = {
    semesterStart: new Date(2025, 8, 15), // 9月15日
    semesterEnd: new Date(2026, 0, 10),   // 1月10日（包含考试期间）
    holidays: [
      // 中秋节、国庆节放假调休
      { start: new Date(2025, 9, 1), end: new Date(2025, 9, 8), name: "中秋节、国庆节放假调休" },
      // 元旦放假
      { start: new Date(2026, 0, 1), end: new Date(2026, 0, 1), name: "元旦放假" }
    ],
    makeupClasses: [
      // 9月28日工作日，授10月3日周五课
      { date: new Date(2025, 8, 28), originalDay: 5, name: "授10月3日周五课" }, // 5 = Friday
      // 10月11日工作日，授10月8日周三课  
      { date: new Date(2025, 9, 11), originalDay: 3, name: "授10月8日周三课" }  // 3 = Wednesday
    ],
    specialEvents: [
      // 新生报到注册
      { date: new Date(2025, 7, 22), name: "新生报到注册", type: "allday" },
      // 本科生新生始业教育、军训
      { start: new Date(2025, 7, 23), end: new Date(2025, 8, 14), name: "本科生新生始业教育、军训", type: "allday" },
      // 本科生开学典礼
      { date: new Date(2025, 7, 24), name: "本科生开学典礼", type: "allday" },
      // UIUC校历课程开始
      { date: new Date(2025, 7, 25), name: "UIUC校历课程-课程开始", type: "allday" },
      // ZJUI二轮选课开始
      { date: new Date(2025, 7, 25), name: "ZJUI二轮选课开始", type: "allday" },
      // UIUC校历课程本科生加课截止时间
      { date: new Date(2025, 8, 8), name: "UIUC校历课程本科生加课截止时间", type: "allday" },
      // 本科生老生报到注册
      { date: new Date(2025, 8, 12), name: "本科生老生报到注册", type: "allday" },
      // 本科生选课截止
      { date: new Date(2025, 8, 19), name: "本科生选课截止", type: "allday" },
      // UIUC校历课程本科生退课截止日期
      { date: new Date(2025, 9, 17), name: "UIUC校历课程本科生退课截止日期", type: "allday" },
      // 秋季校运动会停课
      { start: new Date(2025, 9, 24), end: new Date(2025, 9, 26), name: "秋季校运动会停课", type: "no_class" },
      // 本科生申请退课截止日期
      { date: new Date(2025, 10, 7), name: "本科生申请退课截止日期", type: "allday" },
      // 国际校区2025年辞旧迎新活动
      { date: new Date(2025, 11, 21), name: "国际校区2025年辞旧迎新活动", type: "allday" },
      // 课程结束
      { date: new Date(2025, 11, 26), name: "课程结束", type: "allday" },
      // 复习与考试
      { start: new Date(2025, 11, 29), end: new Date(2025, 11, 30), name: "复习与考试", type: "allday" },
      // 浙江大学学生节
      { date: new Date(2025, 11, 31), name: "浙江大学学生节", type: "allday" },
      // 复习与考试（1月）
      { start: new Date(2026, 0, 2), end: new Date(2026, 0, 10), name: "复习与考试", type: "allday" }
    ]
  };

  /**
   * Main bootstrap function
   */
  function bootstrap() {
    console.log(APP_NAME, "脚本启动 v0.3.9", {
      url: window.location.href,
      userAgent: navigator.userAgent,
      tampermonkey: typeof GM_info !== 'undefined' ? GM_info.version : 'unknown'
    });

    // 强制注入调试按钮（总是可见）
    forceInjectButton();

    tryInjectForDocument(window.document);
    observeForSchedule(window.document);

    // Handle target iframes
    const iframeSelector = "iframe.ps_target-iframe";
    const iframeList = Array.from(document.querySelectorAll(iframeSelector));
    console.log(APP_NAME, `找到 ${iframeList.length} 个目标iframe`);
    iframeList.forEach((iframe) => attachIframeListener(iframe));

    // Observe future iframes
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (
              node instanceof HTMLIFrameElement &&
              node.classList.contains("ps_target-iframe")
            ) {
              attachIframeListener(node);
            }
          });
        }
      }
    });
    obs.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });

    // 延迟重试机制
    setTimeout(() => {
      console.log(APP_NAME, "5秒后重试注入按钮");
      tryInjectForDocument(window.document);
    }, 5000);

    console.log(APP_NAME, "脚本已启动，监听课程表页面");
  }

  /**
   * 强制注入调试按钮（总是可见）
   */
  function forceInjectButton() {
    if (document.querySelector("#ps-ics-debug-btn")) return;

    const btn = document.createElement("button");
    btn.id = "ps-ics-debug-btn";
    btn.textContent = "🔧 PS Calendar Debug";
    btn.style.cssText = `
      position: fixed !important;
      top: 10px !important;
      right: 10px !important;
      z-index: 999999 !important;
      background: #ff6b6b !important;
      color: white !important;
      border: none !important;
      padding: 10px 15px !important;
      border-radius: 5px !important;
      font-size: 12px !important;
      cursor: pointer !important;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
    `;

    btn.addEventListener("click", () => {
      const info = {
        脚本版本: "0.3.9",
        当前URL: window.location.href,
        页面标题: document.title,
        找到的课程表元素: findScheduleRoot(document) ? "✅ 找到" : "❌ 未找到",
        iframe数量: document.querySelectorAll("iframe").length,
        Tampermonkey: typeof GM_info !== 'undefined' ? GM_info.version : "未检测到"
      };
      
      alert("PS Calendar to ICS 调试信息:\\n\\n" + 
        Object.entries(info).map(([k, v]) => `${k}: ${v}`).join('\\n'));
      
      // 尝试强制导出
      if (findScheduleRoot(document)) {
        exportSchedule(document);
      } else {
        alert("未找到课程表数据，请确认处于'我的每周课程表-列表查看'页面");
      }
    });

    document.body.appendChild(btn);
    console.log(APP_NAME, "调试按钮已注入");
  }

  function attachIframeListener(iframe) {
    iframe.addEventListener("load", () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        tryInjectForDocument(doc);
        observeForSchedule(doc);
      } catch (_) {
        // ignore cross-origin issues
      }
    });
  }

  function observeForSchedule(doc) {
    const observer = new MutationObserver(() => {
      if (findScheduleRoot(doc)) {
        injectExportButton(doc);
      }
    });
    observer.observe(doc.documentElement || doc.body, {
      subtree: true,
      childList: true,
      attributes: false,
    });
  }

  function tryInjectForDocument(doc) {
    if (findScheduleRoot(doc)) {
      injectExportButton(doc);
    }
  }

  function findScheduleRoot(doc) {
    // Look for course schedule container based on real HTML structure
    const selectors = [
      'div[id*="DERIVED_REGFRM1_DESCR20"]', // Course container
      'table[id*="CLASS_MTG_VW"]', // Meeting time table
      'div[id*="win0divSTDNT_ENRL_SSV2"]', // Original container
    ];

    for (const sel of selectors) {
      const elements = Array.from(doc.querySelectorAll(sel));
      for (const el of elements) {
        if (isScheduleContainer(el)) {
          return el;
        }
      }
    }

    // Fallback: look for elements containing course schedule indicators
    const fallbackSelectors = [
      'td.PAGROUPDIVIDER', // Course title divider
      'th[abbr*="课程号码"]', // Course number header
      'th[abbr*="日期和时间"]', // Date and time header
    ];

    for (const sel of fallbackSelectors) {
      const el = doc.querySelector(sel);
      if (el) {
        let parent = el;
        for (let i = 0; i < 10 && parent; i++) {
          parent = parent.parentElement;
          if (parent && isScheduleContainer(parent)) {
            return parent;
          }
        }
      }
    }

    return null;
  }

  function isScheduleContainer(el) {
    const text = cleanText(el.textContent);
    if (!text) return false;
    
    const hasScheduleContent = 
      /课程表|我的课程|课程号码|日期和时间|开始.结束日期|讲师/i.test(text) ||
      /Class Schedule|Course|Meeting Times|Instructor/i.test(text);
    
    const hasSubstantialContent = text.length > 50;
    const hasCourseTables = el.querySelectorAll('table[id*="CLASS_MTG_VW"], td.PAGROUPDIVIDER').length > 0;
    
    return hasScheduleContent && (hasSubstantialContent || hasCourseTables);
  }

  function injectExportButton(doc) {
    // Avoid duplicate buttons
    if (doc.querySelector("#ps-ics-export-btn")) return;

    const scheduleRoot = findScheduleRoot(doc);
    if (!scheduleRoot) return;

    // Create export button
    const btn = doc.createElement("button");
    btn.id = "ps-ics-export-btn";
    btn.textContent = "导出 ICS";
    btn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      padding: 8px 16px;
      background: #007cba;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-family: sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    
    btn.addEventListener("click", () => {
      try {
        console.log(APP_NAME, "开始解析课程表...");
        const parsed = parseScheduleFromDocument(doc);
        console.log(APP_NAME, "解析结果:", parsed);
        
        if (!parsed.events || parsed.events.length === 0) {
          alert("未找到课程信息。请确保您处于\"列表查看\"界面。");
          return;
        }
        
        const icsText = buildICS(parsed);
        const fileName = buildSuggestedFileName(parsed);
        triggerDownload(icsText, fileName);
        console.log(APP_NAME, "导出完成，文件名:", fileName);
      } catch (err) {
        console.error(APP_NAME, err);
        alert("导出失败：" + (err && err.message ? err.message : String(err)));
      }
    });

    // Insert button into the document
    doc.body.appendChild(btn);
    console.log(APP_NAME, "导出按钮已注入");
  }

  /**
   * Parse schedule from document using real HTML structure
   */
  function parseScheduleFromDocument(doc) {
    const events = [];
    let termTitle = detectTermTitle(doc);

    // Find all course containers
    const courseContainers = Array.from(doc.querySelectorAll('div[id*="DERIVED_REGFRM1_DESCR20"]'));
    
    console.log(APP_NAME, `找到 ${courseContainers.length} 个课程容器`);

    for (const container of courseContainers) {
      try {
        const courseEvents = parseCourseContainer(container);
        events.push(...courseEvents);
      } catch (err) {
        console.warn(APP_NAME, "解析课程容器时出错:", err);
      }
    }

    return { termTitle, events };
  }

  function parseCourseContainer(container) {
    const events = [];
    
    // Get course title from PAGROUPDIVIDER
    const courseTitleElement = container.querySelector('td.PAGROUPDIVIDER');
    let currentCourseCode = "";
    let currentCourseName = "";
    
    if (courseTitleElement) {
      const fullTitle = cleanText(courseTitleElement.textContent);
      // Parse "CS 101 - 计算导论：工程与科学" format
      const match = fullTitle.match(/^([A-Z]+\s*\d+)\s*-\s*(.+)$/);
      if (match) {
        currentCourseCode = match[1].trim();
        currentCourseName = match[2].trim();
      } else {
        currentCourseName = fullTitle;
      }
    }

    console.log(APP_NAME, `解析课程: ${currentCourseCode} - ${currentCourseName}`);

    // Find the meeting times table
    const meetingTable = container.querySelector('table[id*="CLASS_MTG_VW"]');
    if (!meetingTable) {
      console.warn(APP_NAME, "未找到课程时间表");
      return events;
    }

    // Parse each row of the meeting table
    const rows = Array.from(meetingTable.querySelectorAll('tr'));
    let currentComponent = ""; // Track current component

    for (let i = 1; i < rows.length; i++) { // Skip header row
      const row = rows[i];
      const cells = Array.from(row.querySelectorAll('td'));
      
      if (cells.length < 7) continue;

      try {
        const classNumber = cleanText(cells[0].textContent);
        const section = cleanText(cells[1].textContent);
        const component = cleanText(cells[2].textContent);
        const dateTime = cleanText(cells[3].textContent);
        const room = cleanText(cells[4].textContent);
        const instructor = cleanText(cells[5].textContent);
        const startEndDate = cleanText(cells[6].textContent);

        // Update current component if not empty (handles continuation rows)
        if (component) {
          currentComponent = component;
        }

        // Skip rows without essential information
        if (!dateTime && !startEndDate) continue;

        // Parse the event
        const event = parseScheduleRow({
          courseCode: currentCourseCode,
          courseName: currentCourseName,
          classNumber,
          section,
          component: currentComponent,
          dateTime,
          room,
          instructor,
          startEndDate
        });

        if (event) {
          events.push(event);
        }

      } catch (err) {
        console.warn(APP_NAME, "解析课程行时出错:", err);
      }
    }

    return events;
  }

  function parseScheduleRow(data) {
    const { courseCode, courseName, classNumber, section, component, dateTime, room, instructor, startEndDate } = data;

    // Parse date range
    const dateRange = parseStartEndDate(startEndDate);
    if (!dateRange) {
      console.warn(APP_NAME, "无法解析日期范围:", startEndDate);
      return null;
    }

    // Parse time and days
    const timeInfo = parseDateTimeInfo(dateTime);
    if (!timeInfo) {
      console.warn(APP_NAME, "无法解析时间信息:", dateTime);
      return null;
    }

    // Build event summary using course code + component (calendar-friendly format)
    let summary = courseCode || "课程";
    if (component) {
      // Use more calendar-friendly format instead of square brackets
      summary += ` - ${component}`;
    }
    if (section) {
      summary += ` (${section})`;
    }

    return {
      summary,
      courseCode,
      courseName,
      component,
      section,
      classNumber,
      location: room || "",
      instructor: instructor || "",
      days: timeInfo.days,
      startTime: timeInfo.startTime,
      endTime: timeInfo.endTime,
      startDate: dateRange.start,
      endDate: dateRange.end
    };
  }

   function parseStartEndDate(dateStr) {
     if (!dateStr) return null;
     
     // Parse "15/09/2025 - 21/09/2025" format
     // NOTE: The dates in PeopleSoft table only show the current week display range,
     // not the actual course duration. We need to use the full semester range.
     const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/);
     if (!match) return null;

     // Use the full academic semester range instead of the short display range
     return {
       start: ACADEMIC_CALENDAR_2025_2026.semesterStart,
       end: ACADEMIC_CALENDAR_2025_2026.semesterEnd
     };
   }

  function parseDateTimeInfo(timeStr) {
    if (!timeStr) return null;

    // Parse "星期一 2:00PM - 3:50PM" format
    const match = timeStr.match(/星期([一二三四五六日])\s+(\d+):(\d+)(AM|PM)\s*-\s*(\d+):(\d+)(AM|PM)/);
    if (!match) return null;

    const [, dayChar, startHour, startMin, startAmPm, endHour, endMin, endAmPm] = match;
    
    // Convert Chinese day to number (0 = Sunday, 1 = Monday, etc.)
    const dayMap = { '日': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6 };
    const dayOfWeek = dayMap[dayChar];
    
    if (dayOfWeek === undefined) return null;

    // Convert 12-hour to 24-hour format
    let startHour24 = parseInt(startHour);
    let endHour24 = parseInt(endHour);
    
    if (startAmPm === 'PM' && startHour24 !== 12) startHour24 += 12;
    if (startAmPm === 'AM' && startHour24 === 12) startHour24 = 0;
    if (endAmPm === 'PM' && endHour24 !== 12) endHour24 += 12;
    if (endAmPm === 'AM' && endHour24 === 12) endHour24 = 0;

    return {
      days: [dayOfWeek],
      startTime: { hour: startHour24, minute: parseInt(startMin) },
      endTime: { hour: endHour24, minute: parseInt(endMin) }
    };
  }

  function detectTermTitle(doc) {
    const titleCandidates = [
      ...Array.from(doc.querySelectorAll("h1, h2, h3, .PATRANSACTIONTITLE, .PTTEXT, .ps_pageheader")),
    ];
    
    for (const el of titleCandidates) {
      const t = cleanText(el.textContent);
      if (!t) continue;
      if (/学期|学年|Term|Session|课程表/i.test(t)) {
        return t;
      }
    }
    
    const title = (doc.title || "").trim();
    if (title) return title;
    return "我的课程表";
  }

  /**
   * Academic calendar helper functions
   */
  function isHoliday(date) {
    for (const holiday of ACADEMIC_CALENDAR_2025_2026.holidays) {
      if (isDateInRange(date, holiday.start, holiday.end)) {
        return true;
      }
    }
    return false;
  }

  function isMakeupClassDay(date) {
    for (const makeup of ACADEMIC_CALENDAR_2025_2026.makeupClasses) {
      if (isSameDate(date, makeup.date)) {
        return makeup;
      }
    }
    return null;
  }

  function isSpecialEvent(date) {
    for (const event of ACADEMIC_CALENDAR_2025_2026.specialEvents) {
      if (event.start && event.end) {
        if (isDateInRange(date, event.start, event.end)) {
          return event;
        }
      } else if (event.date) {
        if (isSameDate(date, event.date)) {
          return event;
        }
      }
    }
    return null;
  }

  function shouldSkipDate(date, targetDayOfWeek) {
    // Skip if it's a holiday
    if (isHoliday(date)) {
      return true;
    }

    // Skip if it's a special no-class event
    const specialEvent = isSpecialEvent(date);
    if (specialEvent && specialEvent.type === 'no_class') {
      return true;
    }

    return false;
  }

  function generateRRuleAndExceptions(event) {
    // Generate RRULE with EXDATE for holidays and makeup classes
    const startDate = event.startDate;
    const endDate = event.endDate;
    const targetDaysOfWeek = event.days;
    
    // Calculate total weeks
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.ceil(totalDays / 7);
    
    // Find the first occurrence date
    let firstOccurrence = new Date(startDate);
    while (!targetDaysOfWeek.includes(firstOccurrence.getDay())) {
      firstOccurrence.setDate(firstOccurrence.getDate() + 1);
    }
    
    // Generate all basic dates to find exceptions
    const basicDates = [];
    const exceptionDates = [];
    const makeupEvents = [];
    
    let currentDate = new Date(firstOccurrence);
    let weekCount = 0;
    
    while (currentDate <= endDate && weekCount < totalWeeks) {
      const dayOfWeek = currentDate.getDay();
      
      if (targetDaysOfWeek.includes(dayOfWeek)) {
        basicDates.push(new Date(currentDate));
        
        // Check if this date should be excluded (holiday)
        if (shouldSkipDate(currentDate, dayOfWeek)) {
          exceptionDates.push(new Date(currentDate));
        }
        
        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
        weekCount++;
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    // Find makeup classes
    let checkDate = new Date(startDate);
    while (checkDate <= endDate) {
      const makeupClass = isMakeupClassDay(checkDate);
      if (makeupClass && targetDaysOfWeek.includes(makeupClass.originalDay)) {
        makeupEvents.push({
          date: new Date(checkDate),
          originalDay: makeupClass.originalDay,
          note: `补${getChineseDayName(makeupClass.originalDay)}的课`
        });
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
    
    return {
      firstOccurrence,
      weekCount: Math.max(1, weekCount),
      dayOfWeek: firstOccurrence.getDay(),
      exceptionDates,
      makeupEvents
    };
  }
  
  function getDayName(dayOfWeek) {
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return days[dayOfWeek];
  }

  function getChineseDayName(dayOfWeek) {
    const names = ['日', '一', '二', '三', '四', '五', '六'];
    return names[dayOfWeek];
  }

  /**
   * Build ICS text from parsed data
   */
  function buildICS(parsed) {
    const lines = [];
    const now = new Date();
    const dtstamp = toUTCStringBasic(now);

    lines.push("BEGIN:VCALENDAR");
    lines.push("PRODID:-//" + APP_NAME + "//EN");
    lines.push("VERSION:2.0");
    lines.push("CALSCALE:GREGORIAN");
    
    // Add timezone definition
    lines.push("BEGIN:VTIMEZONE");
    lines.push("TZID:" + TZID);
    lines.push("BEGIN:STANDARD");
    lines.push("DTSTART:19700101T000000");
    lines.push("TZOFFSETFROM:+0800");
    lines.push("TZOFFSETTO:+0800");
    lines.push("TZNAME:CST");
    lines.push("END:STANDARD");
    lines.push("END:VTIMEZONE");

    // Group events by unique course to reduce file size
    // Use base course info without section to avoid duplicates
    const eventGroups = new Map();
    
    for (const ev of parsed.events) {
      // Build base summary without section for grouping
      let baseSummary = ev.courseCode || "课程";
      if (ev.component) {
        baseSummary += ` - ${ev.component}`;
      }
      // Don't include section in grouping key to merge similar courses
      
      const groupKey = `${baseSummary}|${ev.location}|${ev.instructor}|${ev.days.join(',')}`;
      if (!eventGroups.has(groupKey)) {
        eventGroups.set(groupKey, []);
      }
      eventGroups.get(groupKey).push(ev);
    }
    
    console.log(APP_NAME, `将 ${parsed.events.length} 个事件分组为 ${eventGroups.size} 组`);
    
    // Process each group using RRULE + EXDATE
    for (const [groupKey, events] of eventGroups) {
      // Prefer events with section info (more specific) over those without
      const representativeEvent = events.find(ev => ev.section) || events[0];
      
      // Generate RRULE and exceptions
      const rruleData = generateRRuleAndExceptions(representativeEvent);
      
      console.log(APP_NAME, `课程 "${representativeEvent.summary}": ${rruleData.weekCount} 周, ${rruleData.exceptionDates.length} 个例外, ${rruleData.makeupEvents.length} 个补课`);
      
      // Create main recurring event
      const dtStart = combineDateAndTime(rruleData.firstOccurrence, representativeEvent.startTime);
      const dtEnd = combineDateAndTime(rruleData.firstOccurrence, representativeEvent.endTime);
      
      lines.push("BEGIN:VEVENT");
      lines.push("UID:" + buildUID(representativeEvent, now, 0));
      lines.push("DTSTAMP:" + dtstamp + "Z");
      lines.push("DTSTART;TZID=" + TZID + ":" + toLocalStringBasic(dtStart));
      lines.push("DTEND;TZID=" + TZID + ":" + toLocalStringBasic(dtEnd));
      
      // Add RRULE
      const dayName = getDayName(rruleData.dayOfWeek);
      lines.push(`RRULE:FREQ=WEEKLY;COUNT=${rruleData.weekCount};BYDAY=${dayName}`);
      
      // Add EXDATE for holidays
      if (rruleData.exceptionDates.length > 0) {
        const exdates = rruleData.exceptionDates
          .map(date => toLocalStringBasic(combineDateAndTime(date, representativeEvent.startTime)))
          .join(",");
        lines.push(`EXDATE;TZID=${TZID}:${exdates}`);
      }
      
      lines.push("SUMMARY:" + escapeICSText(representativeEvent.summary));
      
      if (representativeEvent.location) {
        lines.push("LOCATION:" + escapeICSText(representativeEvent.location));
      }
      
      // Compact description
      let desc = [];
      if (representativeEvent.component) desc.push(`类型: ${representativeEvent.component}`);
      if (representativeEvent.instructor) desc.push(`讲师: ${representativeEvent.instructor}`);
      if (desc.length > 0) {
        lines.push("DESCRIPTION:" + escapeICSText(desc.join("\n")));
      }
      
      lines.push("END:VEVENT");
      
      // Add makeup events as separate events
      for (let i = 0; i < rruleData.makeupEvents.length; i++) {
        const makeupEvent = rruleData.makeupEvents[i];
        const makeupStart = combineDateAndTime(makeupEvent.date, representativeEvent.startTime);
        const makeupEnd = combineDateAndTime(makeupEvent.date, representativeEvent.endTime);
        
        lines.push("BEGIN:VEVENT");
        lines.push("UID:" + buildUID(representativeEvent, now, `makeup-${i}`));
        lines.push("DTSTAMP:" + dtstamp + "Z");
        lines.push("DTSTART;TZID=" + TZID + ":" + toLocalStringBasic(makeupStart));
        lines.push("DTEND;TZID=" + TZID + ":" + toLocalStringBasic(makeupEnd));
        lines.push("SUMMARY:" + escapeICSText(representativeEvent.summary + " (调课)"));
        
        if (representativeEvent.location) {
          lines.push("LOCATION:" + escapeICSText(representativeEvent.location));
        }
        
        let makeupDesc = [];
        if (representativeEvent.component) makeupDesc.push(`类型: ${representativeEvent.component}`);
        if (representativeEvent.instructor) makeupDesc.push(`讲师: ${representativeEvent.instructor}`);
        makeupDesc.push(`注: ${makeupEvent.note}`);
        
        lines.push("DESCRIPTION:" + escapeICSText(makeupDesc.join("\n")));
        lines.push("END:VEVENT");
      }
    }
    
    // Add special events (holidays, campus activities) - simplified
    addSpecialEventsToICS(lines, now, dtstamp);

    lines.push("END:VCALENDAR");
    
    console.log(APP_NAME, `生成的 ICS 内容长度: ${lines.join('\r\n').length} 字符`);
    return lines.join("\r\n");
  }

  function addSpecialEventsToICS(lines, now, dtstamp) {
    // Only add the most important events to keep file small
    const importantEvents = [
      { date: "2025-08-24", name: "本科生开学典礼" },
      { date: "2025-09-15", name: "秋冬学期课程开始" },
      { date: "2025-12-26", name: "课程结束" },
      { date: "2025-12-31", name: "浙江大学学生节" }
    ];
    
    for (const event of importantEvents) {
      lines.push("BEGIN:VEVENT");
      lines.push("UID:" + event.name.replace(/\s/g, '') + "@ps-calendar");
      lines.push("DTSTAMP:" + dtstamp + "Z");
      lines.push("DTSTART;VALUE=DATE:" + event.date.replace(/-/g, ''));
      lines.push("SUMMARY:" + escapeICSText(event.name));
      lines.push("TRANSP:TRANSPARENT");
      lines.push("END:VEVENT");
    }
  }

  function buildUID(ev, now, index = 0) {
    const base = [
      ev.courseCode || ev.summary,
      ev.component || "",
      ev.section || "",
      ev.location,
      ev.instructor,
      ev.days.join(""),
      index.toString()
    ].filter(Boolean).join("-");
    
    const hash = simpleHash(base);
    const timestamp = Math.floor(now.getTime() / 1000);
    return `${hash}-${timestamp}@${HOST_HINT}`;
  }

  function buildSpecialEventUID(event, now, date = null) {
    const base = [
      event.name,
      event.type || "",
      date ? toDateString(date) : toDateString(event.date || event.start)
    ].filter(Boolean).join("-");
    
    const hash = simpleHash(base);
    const timestamp = Math.floor(now.getTime() / 1000);
    return `special-${hash}-${timestamp}@${HOST_HINT}`;
  }

  function buildSuggestedFileName(parsed) {
    const termPart = parsed.termTitle || "课程表";
    const now = new Date();
    const datePart = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    return `${termPart}-${datePart}.ics`;
  }

  function triggerDownload(content, filename) {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Helper functions
  function cleanText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function combineDateAndTime(date, time) {
    const result = new Date(date);
    
    if (!time || typeof time !== 'object') {
      console.error(APP_NAME, "Invalid time object:", time);
      return result;
    }
    
    const hour = time.hour !== undefined ? time.hour : time.h;
    const minute = time.minute !== undefined ? time.minute : time.m;
    
    if (hour === undefined || minute === undefined || isNaN(hour) || isNaN(minute)) {
      console.error(APP_NAME, "Invalid time values:", { hour, minute, originalTime: time });
      return result;
    }
    
    result.setHours(Number(hour), Number(minute), 0, 0);
    return result;
  }

  function toLocalStringBasic(date) {
    return date.getFullYear() +
           (date.getMonth() + 1).toString().padStart(2, '0') +
           date.getDate().toString().padStart(2, '0') + 'T' +
           date.getHours().toString().padStart(2, '0') +
           date.getMinutes().toString().padStart(2, '0') +
           date.getSeconds().toString().padStart(2, '0');
  }

  function toUTCStringBasic(date) {
    return date.getUTCFullYear() +
           (date.getUTCMonth() + 1).toString().padStart(2, '0') +
           date.getUTCDate().toString().padStart(2, '0') + 'T' +
           date.getUTCHours().toString().padStart(2, '0') +
           date.getUTCMinutes().toString().padStart(2, '0') +
           date.getUTCSeconds().toString().padStart(2, '0');
  }

  function toDateString(date) {
    return date.getFullYear() +
           (date.getMonth() + 1).toString().padStart(2, '0') +
           date.getDate().toString().padStart(2, '0');
  }

  function foldLine(text) {
    // ICS line folding: max 75 octets per line
    if (!text) return "";
    
    // Escape special characters for better calendar compatibility
    text = escapeICSText(text);
    
    const maxLen = 73; // Leave room for CRLF
    if (text.length <= maxLen) return text;
    
    const lines = [];
    let pos = 0;
    while (pos < text.length) {
      if (pos === 0) {
        lines.push(text.substring(pos, pos + maxLen));
        pos += maxLen;
      } else {
        lines.push(" " + text.substring(pos, pos + maxLen - 1));
        pos += maxLen - 1;
      }
    }
    return lines.join("\r\n");
  }

  function escapeICSText(text) {
    if (!text) return "";
    
    // RFC 5545 compliant text escaping
    return text
      .replace(/\\/g, "\\\\")    // Escape backslashes first
      .replace(/,/g, "\\,")      // Escape commas
      .replace(/;/g, "\\;")      // Escape semicolons
      .replace(/\n/g, "\\n")     // Escape newlines  
      .replace(/\r/g, "");       // Remove carriage returns
  }
  
  function formatDescription(parts) {
    if (!parts || parts.length === 0) return "";
    return parts.join("\n");
  }

  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  function isDateInRange(date, start, end) {
    return date >= start && date <= end;
  }

  // Start the script
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }

})();
