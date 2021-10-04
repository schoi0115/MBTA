

let stationListAPIURL = 'https://api.wmata.com/Rail.svc/json/jStations'
let stationIDall = 'All'
let stationIDglobal = ''

document.addEventListener('DOMContentLoaded', () => {
    getStationList(stationListAPIURL, params)
    activateDropdownStationEvent()   
})

function getStationList(URL, params) {
    fetch(URL, params)
	.then(res => res.json())
    .then(json => renderStationList(json))
}


function renderStationList(json){
    let stationListClean = []
	json.Stations.forEach((arrStation) => {
	    let eachStation = document.createElement('option')
        let lineOne = arrStation.LineCode1
        let lineTwo = arrStation.LineCode2
        let lineThree = arrStation.LineCode3
        let stationTogether = arrStation.StationTogether1
        if (stationTogether !== null) {
            eachStation.title = stationTogether
        }
        if (lineThree !== null){
            eachStation.textContent = `${arrStation.Name} *Lines: ${lineOne} ${lineTwo} ${lineThree}`
        }
        else if (lineTwo !== null){
            eachStation.textContent = `${arrStation.Name} *Lines: ${lineOne} ${lineTwo}`
        }
        else {
            eachStation.textContent = `${arrStation.Name} *Lines: ${lineOne}`
        }
        eachStation.value = arrStation.Code
        stationListClean.push(eachStation)
        // make combine station 
        // don't push join station on to page
	})
    let stationListJoined = stationListClean.filter(element=>{
        if (element.title !== "") {
            // stations caught: metro center, l'enfant, gallery pl, fort totten, for some rease wiehle
            // that's all, folks!
            // console.log(element.toArray(String[]::new))
            // dynamic programming
            // create if statement for stationJoiner
            //      if stationJoiner exists, append to object
            return element
        }
    })
    let titlesArray = []
    stationListJoined.forEach(e => {
        titlesArray.push(e.title)
    })
    titlesArray.forEach(e => {
            if (e === "C01"){
            }
        })        
        stationListClean.sort(function(keyA, keyB){
            if (keyA.textContent < keyB.textContent) {return -1}
        else {return 1}
    })

    stationListClean.forEach(stationListEach =>{
        document.querySelector('#dropdown').append(stationListEach)
    })
}

function buttonRefreshTable() {
    let refreshTableButtonLoc = document.getElementById('refreshButtonTableLoc')
    let button = document.createElement('button')
    while (refreshTableButtonLoc.firstChild) 
        refreshTableButtonLoc.removeChild(refreshTableButtonLoc.firstChild)
    button.textContent = 'Refresh Times'
    button.id = 'refreshButtonID'
    refreshTableButtonLoc.append(button)
    document.querySelector('#refreshButtonID').addEventListener("click", ()=>{
        refreshTable()
    })
}

function refreshTable(){    
    getAllStationPredictions(stationIDglobal, params)
}

function activateDropdownStationEvent() {
    document.querySelector('#dropdown').addEventListener("change", selectOption)
}

function selectOption() {
    let stationID = document.querySelector('#dropdown').value
    stationIDglobal = stationID
    getAllStationPredictions(stationID, params)
}

function getStationPredictions(stationID, params) {
    let stationPredictionsURL = `https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${stationID}`
    fetch(stationPredictionsURL, params)
    .then(res => res.json())
    .then(data => {
        renderTable(data)
    })
}

function getAllStationPredictions(stationID, params) {
    let stationPredictionsURL = `https://api.wmata.com/StationPrediction.svc/json/GetPrediction/All`
    fetch(stationPredictionsURL, params)
    .then(res => res.json())
    .then(data => {
        sortStationPredictionData(data, stationID)
    })
}

function sortStationPredictionData(data, stationID) {
    let allTrainsData = data.Trains
    let locationCodeSpecified = stationID
    let filteredArray = allTrainsData.filter(o=>o.LocationCode === locationCodeSpecified)
    renderTable(filteredArray)
}

function renderTable(predictionData) {
    let trainInfo = predictionData
    let header = ['Line', 'Destination', 'Minutes']
    let directionOneTable = document.getElementById('tableLocOne')
    while (directionOneTable.firstChild) 
         directionOneTable.removeChild(directionOneTable.firstChild)
    let directionOneTableBody = document.createElement('tbody')
    let newRow = document.createElement('tr')
    for (let k = 0; k<header.length; k++) {
        let newHeader = document.createElement('th')
        newText = document.createTextNode(header[k])
        newHeader.appendChild(newText)
        newRow.appendChild(newHeader)
    }
    directionOneTableBody.appendChild(newRow)
    for(let j = 0; j<trainInfo.length; j++) {
        let newRow = document.createElement('tr')
            newCellLine = document.createElement('td')
		newCellLine.textContent = trainInfo[j].Line
		if (newCellLine.textContent === 'RD') {
			newCellLine.setAttribute('id', 'red_line')
		} else if (newCellLine.textContent === 'OR') {
			newCellLine.setAttribute('id', 'orange_line')
		} else if (newCellLine.textContent === 'BL') {
			newCellLine.setAttribute('id', 'blue_line')
		} else if (newCellLine.textContent === 'GR') {
			newCellLine.setAttribute('id', 'green_line')
		} else if (newCellLine.textContent === 'YL') {
			newCellLine.setAttribute('id', 'yellow_line')
		} else if (newCellLine.textContent === 'SV') {
			newCellLine.setAttribute('id', 'silver_line')
		}
            newRow.appendChild(newCellLine)
            newCellDest = document.createElement('td')
            newTextDest = document.createTextNode(trainInfo[j].Destination)
            newCellDest.appendChild(newTextDest)
            newRow.appendChild(newCellDest)
            newCellMin = document.createElement('td')
            newTextMin = document.createTextNode(trainInfo[j].Min)
            newCellMin.appendChild(newTextMin)
            newRow.appendChild(newCellMin)
        directionOneTableBody.appendChild(newRow)
    }
    directionOneTable.appendChild(directionOneTableBody)
    directionOneTable.setAttribute('border', '2')
	
    buttonRefreshTable()
    renderCommentBox()
}

