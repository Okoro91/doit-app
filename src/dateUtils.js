// dateUtils.js
import {
  format,
  formatDistance,
  formatRelative,
  isToday,
  isTomorrow,
  isYesterday,
  isThisWeek,
  isPast,
  addDays,
  startOfDay,
  endOfDay,
} from "date-fns";

export default class DateUtils {
  static formatDate(date, formatString = "MMM dd, yyyy") {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, formatString);
  }

  static formatRelativeDate(date) {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isToday(dateObj)) return "Today";
    if (isTomorrow(dateObj)) return "Tomorrow";
    if (isYesterday(dateObj)) return "Yesterday";

    return formatRelative(dateObj, new Date());
  }

  static formatTime(date) {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, "h:mm a");
  }

  static formatDateTime(date) {
    if (!date) return "";
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }

  static getRelativeTime(date) {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  }

  static isOverdue(date) {
    if (!date) return false;
    const dateObj = date instanceof Date ? date : new Date(date);
    return isPast(dateObj) && !isToday(dateObj);
  }

  static getDueStatus(date) {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isToday(dateObj)) return "today";
    if (isTomorrow(dateObj)) return "tomorrow";
    if (isThisWeek(dateObj)) return "this-week";
    if (this.isOverdue(dateObj)) return "overdue";
    return "future";
  }

  static getDateRangeForFilter(filter) {
    const today = startOfDay(new Date());

    switch (filter) {
      case "today":
        return { start: today, end: endOfDay(today) };
      case "tomorrow":
        return { start: addDays(today, 1), end: endOfDay(addDays(today, 1)) };
      case "week":
        return { start: today, end: endOfDay(addDays(today, 7)) };
      default:
        return null;
    }
  }
}
