const DEFAULT_TIME_ZONE = 'UTC'
const TIME_API_URL = 'https://worldtimeapi.org/api/timezone/'
const REMAINING_TIME_DIV_ID = 'remaining-time'
const remainingTimeDiv = document.getElementById(REMAINING_TIME_DIV_ID)

function getTimeZone() {
	try {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
	} catch (error) {
		return DEFAULT_TIME_ZONE
	}
}

async function getCurrentTime() {
	try {
		const timezone = url.searchParams.get('timezone') || getTimeZone()
		const response = await fetch(TIME_API_URL + timezone)
		const data = await response.json()
		const date = new Date(data.datetime)
		return date
	} catch (error) {
		return new Date();
	}
}

function updateTimer(timeDiff) {
	const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
	const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
	remainingTimeDiv.innerText = `${days} days \n ${hours} hours \n ${minutes} minutes \n ${seconds} seconds`

	setTimeout(() => {
		updateTimer(timeDiff - 1000)
	}, 1000)
}

async function init(makeApiCall = true) {
	const url = new URL(window.location.href)
	const endDate = url.searchParams.get('date')
	if (!endDate) {
		return;
	}
	const date = new Date(endDate)
	if (date == 'Invalid Date') {
		window.alert('Invalid date')
		debugger
		return;
	}
	const currentTime = await getCurrentTime()
	const timeDiff = (date.getTime() - currentTime.getTime())

	if (timeDiff <= 0) {
		window.alert('Past date passed')
		return;
	}
	updateTimer(timeDiff)
}

init()