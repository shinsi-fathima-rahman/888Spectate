function getNextLottoDraw(date) {
  const dateString = new Date(date);
  let nextDay, next1day, next2day, prev1day, prev2day, nextDayDate,
  dayOfWeek, dateArrayObject = [], dateArray = [], add;
  dayOfWeek = dateString.getDay();
  //depending upon the day entered, number to be added to find next Wednesday/Saturday
  switch (dayOfWeek) {
    case 0:
      add = 3;
      break;
    case 1:
      add = 2;
      break;
    case 2:
      add = 1;
      break;
    case 3:
      add = 3;
      break;
    case 4:
      add = 2;
      break;
    case 5:
      add = 1;
      break;
    case 6:
      add = 4;
      break;
  }
  nextDay = getnextPrevDay(dateString, add, "next");
  nextDayDate = new Date(nextDay);
  if (nextDayDate.getDay() == 3) {
    next1day = getnextPrevDay(nextDay, 3, "next");
    prev1day = getnextPrevDay(nextDay, 4, "previous");
  } else {
    next1day = getnextPrevDay(nextDay, 4, "next");
    prev1day = getnextPrevDay(nextDay, 3, "previous");
  }
  next2day = getnextPrevDay(nextDay, 7, "next");
  prev2day = getnextPrevDay(nextDay, 7, "previous");
  dateArray = [...dateArray, prev2day, prev1day, nextDay, next1day, next2day];
  /*** ALTERNATIVE APPROACH - if more than 3 future/past dates need to be calculated, would have to use a recursive/iterative approach.***/
  //add status of date (PAST OR FUTURE)
  let obj = {};
  dateArrayObject = dateArray.map(current => {
    let month = 1 + current.getMonth();
    month = month < 10 ? ("0" + month).slice(-2) : month;
    let day = current.getDate();
    day = day < 10 ? ("0" + day).slice(-2) : day;
    return {
      ...obj,
      date: month + '-' + day + '-' + current.getFullYear(),
      status: current < nextDay ? "PAST" : "FUTURE"
    };
  });
  formatTable(dateArrayObject);
}
function getnextPrevDay(date, dateDiff, action) {
  const month31 = [1, 3, 5, 7, 8, 10, 12];
  const monthFeb = 2;
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();
  if (action == "next") {
    //ending wednesday/satruday of the month
    //if(adding dateDiff exceeds 30 reset day to 1 and increment month)
    if (day + dateDiff >= 30) {
      //need to check specifically for February, since it can have 28/29 days
      if (month == monthFeb && day + dateDiff > 28) {
        //if leap year, then 29 days
        month++;
        if (year % 4 == 0) {
          day = dateDiff - (29 - day);
        } else {
          day = dateDiff - (28 - day);
        }
      } else if (month31.includes(month)) {
        //if month exceeds 12, need to reset month back to 1 and increment year
        if (month == 12) {
          year++;
          month = 1;
        } else {
          month++;
        }
        //balance days to be calculated for next month
        day = dateDiff - (31 - day);
      } /*for all other months*/ else {
        month++;
        day = dateDiff - (30 - day);
      }
    } /*increment normally, no boundary conditions*/ else {
      day = day + dateDiff;
    }
  } else {
    //starting wednesday/saturday of the month
    if (day - dateDiff <= 0) {
      //this should be not performed for August, since the previous month of August,=> July has 31 days
      if (month31.includes(month) && month !== 8) {
        /*check if Jan, need to decrement year then and set month to dec*/
        if (month == 1) {
          month = 12;
          year--;
          day = 31 - (dateDiff - day);
        } else {
          //March has to be handled seperately, since Feb can have 28/29 days depending on leap year
          if (month == 3) {
            if (year % 4 == 0) {
              day = 29 - (dateDiff - day);
            } else {
              day = 28 - (dateDiff - day);
            }
          } else {
            day = 30 - (dateDiff - day);
          }
          month--;
        }
      }
      //February will get handled here
      else {
        month--;
        day = 31 - (dateDiff - day);
      }
    }
    //For rest of the cases, decreent normally
    else {
      day = day - dateDiff;
    }
  }
  let string = month + "-" + day + "-" + year;
  return new Date(string);
}

function formatTable(tableData) {
  let table = document
    .getElementById("resultsTable")
    .getElementsByTagName("tbody")[0];
  for (let i = tableData.length - 1; i >= 0; i--) {
    let row = table.insertRow(0);
    row.classList.add("lotto__table-row");
    let firstCell = row.insertCell(0);
    let secondCell = row.insertCell(1);
    firstCell.innerHTML = tableData[i].date;
    secondCell.innerHTML = tableData[i].status;
  }
}
