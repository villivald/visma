var isWithinInterval = require("date-fns/isWithinInterval");
var eachWeekendOfInterval = require("date-fns/eachWeekendOfInterval");
var isSunday = require("date-fns/isSunday");
var isAfter = require("date-fns/isAfter");
var isBefore = require("date-fns/isBefore");
var eachMonthOfInterval = require("date-fns/eachMonthOfInterval");
var getMonth = require("date-fns/getMonth");
var formatDistanceStrict = require("date-fns/formatDistanceStrict");

// Suomen juhlapäivät 2020-2021 (tehtävänannon mukaan)
const finnishHolidays = [
  "1.1.2020",
  "1.6.2020",
  "4.10.2020",
  "4.13.2020",
  "5.1.2020",
  "5.21.2020",
  "6.19.2020",
  "12.24.2020",
  "12.25.2020",
  "01.01.2021",
  "1.6.2021",
  "4.2.2021",
  "4.5.2021",
  "5.13.2021",
  "6.20.2021",
  "12.6.2021",
  "12.24.2021",
];

const HolidayPlanner = (period) => {
  const interval = period.replace(/\s/g, "").split("-");
  let usedDays;
  let startVacationMonth;
  let endVacationMonth;
  let vacationMonths;

  // Tarkistetaan onko käyttäjän antama ajanjakso oikea, ja määritellään alku- ja loppukuukausi
  if (isBefore(new Date(interval[0]), new Date(interval[1]))) {
    vacationMonths = eachMonthOfInterval({
      start: new Date(interval[0]),
      end: new Date(interval[1]),
    });

    startVacationMonth = getMonth(vacationMonths[0]) + 1;
    endVacationMonth = getMonth(vacationMonths[vacationMonths.length - 1]) + 1;
  }

  // Lasketaan päivien määrää ajanjaksossa
  let daysInPeriod = formatDistanceStrict(
    new Date(interval[0]),
    new Date(interval[1]),
    {
      unit: "day",
      roundingMethod: "ceil",
    }
  ).split(" ")[0];

  console.log(daysInPeriod + " päivää ajanjaksossa");

  if (daysInPeriod > 50) {
    return "Loman pituus saa olla enintään 50 päivää";
  } else if (isAfter(new Date(interval[0]), new Date(interval[1]))) {
    return "Päivämäärät ovat väärässä järjestyksessä";
  } else if (startVacationMonth < 4 && endVacationMonth >= 4) {
    return "Koko ajanjakson on oltava saman loma-ajan sisällä, joka alkaa huhtikuun 1. päivänä ja päättyy ensi vuoden 31. maaliskuuta";
  } else {
    // Juhlapäiviä ajanjaksossa
    let holidaysInPeriod = [];

    finnishHolidays.forEach((date) =>
      holidaysInPeriod.push(
        isWithinInterval(new Date(date), {
          start: new Date(interval[0]),
          end: new Date(interval[1]),
        })
      )
    );

    let amountOfHolidaysInPeriod = holidaysInPeriod.filter(Boolean).length;
    console.log(amountOfHolidaysInPeriod + " juhlapäivää ajanjaksossa");

    // Sunnuntaita ajanjaksossa
    let weekendsInPeriod = eachWeekendOfInterval({
      start: new Date(interval[0]),
      end: new Date(interval[1]),
    });

    let sundaysInPeriod = [];

    weekendsInPeriod.forEach((date) =>
      sundaysInPeriod.push(isSunday(new Date(date)))
    );

    let amountOfSundaysInPeriod = sundaysInPeriod.filter(Boolean).length;
    console.log(amountOfSundaysInPeriod + " sunnuntaita ajanjaksossa");

    // Käytetyt päivät = Kaikki päivät - (juhlapäivät + sunnuntait)
    usedDays =
      daysInPeriod - (amountOfHolidaysInPeriod + amountOfSundaysInPeriod);

    return `Käytetään ${usedDays} lomapäivää`;
  }
};

// HUOM. päivämäärät mudossa MM.DD.YYYY - MM.DD.YYYY
let usedDays = HolidayPlanner("3.2.2020 - 3.20.2020");

console.log(usedDays);
