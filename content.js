$(document).ready(function() {
	


	
	function convertArabicDateToISO(dateString) {
		const monthsMap = {
			"يناير": "01",
			"فبراير": "02",
			"مارس": "03",
			"أبريل": "04",
			"مايو": "05",
			"يونيو": "06",
			"يوليو": "07",
			"أغسطس": "08",
			"سبتمبر": "09",
			"أكتوبر": "10",
			"نوفمبر": "11",
			"ديسمبر": "12"
		};

		const parts = dateString.split(" ");
		const day = parts[1];
		const monthName = parts[2];
		const year = parts[3];

		const month = monthsMap[monthName];

		return `${year}-${month}-${day.padStart(2, '0')}`;
	}
	
	setInterval(function() {
		$(".btn-refresh").find('.picon').click();
	}, 150000);
	
	var flightStat;
	const getButton = document.createElement('button');
	getButton.innerText = 'GET';
	getButton.style.position = 'fixed';
	getButton.style.top = '50%';
	getButton.style.right = '20px';
	getButton.style.zIndex = '1000';
	getButton.style.padding = '10px 20px';
	getButton.style.backgroundColor = '#49d520';
	getButton.style.color = '#4f4f4f';
	getButton.style.border = '1px solid #5cb92f';
	getButton.style.borderRadius = '20px 0px';
	getButton.style.cursor = 'pointer';

	
	const getNext = document.createElement('a');
	getNext.innerText = '>>>';
	getNext.style.position = 'fixed';
	getNext.style.top = '60%';
	getNext.style.right = '50px';
	getNext.style.zIndex = '1001';
	getNext.style.padding = '10px 20px';
	getNext.style.color = '#4f4f4f';
	getNext.style.cursor = 'pointer';
	

	const getNext2 = document.createElement('a');
	getNext2.innerText = '<<<';
	getNext2.style.position = 'fixed';
	getNext2.style.top = '60%';
	getNext2.style.right = '1px';
	getNext2.style.zIndex = '1001';
	getNext2.style.padding = '10px 20px';
	getNext2.style.color = '#4f4f4f';
	getNext2.style.cursor = 'pointer';

	
	document.body.appendChild(getButton);
	document.body.appendChild(getNext);
	document.body.appendChild(getNext2);
	
	function fetchFromGitHub() {
		
		const repo = 'account-me/json';
		const path = 'settings.json';
		const message = 'Settings flight data';
		
		fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/vnd.github.v3+json'
			}
		})
		.then(response => response.json())
		.then(data => {
			const fileContent = atob(data.content);
			const flightData = JSON.parse(fileContent);
			flightStat = flightData.flights;
			chrome.storage.local.set({ stat: flightData.flights });

		})
		.catch(error => console.error('Error fetching file data:', error));
	}
	
	
	
	
getNext.addEventListener('click', () => {

	var date00 = $("#custom-panel-0").find(".subtitle").text().trim();
	var currentDate = new Date(convertArabicDateToISO(date00));
	currentDate.setDate(currentDate.getDate() + 1);
	let year = currentDate.getFullYear();
	let month = String(currentDate.getMonth() + 1).padStart(2, '0');
	let day = String(currentDate.getDate()).padStart(2, '0');
	let thisDay = `${year}-${month}-${day}`;
	var link1 = "https://booking.flynas.com/#/booking/search-redirect?origin=RUH&destination=AMM&origin1=JED&destination1=AMM&currency=SAR&departureDate="+thisDay+"&returnDate="+thisDay+"&flightMode=multi&adultCount=1&childCount=0&infantCount=0&promoCode=&naSmiles=false&specialDiscount=null&culture=en-GB&reference=undefined&multicityObject=%5B%7B%22origin%22%3A%22MED%22%2C%22destination%22%3A%22AMM%22%2C%22departureDate%22%3A%22"+thisDay+"%22%7D%2C%7B%22origin%22%3A%22DMM%22%2C%22destination%22%3A%22AMM%22%2C%22departureDate%22%3A%22"+thisDay+"%22%7D%2C%7B%22origin%22%3A%22TIF%22%2C%22destination%22%3A%22AMM%22%2C%22departureDate%22%3A%22"+thisDay+"%22%7D%5D&locationsource=SA";
	window.open(link1,"_self");
	location.reload();

});
fetchFromGitHub();


