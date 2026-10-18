const formatter: Intl.DateTimeFormatOptions = {day:'numeric', month: 'long', year:'numeric'};

function firstDayFromWeekNumber(year: number, week: number) {
    let firstDay = new Date(year, 0, 1);
    let dayOffset = 5 - firstDay.getDay();

    let firstThursday = new Date(firstDay.getTime() + 3600000 * 24 * dayOffset);

    let weekNumber = week;
    if (firstDay.getDay() >= 4){
        weekNumber -= 1;
    }

    let result = new Date(firstThursday.getTime() + (3600000 * 24) * (7*weekNumber - 0));

    return result;
}

export function getWeekDateStringFromYear(year: number, week: number): string {
    let firstDay = firstDayFromWeekNumber(year, week+1);
    let lastDay = new Date(firstDay.getTime() + 3600000 * 24 * 6);
    return firstDay.toLocaleDateString('default', formatter) + " au " + lastDay.toLocaleDateString('default', formatter);
}