let inputDay = document.querySelector('#day-input'),
	inputMonth = document.querySelector('#month-input'),
	inputYear = document.querySelector('#year-input'),

	resultsDay = document.querySelector('#day-result'),
	resultsMonth = document.querySelector('#month-result'),
	resultsYear = document.querySelector('#year-result'),

	errorDay = document.querySelector('#day-error'),
	errorMonth = document.querySelector('#month-error'),
	errorYear = document.querySelector('#year-error'),

	dayBlock = document.querySelector('#day-input-block'),
	monthBlock = document.querySelector('#month-input-block'),
	yearBlock = document.querySelector('#year-input-block'),

	day,
	month,
	year,

	today = new Date(),
	todayDay = today.getDate(),
	todayMonth = today.getMonth() + 1, //add one because January will show up as month 0
	todayYear = today.getFullYear(),

	valid = false;

	//number of days per month, non-leap year
	daysByMonth = [
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	],

	//number of days per month, leap year
	daysByMonthLeap = [
		31,
		29,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	],

	//number of days in a year, in a 4-year cycle, compensating for leap years
	yearDaysCycle = [
		366,
		365,
		365,
		365
	];

const welcomeDialog = document.querySelector('.welcome-dialog');
window.addEventListener('load', (event) => {
	welcomeDialog.showModal();
});
const showButton = document.querySelector('.show-button');
const closeButton = document.querySelectorAll('.close-button');

showButton.addEventListener('click', () => {
	welcomeDialog.showModal();
});

for (let cb of closeButton) {
	cb.addEventListener('click', () => {
		welcomeDialog.hideModal();
	})
};

function validateDay() {
	//get the value for the Day input
	day = Number(inputDay.value);

	//check for errors
	if (day < 1) {
		dayBlock.classList.add('error');
		errorDay.innerHTML = "This field is required";
		return false;
	} else if (day > daysByMonth[month] || day > 31) {
		dayBlock.classList.add('error');
		errorDay.innerHTML = "Must be a valid day";
		return false;
	} else {
		dayBlock.classList.remove('error');
		errorDay.innerHTML = "";
		return true;
	}
}

function validateMonth() {
	//get the value for the Month input
	month = Number(inputMonth.value);

	//check for errors
	if (month < 1) {
		monthBlock.classList.add('error');
		errorMonth.innerHTML = "This field is required";
		return false;
	} else if (month > 12) {
		monthBlock.classList.add('error');
		errorMonth.innerHTML = "Must be a valid month";
		return false;
	} else {
		monthBlock.classList.remove('error');
		errorMonth.innerHTML = "";
		return true;
	}
}

function validateYear() {
	//get the valie for the Year input
	year = Number(inputYear.value);

	//check for errors
	if (year < 1) {
		yearBlock.classList.add('error');
		errorYear.innerHTML = "This field is required";
		return false;
	} else if (year > todayYear) {
		yearBlock.classList.add('error');
		errorYear.innerHTML = "Must be a valid year";
		return false;
	} else {
		yearBlock.classList.remove('error');
		errorYear.innerHTML = "";
		return true;
	}
}

function validateAllInputs() {
	//array of true or false based on validation of each input
	let	validation = [
		validateDay(),
		validateMonth(),
		validateYear()
	];

	//returns true if all inputs are valid
	valid = validation.every(input => {
		return input === true;
	});

	//if any input is not valid when you calculate results, add 'error' class to the input block, and add an error message.
	if (valid === false) {
		dayBlock.classList.add('error');
		monthBlock.classList.add('error');
		yearBlock.classList.add('error');
		errorDay.innerHTML = "Must be a valid date";
		errorMonth.innerHTML = "";
		errorYear.innerHTML = "";
		return;
	} else {
		dayBlock.classList.remove('error');
		monthBlock.classList.remove('error');
		yearBlock.classList.remove('error');
		errorDay.innerHTML = "";
		errorMonth.innerHTML = "";
		errorYear.innerHTML = "";
	}
}

function calculateResults() {
	//check validation for all inputs
	validateAllInputs();

	let dateFull = new Date(year + '-' + month + '-' + day), //convert input dates into single date, in milliseconds
		diffDate = Math.abs(today - dateFull), //get the difference between today and the input date
		diffDaysTotal = Math.floor(diffDate / (1000 * 60 * 60 * 24)), //total number of days between today's date and the input date.
		leapCycleCounter = 0, //counter to determine if the year is a leap year
		dayCounter = diffDaysTotal - 1, //subtract one day since today is not over.
		monthCounter = 0;
		yearCounter = 0;
		ageMonths = 0;
		ageDays = 0;

		//the 'while' loop below counts the days in the year, so this adds a year to compensate for if the input date is after the leap day.
		if (month > 2) {
			year = year + 1;
		}
		//update the leapCycleCount accordingly.
		leapCycleCounter = year % 4;

	while (dayCounter > yearDaysCycle[leapCycleCounter]) { //if the day counter is more than the number of days in a year (adjusted for leap years using the leapCycleCounter)...
		dayCounter = dayCounter - yearDaysCycle[leapCycleCounter]; //subtract the number of days in the given year from the day counter.
		yearCounter++; //increment yearCounter. This will be used to determine age in years later.
		year++; //increment 'year', which is used to determine if the given year is a leap year or not.
		leapCycleCounter = year % 4; //update leapCycleCounter according to year value.

		//If day counter is less than 365 or 366...
		if (dayCounter < yearDaysCycle[leapCycleCounter]) {
			if (leapCycleCounter === 0) { //if it is a leap year...
				while (dayCounter > daysByMonthLeap[monthCounter]) { //if the day counter is more than the number of days in the month, starting with January...
					dayCounter = dayCounter - daysByMonthLeap[monthCounter]; //subtract the numbers of days in the month from the day counter.
					monthCounter++; //increment the month counter and loop again
				}
			} else { //if it is not a leap year...
				while (dayCounter > daysByMonth[monthCounter]) { //if the day counter is more than the number of days in the month, starting with January...
					dayCounter = dayCounter - daysByMonth[monthCounter]; //subtract the numbers of days in the month from the day counter.
					monthCounter++; //increment the month counter and loop again
				}
			}
		}
	}

	ageYears = yearCounter;
	ageMonths = monthCounter;
	ageDays = dayCounter;

	resultsYear.innerHTML = ageYears;
	resultsMonth.innerHTML = ageMonths;
	resultsDay.innerHTML = ageDays;
}

//Allows you to press Enter to calculate the results
document.addEventListener('keydown', function(event) {
	if (event.code === 'Enter') {
		event.preventDefault();
		calculateResults();
	}
})