getNext2.addEventListener('click', () => {
	
	var date00 = $("#custom-panel-0").find(".subtitle").text().trim();
	var currentDate = new Date(convertArabicDateToISO(date00));
	currentDate.setDate(currentDate.getDate() - 1);
	let year = currentDate.getFullYear();
	let month = String(currentDate.getMonth() + 1).padStart(2, '0');
	let day = String(currentDate.getDate()).padStart(2, '0');
	let thisDay = `${year}-${month}-${day}`;
	var link1 = "https://booking.flynas.com/#/booking/search-redirect?origin=RUH&destination=AMM&origin1=JED&destination1=AMM&currency=SAR&departureDate="+thisDay+"&returnDate="+thisDay+"&flightMode=multi&adultCount=1&childCount=0&infantCount=0&promoCode=&naSmiles=false&specialDiscount=null&culture=en-GB&reference=undefined&multicityObject=%5B%7B%22origin%22%3A%22MED%22%2C%22destination%22%3A%22AMM%22%2C%22departureDate%22%3A%22"+thisDay+"%22%7D%2C%7B%22origin%22%3A%22DMM%22%2C%22destination%22%3A%22AMM%22%2C%22departureDate%22%3A%22"+thisDay+"%22%7D%2C%7B%22origin%22%3A%22TIF%22%2C%22destination%22%3A%22AMM%22%2C%22departureDate%22%3A%22"+thisDay+"%22%7D%5D&locationsource=SA";
	window.close();
	window.open(link1,"_self");
	location.reload();

});
	

