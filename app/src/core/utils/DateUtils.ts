const formatter: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

const dayMilliseconds = 3600000 * 24;

// Return the number of week in the year
export function getNbWeekInYear(year: number) {
    let target = new Date(year, 11, 28);

    // Calculate first Thursday
    let dayNr = (target.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    let firstThursday = target.valueOf();

    // Move target to begining of year
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    
    return 1 + Math.ceil((firstThursday - target.getTime()) / (dayMilliseconds * 7));
}

// Return the first day of the on-call week (friday to thursday) from a passed year and week
export function firstDayFromWeekNumber(year: number, week: number) {
    // First day of year
    let firstDay = new Date(year, 0, 1);

    // Offset to Friday
    let dayOffset = 5 - firstDay.getDay();

    let firstFriday = new Date(firstDay.getTime() + dayMilliseconds * dayOffset);

    // Begin a week after if first day of year is after a thursday
    let weekNumber = week;
    if (firstDay.getDay() >= 5) {
        weekNumber += 1;
    }

    let result = new Date(firstFriday.getTime() + dayMilliseconds * (7 * weekNumber));

    return result;
}

// Return a string containing first and last day of on-call week
export function getWeekDateStringFromYear(year: number, week: number): string {
    let firstDay = firstDayFromWeekNumber(year, week);
    let lastDay = new Date(firstDay.getTime() + dayMilliseconds * 6);
    return firstDay.toLocaleDateString('default', formatter) + " au " + lastDay.toLocaleDateString('default', formatter);
}