function postComments(){
    document.querySelector(".comment-form").addEventListener('submit', (e) =>{
        e.preventDefault()
        e.target[0].value
    })
    newComment()
}
function newComment(){
    document.querySelector(".comment-form").addEventListener('submit', (e) => {
        e.preventDefault()
        e.target[0].value
        let newCommentli = document.createElement('li')
        newCommentli.textContent = e.target[0].value
        document.querySelector('.comments').append(newCommentli)
        document.querySelector('.comment-form').reset()
       })
    }

    function ratingStarOne(){
        document.querySelector('#oneStar').addEventListener('click', () => {
            document.querySelector('#oneStar').style.color = 'orange'
            document.querySelector('#twoStar').style.color = 'grey'
            document.querySelector('#threeStar').style.color = 'grey'
            document.querySelector('#fourStar').style.color = 'grey'
            document.querySelector('#fiveStar').style.color = 'grey'
           });
    
    }
    function ratingStarTwo(){
        document.querySelector('#twoStar').addEventListener('click', () => {
            document.querySelector('#oneStar').style.color = 'orange'
            document.querySelector('#twoStar').style.color = 'orange'
            document.querySelector('#threeStar').style.color = 'grey'
            document.querySelector('#fourStar').style.color = 'grey'
            document.querySelector('#fiveStar').style.color = 'grey'
           });
    
    }
    function ratingStarThree(){
        document.querySelector('#threeStar').addEventListener('click', () => {
            document.querySelector('#oneStar').style.color = 'orange'
            document.querySelector('#twoStar').style.color = 'orange'
            document.querySelector('#threeStar').style.color = 'orange'
            document.querySelector('#fourStar').style.color = 'grey'
            document.querySelector('#fiveStar').style.color = 'grey'
           });
    
    }
    function ratingStarFour(){
        document.querySelector('#fourStar').addEventListener('click', () => {
            document.querySelector('#oneStar').style.color = 'orange'
            document.querySelector('#twoStar').style.color = 'orange'
            document.querySelector('#threeStar').style.color = 'orange'
            document.querySelector('#fourStar').style.color = 'orange'
            document.querySelector('#fiveStar').style.color = 'grey'
           });
    
    }
    function ratingStarFive(){
        document.querySelector('#fiveStar').addEventListener('click', () => {
            document.querySelector('#oneStar').style.color = 'orange'
            document.querySelector('#twoStar').style.color = 'orange'
            document.querySelector('#threeStar').style.color = 'orange'
            document.querySelector('#fourStar').style.color = 'orange'
            document.querySelector('#fiveStar').style.color = 'orange'
           });
    
    }

    function renderCommentBox() {
	let toClear = document.querySelector('#reviewContainer')
        if(toClear) {
            document.querySelector('#table-comment-container').removeChild(toClear)
        }
        
        let sel = document.querySelector('#dropdown')
        let selTextRaw = sel.options[sel.selectedIndex].text
        selTextSplit = selTextRaw.split("*")
        selText = selTextSplit[0]

        document.querySelector('#tableHeader').textContent = `Next Trains Arriving at ${selText}Station`

    	const starAndCommentContainer = document.createElement('div')
        starAndCommentContainer.setAttribute('id', 'reviewContainer')
	
        const commentHeader = document.createElement('h3')
	commentHeader.className='announce'
        commentHeader.textContent = `Please tell us about ${selText}Station`

	    const starsContainer = document.createElement('div')
	    starsContainer.setAttribute('id', 'rating')

	    const oneStar = document.createElement('span')
	    oneStar.setAttribute('id', 'oneStar')

	    const twoStar = document.createElement('span')
	    twoStar.setAttribute('id', 'twoStar')

	    const threeStar = document.createElement('span')
	    threeStar.setAttribute('id', 'threeStar')

	    const fourStar = document.createElement('span')
	    fourStar.setAttribute('id', 'fourStar')

	    const fiveStar = document.createElement('span')
	    fiveStar.setAttribute('id', 'fiveStar')

	    starsContainer.append(oneStar, twoStar, threeStar, fourStar, fiveStar)

	const commentContainer = document.createElement('ul')
	commentContainer.setAttribute('class', 'comments')

	const commentForm = document.createElement('form')
	commentForm.setAttribute("class", "comment-form")
	commentForm.setAttribute("method", "post")
	commentForm.setAttribute("action", "submit.php")

	const commentInput = document.createElement("input")
	commentInput.setAttribute("type", "text")
	commentInput.setAttribute("placeholder", "Add a comment . . .")
	


	    const commentSubmit = document.createElement("input");
	    commentSubmit.setAttribute("type", "submit");
	    commentSubmit.setAttribute("value", "Submit");

	    commentForm.append(commentInput, commentSubmit)
	
        starAndCommentContainer.append(commentHeader, starsContainer, commentContainer, commentForm)

        document.querySelector('#table-comment-container').append(starAndCommentContainer)

	    postComments()

	    ratingStarOne()
	    ratingStarTwo()
	    ratingStarThree()
	    ratingStarFour()
	    ratingStarFive()
    }
