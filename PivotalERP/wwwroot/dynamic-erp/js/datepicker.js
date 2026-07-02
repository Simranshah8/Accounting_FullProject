(function(root, returnDatepicker) {
    if (typeof exports === 'object') return module.exports = returnDatepicker();
    if (typeof define === 'function' && define.amd) return define(function() {return returnDatepicker()});
    return root.datepicker = returnDatepicker();
})(this, function() {
    'use strict';

    /*
      A small polyfill is only intended to satisfy
      the usage in this datepicker. #BecauseIE.
    */
    if (!Array.prototype.includes) {
        Array.prototype.includes = function(thing) {
            let found = false;
            this.forEach(item => {
                if (item === thing) found = true;
        });
        return found;
    }
}
  
  let datepickers = [];
const listeners = ['click', 'focusin', 'keydown', 'input'];
  
let dateStyle=1;
var bsCalenderData = {
    bsMonths: ["बैशाख", "जेठ", "असार", "सावन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पौष", "माघ", "फागुन", "चैत"],
    //bsDays: ["आईत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"],
    bsDays: ["आ", "सो", "मं", "बु", "बि", "शु", "श"],
    nepaliNumbers: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
    bsMonthUpperDays: [
        [30, 31],
        [31, 32],
        [31, 32],
        [31, 32],
        [31, 32],
        [30, 31],
        [29, 30],
        [29, 30],
        [29, 30],
        [29, 30],
        [29, 30],
        [30, 31]
    ],
    extractedBsMonthData: [
        [1, 3, 1, 22, 1, 3, 1, 3, 1, 22, 1, 3, 1, 19, 1, 3, 1, 1, 3],
        [0, 1, 2, 2, 2, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 1, 1, 1, 2, 2, 2, 2],
        [0, 1, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 2, 2, 1, 3],
        [29, 1, 26, 1, 28, 1, 2, 1, 2], [1, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 1, 1, 2, 2],
        [0, 8, 1, 3, 1, 3, 1, 18, 1, 3, 1, 3, 1, 18, 1, 3, 1, 3, 1, 20],
        [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 11],
        [1, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 2, 2, 2, 11],
        [0, 1, 3, 1, 14, 1, 3, 1, 3, 1, 3, 1, 18, 1, 3, 1, 3, 1, 3, 1, 14, 1, 3, 10],
        [1, 3, 1, 3, 1, 10, 1, 3, 1, 3, 1, 3, 1, 3, 1, 14, 1, 3, 1, 3, 1, 3, 1, 3, 1, 10, 1, 13],
        [0, 1, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 13]
    ],
    minBsYear: 2000,
    maxBsYear: 2090,
    minAdDateEqBsDate: {
        "ad": {
            "year": 1943, "month": 3, "date": 14
        },
        "bs": {
            "year": 2000, "month": 1, "date": 1
        }
    }
};
	
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const sides = {
    t: 'top',
    r: 'right',
    b: 'bottom',
    l: 'left'
};

var validationFunctions = {
    validateRequiredParameters: function (requiredParameters) 
    {					
        /*$.each(requiredParameters, function (key, value) {
            if (typeof value === "undefined" || value === null) {
                throw new ReferenceError("Missing required parameters: " + Object.keys(requiredParameters).join(", "));
            }
        });*/
    },
    validateBsYear: function (bsYear) {
        if (typeof bsYear !== "number" || bsYear === null) {
            throw new TypeError("Invalid parameter bsYear value");
        } else if (bsYear < bsCalenderData.minBsYear || bsYear > bsCalenderData.maxBsYear) {
            throw new RangeError("Parameter bsYear value should be in range of " + bsCalenderData.minBsYear + " to " + bsCalenderData.maxBsYear);
        }
    },
    validateBsMonth: function (bsMonth) {
        if (typeof bsMonth !== "number" || bsMonth === null) {
            throw new TypeError("Invalid parameter bsMonth value");
        } else if (bsMonth < 0 || bsMonth > 11) {
            throw new RangeError("Parameter bsMonth value should be in range of 0 to 11");
        }
    },
    validateBsDate: function (bsDate) {
        if (typeof bsDate !== "number" || bsDate === null) {
            throw new TypeError("Invalid parameter bsDate value");
        } else if (bsDate < 1 || bsDate > 32) {
            throw new RangeError("Parameter bsDate value should be in range of 1 to 32");
        }
    },
    validatePositiveNumber: function (numberParameters) {
        /* $.each(numberParameters, function (key, value) {
             if (typeof value !== "number" || value === null || value < 0) {
                 throw new ReferenceError("Invalid parameters: " + Object.keys(numberParameters).join(", "));
             } else if (key === "yearDiff" && value > (bsCalenderData.maxBsYear - bsCalenderData.minBsYear + 1)) {
                 throw new RangeError("Parameter yearDiff value should be in range of 0 to " + (bsCalenderData.maxBsYear - bsCalenderData.minBsYear + 1));
             }
         });*/
    }
};
	
var bsFunctions = {
	   	   
    getBsMonthInfoByBsDate: function (bsYear, bsMonth, bsDate, dateFormatPattern) {
        validationFunctions.validateRequiredParameters({"bsYear": bsYear, "bsMonth": bsMonth, "bsDate": bsDate});
        validationFunctions.validateBsYear(bsYear);
        validationFunctions.validateBsMonth(bsMonth);
        validationFunctions.validateBsDate(bsDate);
        if (dateFormatPattern === null) {
            dateFormatPattern = "%D, %M %d, %y";
        } else if (typeof dateFormatPattern != "string") {
            throw new TypeError("Invalid parameter dateFormatPattern value");
        }

        var daysNumFromMinBsYear = bsFunctions.getTotalDaysNumFromMinBsYear(bsYear, bsMonth, bsDate);
        var adDate = new Date(bsCalenderData.minAdDateEqBsDate.ad.year, bsCalenderData.minAdDateEqBsDate.ad.month, bsCalenderData.minAdDateEqBsDate.ad.date - 1);
        adDate.setDate(adDate.getDate() + daysNumFromMinBsYear);

        var bsMonthFirstAdDate = bsFunctions.getAdDateByBsDate(bsYear, bsMonth, 1);
        var bsMonthDays = bsFunctions.getBsMonthDays(bsYear, bsMonth);
        bsDate = (bsDate > bsMonthDays) ? bsMonthDays : bsDate;
        var eqAdDate = bsFunctions.getAdDateByBsDate(bsYear, bsMonth, bsDate);
        var weekDay = eqAdDate.getDay();
        var formattedDate = bsFunctions.bsDateFormat(dateFormatPattern, bsYear, bsMonth, bsDate, weekDay);
        return {
            bsYear: bsYear,
            bsMonth: bsMonth,
            bsDate: bsDate,
            weekDay: weekDay,
            formattedDate: formattedDate,
            adDate: eqAdDate,
            bsMonthFirstAdDate: bsMonthFirstAdDate,
            bsMonthDays: bsMonthDays
        };
    },
    getAdDateByBsDate: function (bsYear, bsMonth, BsDate) {
        var daysNumFromMinBsYear = bsFunctions.getTotalDaysNumFromMinBsYear(bsYear, bsMonth, BsDate);
        var adDate = new Date(bsCalenderData.minAdDateEqBsDate.ad.year, bsCalenderData.minAdDateEqBsDate.ad.month, bsCalenderData.minAdDateEqBsDate.ad.date - 1);
        adDate.setDate(adDate.getDate() + daysNumFromMinBsYear);
        return adDate;
    },
    getTotalDaysNumFromMinBsYear: function (bsYear, bsMonth, bsDate) {
        if (bsYear < bsCalenderData.minBsYear || bsYear > bsCalenderData.maxBsYear) {
            return null;
        }

        var daysNumFromMinBsYear = 0;
        var diffYears = bsYear - bsCalenderData.minBsYear;
        for (var monthIndex = 0; monthIndex < 12; monthIndex++) {
            if (monthIndex < bsMonth) {
                daysNumFromMinBsYear += bsFunctions.getMonthDaysNumFormMinBsYear(monthIndex, diffYears + 1);
            } else {
                daysNumFromMinBsYear += bsFunctions.getMonthDaysNumFormMinBsYear(monthIndex, diffYears);
            }
        }

        if (bsYear > 2085 && bsYear < 2088) {
            daysNumFromMinBsYear += bsDate - 2;
        } else if (bsYear > 2088 && bsMonth > 4) {
            daysNumFromMinBsYear += bsDate - 4;
        } else {
            daysNumFromMinBsYear += bsDate;
        }

        return daysNumFromMinBsYear;
    },
    /**
     * Return total number of bsMonth days from minYear
     * @param {Integer} bsMonth
     * @param {integer} yearDiff
     * @returns {number}
     */
    getMonthDaysNumFormMinBsYear: function (bsMonth, yearDiff) {
        validationFunctions.validateRequiredParameters({"bsMonth": bsMonth, "yearDiff": yearDiff});
        validationFunctions.validateBsMonth(bsMonth);
        validationFunctions.validatePositiveNumber({"yearDiff": yearDiff});

        var yearCount = 0;
        var monthDaysFromMinBsYear = 0;
        if (yearDiff === 0) {
            return 0;
        }

        var bsMonthData = bsCalenderData.extractedBsMonthData[bsMonth];
        for (var i = 0; i < bsMonthData.length; i++) {
            if (bsMonthData[i] === 0) {
                continue;
            }

            var bsMonthUpperDaysIndex = i % 2;
            if (yearDiff > yearCount + bsMonthData[i]) {
                yearCount += bsMonthData[i];
                monthDaysFromMinBsYear += bsCalenderData.bsMonthUpperDays[bsMonth][bsMonthUpperDaysIndex] * bsMonthData[i];
            } else {
                monthDaysFromMinBsYear += bsCalenderData.bsMonthUpperDays[bsMonth][bsMonthUpperDaysIndex] * (yearDiff - yearCount);
                yearCount = yearDiff - yearCount;
                break;
            }
        }

        return monthDaysFromMinBsYear;
    },
    /**
     * Return number of bsMonth days
     * @param {Integer} bsYear
     * @param {Integer} bsMonth
     * @returns {int} days
     */
    getBsMonthDays: function (bsYear, bsMonth) {
        validationFunctions.validateRequiredParameters({"bsYear": bsYear, "bsMonth": bsMonth});
        validationFunctions.validateBsYear(bsYear);
        validationFunctions.validateBsMonth(bsMonth);

        var yearCount = 0;
        var totalYears = (bsYear + 1) - bsCalenderData.minBsYear;
        var bsMonthData = bsCalenderData.extractedBsMonthData[bsMonth];
        for (var i = 0; i < bsMonthData.length; i++) {
            if (bsMonthData[i] === 0) {
                continue;
            }

            var bsMonthUpperDaysIndex = i % 2;
            yearCount += bsMonthData[i];
            if (totalYears <= yearCount) {
                if ((bsYear == 2085 && bsMonth == 4) || (bsYear == 2088 && bsMonth == 4)) {
                    return bsCalenderData.bsMonthUpperDays[bsMonth][bsMonthUpperDaysIndex] - 2;
                } else {
                    return bsCalenderData.bsMonthUpperDays[bsMonth][bsMonthUpperDaysIndex];
                }
            }
        }

        return null;
    },
    getBsDateByAdDate: function (adYear, adMonth, adDate) {
        var bsYear = adYear + 57;
        var bsMonth = (adMonth + 9 ) % 12;
        var bsDate = 1;

        if (adMonth < 3) {
            bsYear -= 1;
        } else if (adMonth == 3) {
            var bsYearFirstAdDate = bsFunctions.getAdDateByBsDate(bsYear, 1, 1);
            if (adDate < bsYearFirstAdDate.getDate()) {
                bsYear -= 1;
            }
        }

        var bsMonthFirstAdDate = bsFunctions.getAdDateByBsDate(bsYear, bsMonth, 1);
        if (adDate >= 1 && adDate < bsMonthFirstAdDate.getDate()) {
            bsMonth = (bsMonth !== 0) ? bsMonth - 1 : 11;
            var bsMonthDays = bsFunctions.getBsMonthDays(bsYear, bsMonth);
            bsDate = bsMonthDays - (bsMonthFirstAdDate.getDate() - adDate) + 1;
        } else {
            bsDate = adDate - bsMonthFirstAdDate.getDate() +1;
        }

        return {
            bsYear: bsYear,
            bsMonth: bsMonth,
            bsDate: bsDate
        };
    },
    getBsYearByAdDate: function (adYear, adMonth, adDate) {
        var bsDate = bsFunctions.getBsDateByAdDate(adYear, adMonth, adDate);
        return bsDate.bsYear;
    },
    getBsMonthByAdDate: function (adYear, adMonth, adDate) {
        var bsDate = bsFunctions.getBsDateByAdDate(adYear, adMonth, adDate);
        return bsDate.bsMonth;
    },
    padLeft: function padLeft(nr, n, str)
    {
        return Array(n-String(nr).length+1).join(str||'0')+nr;
    },
    bsDateFormat: function (dateFormatPattern, bsYear, bsMonth, bsDate, day) {
        var formattedDate = dateFormatPattern;
			
        formattedDate = formattedDate.replace(/%d/g, bsFunctions.padLeft(bsDate,2));
        formattedDate = formattedDate.replace(/%y/g, bsYear);
        formattedDate = formattedDate.replace(/%m/g, bsFunctions.padLeft(bsMonth,2));
        formattedDate = formattedDate.replace(/%M/g, bsCalenderData.bsMonths[bsMonth-1]);
        formattedDate = formattedDate.replace(/%D/g, bsCalenderData.bsDays[day]);
        return formattedDate;
    },
    parseFormattedBsDate: function (dateFormat, dateFormattedText) {
        var diffTextNum = 0;
        var extractedFormattedBsDate = {
            "bsYear": null,
            "bsMonth": null,
            "bsDate": null,
            "bsDay": null
        };

        for (var i = 0; i < dateFormat.length; i++) {
            if (dateFormat.charAt(i) == '%') {
                var valueOf = dateFormat.substring(i, i + 2);
                var endChar = dateFormat.charAt(i + 2);
                var tempText = dateFormattedText.substring(i + diffTextNum);
                var endIndex = (endChar !== '') ? tempText.indexOf(endChar) : tempText.length;
                var value = tempText.substring(0, endIndex);

                if (valueOf == "%y") {
                    extractedFormattedBsDate.bsYear = parseInt(value);
                    diffTextNum += value.length - 2;
                } else if (valueOf == "%d") {
                    extractedFormattedBsDate.bsDate = parseInt(value);
                    diffTextNum += value.length - 2;
                } else if (valueOf == "%D") {
                    extractedFormattedBsDate.bsDay = bsDays.indexOf(parseInt(value));
                    diffTextNum += value.length - 2;
                } else if (valueOf == "%m") {
                    extractedFormattedBsDate.bsMonth =parseInt(value);
                    diffTextNum += value.length - 2;
                } else if (valueOf == "%M") {
                    extractedFormattedBsDate.bsMonth = bsMonths.indexOf(parseInt(value));
                    diffTextNum += value.length - 2;
                }
            }
        }

        return extractedFormattedBsDate;
    }
}
/*
 *
 */
function Datepicker(selector, options) {
       
    const el = selector.split ? document.querySelector(selector) : selector;
      
    options = sanitizeOptions(options || defaults(), el, selector);

    const parent = (options.parent || el.parentElement );
    const calendar = document.createElement('div');
    const { startDate, dateSelected ,startDateBS, dateSelectedBS,dateFormat } = options;
const noPosition = el === document.body || el === document.querySelector('html');
const instance = {
    // The calendar will be positioned relative to this element (except when 'body' or 'html').
    el: el,

    // The element that datepicker will be attached to.
    parent:parent,

    // Indicates whether to use an <input> element or not as the calendar's anchor.
    nonInput: el.nodeName !== 'INPUT',

    // Flag indicating if `el` is 'body' or 'html' for `calculatePosition`.
    noPosition: noPosition,

    // Calendar position relative to `el`.
    position: noPosition ? false : options.position,

    // Date obj used to indicate what month to start the calendar on.
    startDate: startDate,
	  
    startDateBS: startDateBS,
	  
    // Starts the calendar with a date selected.
    dateSelected: dateSelected,
	  
    dateSelectedBS: (dateSelected ?  bsFunctions.getBsDateByAdDate(dateSelected.getFullYear(), dateSelected.getMonth(), dateSelected.getDate()) : dateSelectedBS),

    // Low end of selectable dates.
    minDate: options.minDate,

    // High end of selectable dates.
    maxDate: options.maxDate,

    // Disabled the ability to select days on the weekend.
    noWeekends: !!options.noWeekends,

    // The element our calendar is constructed in.
    calendar: calendar,

    // Month of `startDate` or `dateSelected` (as a number).
    currentMonth: (options.dateStyle==2 ? (startDateBS || dateSelectedBS).bsMonth : (startDate || dateSelected).getMonth()),
	  	  
    // Month name in plain english - or not.	  
    currentMonthName: (options.dateStyle==2 ? (options.bsMonths || bsCalenderData.bsMonths)[(startDateBS || dateSelectedBS).bsMonth] : (options.months || months)[(startDate || dateSelected).getMonth()]),
	  
    // Year of `startDate` or `dateSelected`.
    currentYear: (options.dateStyle==2 ?  (startDateBS || dateSelectedBS).bsYear : (startDate || dateSelected).getFullYear() ),

    // Method to programatically set the calendar's date.
    setDate: setDate,

    // Method to programatically reset the calendar.
    reset: reset,

    // Method that removes the calendar from the DOM along with associated events.
    remove: remove,

    // Callback fired when a date is selected - triggered in `selectDay`.
    onSelect: options.onSelect,

    // Callback fired when the calendar is shown - triggered in `showCal`.
    onShow: options.onShow,

    // Callback fired when the calendar is hidden - triggered in `hideCal`.
    onHide: options.onHide,

    // Callback fired when the month is changed - triggered in `changeMonthYear`.
    onMonthChange: options.onMonthChange,

    // Function to customize the date format updated on <input> elements - triggered in `setElValues`.
    formatter: options.formatter,

    onDateChange: options.onDateChange,

    // Labels for months - custom or default.
    months: (options.dateStyle==2 ? options.bsMonths|| bsCalenderData.bsMonths : options.months || months),

    // Labels for days - custom or default.
    days: (options.dateStyle==2 ? options.bsDays || bsCalenderData.bsDays : options.customDays || days),

    // Start day of the week - indexed from `days` above.
    startDay: options.startDay,

    // Custom overlay placeholder.
    overlayPlaceholder: options.overlayPlaceholder || '4-digit year',

    // Custom overlay submit button.
    overlayButton: options.overlayButton || 'Submit',

    // Disable the datepicker on mobile devices.
    // Allows the use of native datepicker if the input type is 'date'.
    disableMobile: options.disableMobile,

    // Used in conjuntion with `disableMobile` above within `oneHandler`.
    isMobile: 'ontouchstart' in window,
	  
    dateStyle: options.dateStyle,
	  
    dateFormat: options.dateFormat
};
	

// Initially populate the <input> field / set attributes on the `el`.
if (dateSelected) setElValues(el, instance,true);

calendar.classList.add('qs-datepicker');
calendar.classList.add('qs-hidden');
datepickers.push(el);
calendarHtml(startDate || dateSelected, startDateBS || dateSelectedBS, instance);
	
//el.inputmask('yyyy-mm-dd', { "placeholder": 'YYYY-MM-DD', "oncomplete": OnTextChange.bind(instance) });
el.addEventListener('change',OnTextChange.bind(instance));
  
	
listeners.forEach(e => { // Declared at the top.
    window.addEventListener(e, oneHandler.bind(instance));
});


if (getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
}

parent.appendChild(calendar);

return instance;
}

function OnTextChange(e)
{
	
		    
    try
    {
        const { type, path, target } = e;
    const { calendar, el } = this;	  

var dtEx=bsFunctions.parseFormattedBsDate(this.dateFormat,el.value);

if(this.dateStyle==2)
{
    let nDate=bsFunctions.getAdDateByBsDate(dtEx.bsYear,(dtEx.bsMonth-1),dtEx.bsDate);
    this.setDate(new Date(nDate.getFullYear(),nDate.getMonth(),nDate.getDate()),null,true);
}
else
{
    var nDate=new Date(dtEx.bsYear,(dtEx.bsMonth-1),dtEx.bsDate);
    this.setDate(nDate,null,true);
}
		    
}catch(e)
{
    //alert(e.message);
}		    
		
}
/*
 *  Will run checks on the provided options object to ensure correct types.
 *  Returns an options object if everything checks out.
 */
function sanitizeOptions(options, el) {
    // Check if the provided element already has a datepicker attached.
    if (datepickers.includes(el)) throw new Error('A datepicker already exists on that element.');

    let {
      position,
      maxDate,
      minDate,
      dateSelected,
      formatter,
      onDateChange,
      customMonths,
      customDays,
      overlayPlaceholder,
      overlayButton,
      startDay,
	  dateStyle,
	  dateFormat
} = options;

// Ensure the accuracy of `options.position` & call `establishPosition`.
if (position) {
    const found = ['tr', 'tl', 'br', 'bl'].some(dir => position === dir);
    const msg = '"options.position" must be one of the following: tl, tr, bl, or br.';

    if (!found) throw new Error(msg);
    options.position = establishPosition(position);
} else {
    options.position = establishPosition('bl');
}

// Check that various options have been provided a JavaScript Date object.
// If so, strip the time from those dates (for accurate future comparisons).
['startDate', 'dateSelected', 'minDate', 'maxDate'].forEach(date => {
    if (options[date]) {
    if (!dateCheck(options[date]) || isNaN(+options[date])) {
        throw new TypeError(`"options.${date}" needs to be a valid JavaScript Date object.`);
    }

// Strip the time from the date.
options[date] = stripTime(options[date]);
}
});

options.startDate = options.startDate || options.dateSelected || stripTime(new Date());
options.startDateBS=bsFunctions.getBsDateByAdDate(options.startDate.getFullYear(), options.startDate.getMonth(), options.startDate.getDate()),
options.formatter = typeof formatter === 'function' ? formatter : null;
options.onDateChange=typeof onDateChange === 'function' ? onDateChange : null;

options.dateStyle= options.dateStyle;
options.dateFormat=options.dateFormat || '%y-%m-%d';
	
if (maxDate < minDate) {
    throw new Error('"maxDate" in options is less than "minDate".');
}

if (dateSelected) {
    if (minDate > dateSelected) {
        throw new Error('"dateSelected" in options is less than "minDate".');
    }

    if (maxDate < dateSelected) {
        throw new Error('"dateSelected" in options is greater than "maxDate".');
    }
}

// Callbacks.
['onSelect', 'onShow', 'onHide', 'onMonthChange'].forEach(fxn => {
    options[fxn] = typeof options[fxn] === 'function' && options[fxn];
});


// Custom labels for months & days.
[customMonths, customDays].forEach((custom, i) => {
    if (!custom) return;

const errorMsgs = [
  '"customMonths" must be an array with 12 strings.',
  '"customDays" must be an array with 7 strings.'
];
const wrong = (
  ({}).toString.call(custom) !== '[object Array]' ||
  custom.length !== (i ? 7 : 12)
);

if (wrong) throw new Error(errorMsgs[i]);

options[i ? 'days' : 'months'] = custom;
});

// Adjust days of the week for user-provided start day.
if (startDay !== undefined && +startDay && +startDay > 0 && +startDay < 7) {
    let daysCopy = (options.customDays || days).slice();
    const chunk = daysCopy.splice(0, startDay);
    options.customDays = daysCopy.concat(chunk);
    options.startDay = +startDay;
} else {
    options.startDay = 0;
}

// Custom text for overlay placeholder & button.
[overlayPlaceholder, overlayButton].forEach((thing, i) => {
    if (thing && thing.split) {
    if (i) { // Button.
        options.overlayButton = thing;
    } else { // Placeholder.
          options.overlayPlaceholder = thing;
}
}
});

return options;
}

/*
 *  Returns an object containing all the default settings.
 */
function defaults() {
    return {
        dateFormat:'%y-%m-%d',
        startDate: stripTime(new Date()),
        startDateBS: bsFunctions.getBsDateByAdDate(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
        position: 'bl',
        dateStyle:1
    };
}

/*
 *  Returns an object representing the position of the calendar
 *  relative to the calendar's <input> element.
 */
function establishPosition(position) {
    const obj = {};

    obj[sides[position[0]]] = 1;
    obj[sides[position[1]]] = 1;

    return obj;
}

/*
 *  Populates `calendar.innerHTML` with the contents
 *  of the calendar controls, month, and overlay.
 */
function calendarHtml(date,dateBS, instance) {
    const controls = createControls(date,dateBS, instance);
    const month = createMonth(date,dateBS, instance);
    const overlay = createOverlay(instance);
    instance.calendar.innerHTML = controls + month + overlay;
}

/*
 *  Creates the calendar controls.
 *  Returns a string representation of DOM elements.
 */
function createControls(date,dateBS, instance) {
    return `
    <div class="qs-controls">
      <div class="qs-arrow qs-left"></div>
      <div class="qs-month-year">
        <span class="qs-month">${instance.months[(instance.dateStyle==2 ? dateBS.bsMonth : date.getMonth())]}</span>
        <span class="qs-year">${(instance.dateStyle==2 ? dateBS.bsYear : date.getFullYear() )}</span>
      </div>
      <div class="qs-arrow qs-right"></div>
    </div>
  `;
}

/*
 *  Creates the calendar month structure.
 *  Returns a string representation of DOM elements.
 */
function createMonth(date,dateBS, instance) {
    const {
      minDate,
      maxDate,
      dateSelected,
	  dateSelectedBS,
      currentYear,
      currentMonth,
      noWeekends,
      days
    } = instance;

// Same year, same month?
const today = new Date();		
const todayBS=bsFunctions.getBsDateByAdDate(today.getFullYear(), today.getMonth(), today.getDate());	
const isThisMonth=(instance.dateStyle==2 ?  (todayBS.bsYear==dateBS.bsYear && todayBS.bsMonth==dateBS.bsMonth) : (today.toJSON().slice(0, 7) === date.toJSON().slice(0, 7)) );
	
const bsDateInfo=bsFunctions.getBsMonthInfoByBsDate(dateBS.bsYear,dateBS.bsMonth,dateBS.bsDate,instance.dateFormat);
	
// Calculations for the squares on the calendar.
const copy =(instance.dateStyle==2  ? bsDateInfo.bsMonthFirstAdDate : new Date(new Date(date).setDate(1)));	
const offset = copy.getDay() - instance.startDay; // Preceding empty squares.
const precedingRow = offset < 0 ? 7 : 0; // Offsetting the start day may move back to a new 1st row.	
	
if(instance.dateStyle==2)
{
    copy.setDate(copy.getDate()+bsDateInfo.bsMonthDays);		
}else{
    copy.setMonth(copy.getMonth() + 1);	
    copy.setDate(0); // Last day in the current month.
}
	
    
const daysInMonth =(instance.dateStyle==2 ? bsDateInfo.bsMonthDays : copy.getDate() ); // Squares with a number.

// Will contain string representations of HTML for the squares.
const calendarSquares = [];

// Fancy calculations for the total # of squares.
let totalSquares = precedingRow + (((offset + daysInMonth) / 7 | 0) * 7);
totalSquares += (offset + daysInMonth) % 7 ? 7 : 0;

// If the offest happens to be 0 but we did specify a `startDay`,
// add 7 to prevent a missing row at the end of the calendar.
if (instance.startDay !== 0 && offset === 0) totalSquares += 7;

for (let i = 1; i <= totalSquares; i++) {
    const weekday = days[(i - 1) % 7];
    const num = i - (offset >= 0 ? offset : (7 + offset));
    const thisDay = (instance.dateStyle==2 ? bsFunctions.getAdDateByBsDate(currentYear,currentMonth, num) : new Date(currentYear, currentMonth, num));
    const isEmpty = num < 1 || num > daysInMonth;
    let otherClass = '';
    let span = `<span class="qs-num">${num}</span>`;

    // Empty squares.
    if (isEmpty) {
        otherClass = 'qs-empty';
        span = '';

        // Disabled & current squares.
    } else {
        let disabled = (minDate && thisDay < minDate) || (maxDate && thisDay > maxDate);
        const sat = days[6];
        const sun = days[0];
        const weekend = weekday === sat || weekday === sun;
        const currentValidDay = isThisMonth && !disabled &&  num === (instance.dateStyle==2 ? todayBS.bsDate : today.getDate());

        disabled = disabled || (noWeekends && weekend);
        otherClass = disabled ? 'qs-disabled' : currentValidDay ? 'qs-current' : '';
    }

    // Currently selected day.
    if (+thisDay === +dateSelected && !isEmpty) otherClass += ' qs-active';

    calendarSquares.push(`<div class="qs-square qs-num ${weekday} ${otherClass}">${span}</div>`);
}

// Add the header row of days of the week.
const daysAndSquares = days.map(day => {
    return `<div class="qs-square qs-day">${day}</div>`;
}).concat(calendarSquares);

// Throw error...
// The # of squares on the calendar should ALWAYS be a multiple of 7.
if (daysAndSquares.length % 7 !== 0 ) {
    const msg = 'Calendar not constructed properly. The # of squares should be a multiple of 7.';
    throw new Error(msg);
}

// Wrap it all in a tidy div.
daysAndSquares.unshift('<div class="qs-squares">');
daysAndSquares.push('</div>');
return daysAndSquares.join('');
}

/*
 *  Creates the overlay for users to
 *  manually navigate to a month & year.
 */
function createOverlay(instance) {
    const { overlayPlaceholder, overlayButton } = instance;

return `
<div class="qs-overlay qs-hidden">
  <div class="qs-close">&#10005;</div>
  <input type="number" class="qs-overlay-year" placeholder="${overlayPlaceholder}" />
  <div class="qs-submit qs-disabled">${overlayButton}</div>
</div>
    `;
}

/*
 *  Highlights the selected date.
 *  Calls `setElValues`.
 */
function selectDay(target, instance) {
    const { currentMonth, currentYear, calendar, el, onSelect } = instance;
const active = calendar.querySelector('.qs-active');
const num = parseInt(target.textContent);

// Keep track of the currently selected date.	
if(instance.dateStyle==2)
{
    instance.dateSelected = bsFunctions.getAdDateByBsDate(currentYear, currentMonth, num);
    instance.dateSelectedBS={ bsYear:currentYear,bsMonth:currentMonth,bsDate:num };
}else
{
    instance.dateSelected = new Date(currentYear, currentMonth, num);
    instance.dateSelectedBS=bsFunctions.getBsDateByAdDate(currentYear, currentMonth,num);		
}
	
	

// Re-establish the active (highlighted) date.
if (active) active.classList.remove('qs-active');
target.classList.add('qs-active');

// Populate the <input> field (or not) with a readble value
// and store the individual date values as attributes.
setElValues(el, instance,true);

// Hide the calendar after a day has been selected.
hideCal(instance);

// Call the user-provided `onSelect` callback.
onSelect && onSelect(instance);
}

/*
 *  Populates the <input> fields with a readble value
 *  and stores the individual date values as attributes.
 */
function setElValues(el, instance,canChange) {
    if (instance.nonInput) return;
    if (instance.formatter) return instance.formatter(el, instance.dateSelected,instance.dateSelectedBS);
	
    var weekDay = instance.dateSelected.getDay();
    if(instance.dateStyle==2)
    {		 
        el.value = bsFunctions.bsDateFormat(instance.dateFormat,instance.dateSelectedBS.bsYear,instance.dateSelectedBS.bsMonth+1,instance.dateSelectedBS.bsDate,weekDay);
    }
    else
        el.value = bsFunctions.bsDateFormat(instance.dateFormat,instance.dateSelected.getFullYear(),instance.dateSelected.getMonth()+1,instance.dateSelected.getDate(),weekDay);
	
    if (instance.onDateChange && canChange) 
        instance.onDateChange(el, instance.dateSelected,instance.dateSelectedBS);
}

/*
 *  2 Scenarios:
 *
 *  Updates `this.currentMonth` & `this.currentYear` based on right or left arrows.
 *  Creates a `newDate` based on the updated month & year.
 *  Calls `calendarHtml` with the updated date.
 *
 *  Changes the calendar to a different year
 *  from a users manual input on the overlay.
 *  Calls `calendarHtml` with the updated date.
 */
function changeMonthYear(classList, instance, year) {
    // Overlay.
    if (year) {
        instance.currentYear = year;

        // Month change.
    } else {
        instance.currentMonth += classList.contains('qs-right') ? 1 : -1;

        // Month = 0 - 11
        if (instance.currentMonth === 12) {
            instance.currentMonth = 0;
            instance.currentYear++
        } else if (instance.currentMonth === -1) {
            instance.currentMonth = 11;
            instance.currentYear--;
        }
    }

    let newDate;
    let newDateBS;
	
	
    if(instance.dateStyle==2)
    {
        newDate = bsFunctions.getAdDateByBsDate(instance.currentYear, instance.currentMonth, 1);
        newDateBS ={ bsYear:instance.currentYear,bsMonth: instance.currentMonth,bsDate:1 };
		
    }else
    {
        newDate = new Date(instance.currentYear, instance.currentMonth, 1);
        newDateBS =bsFunctions.getBsDateByAdDate(instance.currentYear,instance.currentMonth,1);		
    }
	
    calendarHtml(newDate,newDateBS, instance);
    instance.currentMonthName = instance.months[instance.currentMonth-1];
    instance.onMonthChange && year && instance.onMonthChange(instance);
}

/*
 *  Sets the `style` attribute on the calendar after doing calculations.
 */
function calculatePosition(instance) {
    // Don't position the calendar in reference to the <body> or <html> elements.
    if (instance.noPosition) return;

    const { el, calendar, position, parent } = instance;
const { top, right } = position;

const parentRect = parent.getBoundingClientRect();
const elRect = el.getBoundingClientRect();
const calRect = calendar.getBoundingClientRect();
const offset = elRect.top - parentRect.top + parent.scrollTop;

const style = `
    top:${offset - (top ? calRect.height : (elRect.height * -1))}px;
left:${elRect.left - parentRect.left + (right ? elRect.width - calRect.width : 0)}px;
    `;

calendar.setAttribute('style', style);
}

  
/*
 *  Method that programatically sets the date.
 */
function setDate(date, reset,canChange) {

    if(!date)
    {
        this.dateSelected=null;
        this.dateSelectedBS=null;
        this.el.value = '';
        return;
    }
            

    if(isNaN(date.valueOf())) return;
        
    if (!dateCheck(date)) throw new TypeError('`setDate` needs a JavaScript Date object.');
    date = stripTime(date); // Remove the time.
    const dateBS=bsFunctions.getBsDateByAdDate(date.getFullYear(),date.getMonth(),date.getDate());

    if(this.dateStyle==2)
    {
        this.currentYear = dateBS.bsYear;
        this.currentMonth = dateBS.bsMonth;
        this.currentMonthName = this.months[dateBS.bsMonth];		
    }else
    {
        this.currentYear = date.getFullYear();
        this.currentMonth = date.getMonth();
        this.currentMonthName = this.months[date.getMonth()];		
    }
    
    this.dateSelected = reset ? undefined : date;	
    this.dateSelectedBS = reset ? undefined : dateBS;	
    !reset && setElValues(this.el, this,canChange);
    calendarHtml(date,dateBS, this);
    if (reset) this.el.value = '';
}
  
function reset() {
    this.setDate(this.startDate,null, true);
}

function dateCheck(date) {
    return ({}).toString.call(date) === '[object Date]';
}

/*
 *  Takes a date and returns a date stripped of its time (hh:mm:ss:ms).
 */
function stripTime(date) {
    return new Date(date.toDateString());
}

/*
 *  Removes all event listeners added by the constructor.
 *  Removes the current instance from the array of instances.
 */
function remove() {
    const { calendar, parent, el } = this;

// Remove event listeners (declared at the top).
listeners.forEach(e => {
    window.removeEventListener(e, oneHandler);
});

calendar.remove();

// Remove styling done to the parent element.
if (calendar.hasOwnProperty('parentStyle')) parent.style.position = '';

// Remove this datepicker's `el` from the list.
datepickers = datepickers.filter(dpEl => dpEl !== el);
}

/*
 *  Hides the calendar and calls the `onHide` callback.
 */
function hideCal(instance) {
    instance.calendar.classList.add('qs-hidden');
    instance.onHide && instance.onHide(instance);
}

/*
 *  Shows the calendar and calls the `onShow` callback.
 */
function showCal(instance) {
    instance.calendar.classList.remove('qs-hidden');
    calculatePosition(instance);
    instance.onShow && instance.onShow(instance);
}


/////////////////////
// EVENT FUNCTIONS //
/////////////////////

/*
 *  Handles `click` events when the calendar's `el` is an <input>.
 *  Handles `focusin` events for all other types of `el`'s.
 *  Handles `keyup` events when tabbing.
 *  Handles `input` events for the overlay.
 */
function oneHandler(e) {
      
    if (this.isMobile && this.disableMobile) return;

    // Add `e.path` if it doesn't exist.
    if (!e.path) {
        let node = e.target;
        let path = [];

        while (node !== document) {
            path.push(node);
            node = node.parentNode;
        }      
        e.path = path;
    }

    const { type, path, target } = e;    
const { calendar, el } = this;

    
const calClasses = calendar.classList;
const hidden = calClasses.contains('qs-hidden');
const onCal = path.includes(calendar);

            
    
// Enter, ESC, or tabbing.
if (type === 'keydown') {
    const overlay = calendar.querySelector('.qs-overlay');

    // Pressing enter while the overlay is open.
    if (e.which === 13 && !overlay.classList.contains('qs-hidden')) {
        e.stopPropagation(); // Avoid submitting <form>'s.
         
        return overlayYearEntry(e, target, this);

        // ESC key pressed.
    } else if (e.which === 27) {
        return toggleOverlay(calendar, true, this);

        // Tabbing.
    } else if (e.which !== 9) {
         
        return;
    }
}

// Only pay attention to `focusin` events if the calendar's el is an <input>.
// `focusin` bubbles, `focus` does not.
if (type === 'focusin') return target === el && showCal(this);
        
// Calendar's el is 'html' or 'body'.
// Anything but the calendar was clicked.
    
if (this.noPosition) {
    if (onCal) {
        calendarClicked(this);
    } else if (hidden) {
        showCal(this);
    } else {
        hideCal(this);
    }

    // When the calendar is hidden...
} else if (hidden) 
{        
    target === el && showCal(this);

    // Clicked on the calendar.
} else if (type === 'click' && onCal) {
    calendarClicked(this);

    // Typing in the overlay year input.
} else if (type === 'input') {
    overlayYearEntry(e, target, this);
    textChange(e,target,this);
} else {
    target !== el && hideCal(this);
}

function calendarClicked(instance) {
    const { calendar } = instance;
const classList = target.classList;
const monthYear = calendar.querySelector('.qs-month-year');
const isClosed = classList.contains('qs-close');
      
// A number was clicked.
if (classList.contains('qs-num')) {
    const targ = target.nodeName === 'SPAN' ? target.parentNode : target;
    const doNothing = ['qs-disabled', 'qs-active', 'qs-empty'].some(cls => {
        return targ.classList.contains(cls);
});

!doNothing && selectDay(targ, instance);

// Month arrows were clicked.
} else if (classList.contains('qs-arrow')) {
    changeMonthYear(classList, instance);

    // Month / year was clicked OR closing the overlay.
} else if (path.includes(monthYear) || isClosed) {
    toggleOverlay(calendar, isClosed, instance);

    // Overlay submit button clicked.
} else if (target.classList.contains('qs-submit')) {
    const input = calendar.querySelector('.qs-overlay-year');
    overlayYearEntry(e, input, instance);
}
}

function toggleOverlay(calendar, closing, instance) {
    ['.qs-overlay', '.qs-controls', '.qs-squares'].forEach((cls, i) => {
        calendar.querySelector(cls).classList.toggle(i ? 'qs-blur' : 'qs-hidden');
});

const overlayYear = calendar.querySelector('.qs-overlay-year');
closing ? overlayYear.value = '' : overlayYear.focus();
}

function overlayYearEntry(e, input, instance) {
    // Fun fact: 275760 is the largest year for a JavaScript date. #TrialAndError

    const badDate = isNaN(new Date().setFullYear(input.value || undefined));

    // Enter has been pressed OR submit was clicked.
    if (e.which === 13 || e.type === 'click') {
        if (badDate || input.classList.contains('qs-disabled')) return;
        changeMonthYear(null, instance, input.value);

        // Enable / disabled the submit button.
    } else {
        const submit = instance.calendar.querySelector('.qs-submit');
        submit.classList[badDate ? 'add' : 'remove']('qs-disabled');
    }
}

function textChange(e,input,instance)
{
    const { type, path, target } = e;
const { calendar, el } = instance;	  

var dtEx=bsFunctions.parseFormattedBsDate(instance.dateFormat,el.value);
		    
try
{
    if(instance.dateStyle==2)
    {
        let nDate=bsFunctions.getAdDateByBsDate(dtEx.bsYear,(dtEx.bsMonth-1),dtEx.bsDate);
        instance.setDate(new Date(nDate.getFullYear(),nDate.getMonth(),nDate.getDate()),null,true);
    }
    else
    {
        var nDate=new Date(dtEx.bsYear,(dtEx.bsMonth-1),dtEx.bsDate);
        instance.setDate(nDate,null,true);
    }
		    
}catch(e)
{
    alert(e.message);
}		    
		
}
}

return Datepicker;
});