getButton.addEventListener('click', () => {
	
	
	
	var flights = [];
	var list1 = [];
	var list2 = [];
	var amman = [];
	var cheapestAmman;
	var cheapestFlights;
	var cheapestList1;
	var cheapestList2;
	var whatType = $('#custom-panel-0').find('.journey-title').text();
	
	
	var url1 = window.location.href;
	
	if (url1.includes("flynas")) {
		var site = "flynas";
		// ------------------------------
		
		if(whatType.includes("عَمَّان") || whatType.includes("عمان")){

			
			function getFlights(){
			try{
			
				$('#custom-panel-0').find('.flight_table').each(function() {
					var date1 = $("#custom-panel-0").find(".subtitle").text().trim();
					var depart1 = $(this).find('.flight-time').first().text();
					var arrive1 = $(this).find('.flight-time').last().text();
					var amount1 = parseInt($(this).find('.priceInt').first().text());
					var seatleft1 = $(this).find(".seatleft").text();
					if(seatleft1 != ""){
						seatleft1 = seatleft1.trim();
					}else{
						seatleft1 = "اكثر من 7 مقاعد";
					}
					
					var dateNum1 = convertArabicDateToISO(date1);
										
					if(amount1 !== NaN && depart1 !== "" && arrive1 !== ""){
						var l1 = {"site1":"flynas","dateNum1":dateNum1,"date1":date1, "depart1": depart1, "arrive1": arrive1, "amount1": amount1, "seatleft1":seatleft1};
						amman.push(l1);
					}
					
				});
				
				$('#custom-panel-1').find('.flight_table').each(function() {
					var date1 = $("#custom-panel-1").find(".subtitle").text().trim();
					var depart1 = $(this).find('.flight-time').first().text();
					var arrive1 = $(this).find('.flight-time').last().text();
					var amount1 = parseInt($(this).find('.priceInt').first().text());
					var seatleft1 = $(this).find(".seatleft").text();
					if(seatleft1 != ""){
						seatleft1 = seatleft1.trim();
					}else{
						seatleft1 = "اكثر من 7 مقاعد";
					}
					var dateNum1 = convertArabicDateToISO(date1);
					
					if(amount1 !== NaN && depart1 !== "" && arrive1 !== ""){
						var l1 = {"site1":"flynas","dateNum1":dateNum1,"date1":date1, "depart1": depart1, "arrive1": arrive1, "amount1": amount1, "seatleft1":seatleft1};
						amman.push(l1);
					}
					
				});
				
				$('#custom-panel-2').find('.flight_table').each(function() {
					var date1 = $("#custom-panel-2").find(".subtitle").text().trim();
					var depart1 = $(this).find('.flight-time').first().text();
					var arrive1 = $(this).find('.flight-time').last().text();
					var amount1 = parseInt($(this).find('.priceInt').first().text());
					var seatleft1 = $(this).find(".seatleft").text();
					if(seatleft1 != ""){
						seatleft1 = seatleft1.trim();
					}else{
						seatleft1 = "اكثر من 7 مقاعد";
					}
					var dateNum1 = convertArabicDateToISO(date1);
					
					if(amount1 !== NaN && depart1 !== "" && arrive1 !== ""){
						var l1 = {"site1":"flynas","dateNum1":dateNum1,"date1":date1, "depart1": depart1, "arrive1": arrive1, "amount1": amount1, "seatleft1":seatleft1};
						amman.push(l1);
					}
					
				});
				
				$('#custom-panel-3').find('.flight_table').each(function() {
					var date1 = $("#custom-panel-3").find(".subtitle").text().trim();
					var depart1 = $(this).find('.flight-time').first().text();
					var arrive1 = $(this).find('.flight-time').last().text();
					var amount1 = parseInt($(this).find('.priceInt').first().text());
					var seatleft1 = $(this).find(".seatleft").text();
					if(seatleft1 != ""){
						seatleft1 = seatleft1.trim();
					}else{
						seatleft1 = "اكثر من 7 مقاعد";
					}
					var dateNum1 = convertArabicDateToISO(date1);
					if(amount1 !== NaN && depart1 !== "" && arrive1 !== ""){
						var l1 = {"site1":"flynas","dateNum1":dateNum1,"date1":date1, "depart1": depart1, "arrive1": arrive1, "amount1": amount1, "seatleft1":seatleft1};
						amman.push(l1);
					}
					
				});
				
				$('#custom-panel-4').find('.flight_table').each(function() {
					var date1 = $("#custom-panel-4").find(".subtitle").text().trim();
					var depart1 = $(this).find('.flight-time').first().text();
					var arrive1 = $(this).find('.flight-time').last().text();
					var amount1 = parseInt($(this).find('.priceInt').first().text());
					var seatleft1 = $(this).find(".seatleft").text();
					if(seatleft1 != ""){
						seatleft1 = seatleft1.trim();
					}else{
						seatleft1 = "اكثر من 7 مقاعد";
					}
					var dateNum1 = convertArabicDateToISO(date1);
					
					if(amount1 !== NaN && depart1 !== "" && arrive1 !== ""){
						var l1 = {"site1":"flynas","dateNum1":dateNum1,"date1":date1, "depart1": depart1, "arrive1": arrive1, "amount1": amount1, "seatleft1":seatleft1};
						amman.push(l1);
					}
					
				});
			}catch(e){console.log(e);}
			
		}
			
			
		}else{
			function getFlights(){
			try{
			
				$('#custom-panel-0').find('.flight_table').each(function() {
					var date1 = $("#custom-panel-0").find(".subtitle").text().trim();
					var depart1 = $(this).find('.flight-time').first().text();
					var arrive1 = $(this).find('.flight-time').last().text();
					var amount1 = parseInt($(this).find('.priceInt').first().text());
					var seatleft1 = $(this).find(".seatleft").text();
					if(seatleft1 != ""){
						seatleft1 = seatleft1.trim();
					}else{
						seatleft1 = "اكثر من 7 مقاعد";
					}
					
					var dateNum1 = convertArabicDateToISO(date1);
					
					if(amount1 !== NaN && depart1 !== "" && arrive1 !== ""){
						var l1 = {"site1":"flynas","dateNum1":dateNum1, "date1":date1, "depart1": depart1, "arrive1": arrive1, "amount1": amount1, "seatleft1":seatleft1};
						list1.push(l1);
					}
					
					
				});
				
				
				
				$('#custom-panel-1').find('.flight_table').each(function() {
					var date2 = $('#custom-panel-1').find(".subtitle").text().trim();
					var depart2 = $(this).find('.flight-time').first().text();
					var arrive2 = $(this).find('.flight-time').last().text();
					var amount2 = parseInt($(this).find('.priceInt').first().text());
					var seatleft2 = $(this).find(".seatleft").text();
					if(seatleft2 != ""){
						seatleft2 = seatleft2.trim();
					}else{
						seatleft2 = "اكثر من 7 مقاعد";
					}
					
					var dateNum2 = convertArabicDateToISO(date2);
					if(amount2 !== NaN && depart2 !== "" && arrive2 !== ""){
						var l2 = {"site2":"flynas","dateNum2":dateNum2,"date2":date2,"depart2": depart2, "arrive2": arrive2, "amount2": amount2, "seatleft2":seatleft2};
						list2.push(l2);
					}
					
				});
			}catch(e){}
		}
		}
		
		// ------------------------------
	}else if (url1.includes("flyadeal")) {
		var site = "flyadeal";
		// ------------------------------
		function getFlights(){
			try{
				var dateee1 = $("#bookingId-0").find(".date-tab-wrap.selected .date").first().find('strong').text().trim();
				var dayName = $("#bookingId-0").find(".date-tab-wrap.selected .date").first().find('span').text().trim();
				var dateee2 = $("#bookingId-0").find(".date-tab-wrap.selected .date").last().text().trim();
				var parts1x = dateee1.split(" ");
				var monthName = parts1x[1];
				var parts2x = dateee2.split(" ");
				var dayNum = parseInt(parts2x[1]).toString();
				var yearNum = parts2x[2];

				var date1y = dayName + ' ' + dayNum + ' ' + monthName + ' ' + yearNum;

				var dateee3 = $("#bookingId-1").find(".date-tab-wrap.selected .date").first().find('strong').text().trim();
				var dayName2 = $("#bookingId-1").find(".date-tab-wrap.selected .date").first().find('span').text().trim();
				var dateee4 = $("#bookingId-1").find(".date-tab-wrap.selected .date").last().text().trim();
				var parts2x = dateee3.split(" ");
				var monthName2 = parts2x[1];
				var parts22x = dateee4.split(" ");
				var dayNum2 = parseInt(parts22x[1]).toString();
				var yearNum2 = parts22x[2];

				var date2y = dayName2 + ' ' + dayNum2 + ' ' + monthName2 + ' ' + yearNum2;

				$('#bookingId-0').find('.flight_details_wrap').each(function() {
					var date1 = date1y;
					var city_depart1 = $(this).find('.journey_segments_span').first().text().trim();
					var time_depart1 = $(this).find('.journey-schedule_time').first().text().trim();
					var depart1 = city_depart1 + ' ' + time_depart1;
					var city_arrive1 = $(this).find('.journey_segments_span').last().text().trim();
					var time_arrive1 = $(this).find('.journey-schedule_time').last().text().trim();
					var arrive1 = city_arrive1 + ' ' + time_arrive1;
					var amount1 = parseInt($(this).find('.price').text().trim());
					
					var dateNum1 = convertArabicDateToISO(date1);
					
					if(amount1 !== NaN && depart1 !== "" && arrive1 !== ""){
						var l1 = {"site1":"flyadeal","dateNum1":dateNum1,"date1":date1, "depart1": depart1, "arrive1": arrive1, "amount1": amount1, "seatleft1":"غير معروف"};
						list1.push(l1);
					}
					
					
				});
				
				$('#bookingId-1').find('.flight_details_wrap').each(function() {
	
					var date2 = date2y;
					var city_depart2 = $(this).find('.journey_segments_span').first().text().trim();
					var time_depart2 = $(this).find('.journey-schedule_time').first().text().trim();
					var depart2 = city_depart2 + ' ' + time_depart2;
					var city_arrive2 = $(this).find('.journey_segments_span').last().text().trim();
					var time_arrive2 = $(this).find('.journey-schedule_time').last().text().trim();
					var arrive2 = city_arrive2 + ' ' + time_arrive2;
					var amount2 = parseInt($(this).find('.price').text().trim());
					
					if(amount2 !== NaN && depart2 !== "" && arrive2 !== ""){
						var l2 = {"site2":"flyadeal","date2":date2,"depart2": depart2, "arrive2": arrive2, "amount2": amount2, "seatleft2":"غير معروف"};
						list2.push(l2);
					}
					
				});
			}catch(e){
				console.log(e);
			}
		}
		// ------------------------------
	}
	
	
	function extractEmails() {
		
		if(whatType.includes("عَمَّان") || whatType.includes("عمان")){
			if(flightStat === "true"){
				getFlights();
				amman.sort((a, b) => {
					return a.amount1 - b.amount1;
				});
				
				cheapestAmman = amman.slice(0, 3);
			}
			
		}else{
			
			getFlights();

			var index1 = 1;
			var index2 = 2;
			
			list1.forEach(function(x1){
				
				index1++
				try{
					
					var date11 = x1.date1;
					var de1 = x1.depart1.trim();
					var parts1x = de1.trim().split(" ");
					var city1x = parts1x[0];
					var timelist1x = de1.match(/\d+/g);
					var timeInNumber1x = parseInt(timelist1x.join(''));
					var dNum = x1.dateNum1;
					var seatleft11 = x1.seatleft1;
					
					if(timeInNumber1x > 2110){return;}
					
					
					var ar1 = x1.arrive1.trim();
					var parts1xx = ar1.trim().split(" ");
					var city1xx = parts1xx[0];
					var timelist1xx = ar1.match(/\d+/g);
					var timeInNumber1xx = parseInt(timelist1xx.join(''));
					var am1 = x1.amount1;
				}catch(e){}
				
				list2.forEach(function(x2){
					
					index2++
					try{
						var date22 = x2.date2;
						var de2 = x2.depart2.trim();
						var parts2x = de2.trim().split(" ");
						var city2x = parts2x[0];
						var timelist2x = de2.match(/\d+/g);
						var timeInNumber2x = parseInt(timelist2x.join(''));
						var dNum2 = x2.dateNum2;
						var ar2 = x2.arrive2.trim();
						var parts2xx = de2.trim().split(" ");
						var city2xx = parts2xx[0];
						var timelist2xx = ar2.match(/\d+/g);
						var timeInNumber2xx = parseInt(timelist2xx.join(''));
						
						var seatleft22 = x2.seatleft2;
						
						var timeBtween = timeInNumber1xx - timeInNumber2x;
						var plus1 = timeBtween;
						
						
						var am2 = x2.amount2;
						
						var total = am1 + am2;
						var timeout1 = 0;
						
						if(timeBtween < 0){
							timeout1 = 1;
							plus1 = 9999;
						}
						
						if(timeBtween < 600 && flightStat === "true"){
							var xxx = {"site":site,"dateNum1":dNum,"dateNum2":dNum2,"date1":date11,"depart1": de1, "arrive1": ar1, "amount1": am1,"date2":date22,"depart2": de2, "arrive2": ar2, "amount2": am2, "total":total, "timeout": timeout1, "plus1":plus1, "seatleft1":seatleft11, "seatleft2":seatleft22};
							flights.push(xxx);
						}
						
					}catch(e){}
				});
			
			});
			
			flights.sort((a, b) => {
			if (a.total !== b.total) {
				return a.total - b.total;
			} 
			return a.plus1 - b.plus1;
			});

			list1.sort((a, b) => {
				return a.amount1 - b.amount1;
			});

			list2.sort((a, b) => {
				return a.amount2 - b.amount2;
			});
			
			cheapestFlights = flights.slice(0, 3);
			cheapestList1 = list1.slice(0, 3);
			cheapestList2 = list2.slice(0, 3);
		}
			
		
		
		getButton.style.backgroundColor = '#41a822';
		setTimeout(function() {
			getButton.style.backgroundColor = '#49d520';
		}, 300);
	
		
	

	}

	const extractedEmails = extractEmails();
	
	
	if(whatType.includes("عَمَّان") || whatType.includes("عمان")){
		
		chrome.storage.local.get('amman', function(result) {
			var storedAmman = result.amman || [];
			const newAmman = cheapestAmman[0].dateNum1;
			storedAmman = storedAmman.filter(flight => flight.dateNum1 !== newAmman);
			storedAmman = storedAmman.concat(cheapestAmman);
			chrome.storage.local.set({ amman: storedAmman });
		});
		
			
	}else{
		chrome.storage.local.get(['flights', 'outbound', 'inbound'], function(result) {

			var storedFlights = result.flights || [];
			var storedOutbound = result.outbound || [];
			var storedInbound = result.inbound || [];

			const newFlights = cheapestFlights[0].dateNum1;
			storedFlights = storedFlights.filter(flight => flight.dateNum1 !== newFlights);
			storedFlights = storedFlights.concat(cheapestFlights);

			const newOut = cheapestList1[0].dateNum1;
			storedOutbound = storedOutbound.filter(flight => flight.dateNum1 !== newOut);
			storedOutbound = storedOutbound.concat(cheapestList1);

			const newIn = cheapestList2[0].dateNum2;
			storedInbound = storedInbound.filter(flight => flight.dateNum2 !== newIn);
			storedInbound = storedInbound.concat(cheapestList2);

			chrome.storage.local.set({ flights: storedFlights });
			chrome.storage.local.set({ outbound: storedOutbound });
			chrome.storage.local.set({ inbound: storedInbound });
			chrome.storage.local.set({ stat: flightStat });
		});
	}

	

});
	
});

