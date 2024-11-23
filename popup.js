$(document).ready(function() {

	function getCode(cityName){
		var codesAr = {
			"الرياض":"RUH",
			"عَمَّان":"AMM",
			"عمان":"AMM",
			"جدة":"JED",
			"المدينة":"MED",
			"المدينة المنورة":"MED",
			"الدمام":"DMM",
			"الطائف":"TIF",
			"القاهرة":"EG1",
			"سفنكس":"EG1",
		}

		var xcxxv = cityName.split(" ");
		xx2 = codesAr[xcxxv[0]];
		return xx2;
	}

	console.log(getCode("سفنكس 15:10"));

	var dep1;
	var ari1;
	var dep3;
	var ari3;
	var dNum1;
	var dNum2;
	var dNum3;
	
	


	$('#clear-emails-btn').on('click', function() {
		chrome.storage.local.remove(['flights', 'outbound', 'inbound', 'amman'], function() {
		$('.pop-box').html("");   
		alert('Flights cleared!');
		});
	});


	
	
	function parseArabicDate(arabicDate) {
		var arabicMonths = {
			"يناير": "January",
			"فبراير": "February",
			"مارس": "March",
			"ابريل": "April",
			"مايو": "May",
			"يونيو": "June",
			"يوليو": "July",
			"اغسطس": "August",
			"سبتمبر": "September",
			"اكتوبر": "October",
			"نوفمبر": "November",
			"ديسمبر": "December"
		};
		var parts = arabicDate.split(' ');
		var day = parts[1];
		var month = arabicMonths[parts[2]];
		var year = parts[3];
		return new Date(`${month} ${day}, ${year}`);
	}
	
	

	var airports = []; 

	$.getJSON('airports.json', function(data) {
		// يمكنك التعامل مع البيانات هنا
		airports = data;
	});
	

	$('#searchButton').click(function () {
		// جلب قيمة الإدخال
		const countryInput = $('#countryInput').val().trim();

		var valueSearch = $("input[name='search1']:checked").val();
		var foundAirports;
		if(valueSearch === "country"){
	
			foundAirports = airports.filter(airport => 
				airport.countryName.toLowerCase().includes(countryInput)
			);
		}else if (valueSearch === "city"){
			foundAirports = airports.filter(airport => 
				airport.name.toLowerCase().includes(countryInput)
			);
		}else if (valueSearch === "airport"){
			foundAirports = airports.filter(airport => 
				airport.shortName.toLowerCase().includes(countryInput)
			);
		}


		// عرض النتيجة
		if (foundAirports.length > 0) {
			let resultText = '';
			foundAirports.forEach(airport => {
				// resultText += `اسم المطار هو ${airport.shortName} وكود المطار هو ${airport.code}<br>`;
				resultText += '<div class="airport-box"><div class="airport-name1">'+ airport.name +'</div><div class="airport-name">'+ airport.shortName +'</div><div class="airport-code">'+ airport.code +'</div></div>'
			});
			$('#result').html(resultText); // عرض النتائج في div
		} else {
			$('#result').html('لم يتم العثور على مطارات , اكتب اسم الدولة بشكل صحيح'); // في حالة عدم وجود نتائج
		}
	});


	$('ul.tabs li a').click(function(event){
		event.preventDefault();
		$('ul.tabs li a').removeClass('active');
		$(this).addClass('active');
		$('.tab-content').removeClass('active');
		var target = $(this).attr('href');
		$(target).addClass('active');
	});

	$('.btn-ty').click(function(){
	$('.btn-ty').removeClass('active');
	$(this).addClass('active');
});



chrome.storage.local.get(['flights', 'outbound', 'inbound', 'amman', 'stat'], function(result) {

	var flInOut;
	var flights = result.flights;
	var outbound = result.outbound;
	var inbound = result.inbound;
	var amman = result.amman;
	var stat = result.stat;
	
	var allData = {};
	allData['flights'] = flights;
	allData['outbound'] = outbound;
	allData['inbound'] = inbound;
	allData['amman'] = amman;
	
	const token = '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';
	const repo = 'account-me/json';
	const path = 'flights.json';
	const message = 'Update flight data';
	

	$('#save-data').on('click', function() {
		function base64EncodeUnicode(str) {
			// تحويل النص إلى Uint8Array ثم إلى base64
			let utf8Bytes = new TextEncoder().encode(str); // يقوم بتحويل النص إلى UTF-8
			let binaryString = '';
			utf8Bytes.forEach(byte => {
				binaryString += String.fromCharCode(byte);
			});
			return btoa(binaryString); // تحويل النص إلى base64
		}


		const fileContent = base64EncodeUnicode(JSON.stringify(allData, null, 2));

		// جلب الـ sha للملف الحالي إذا كان موجودًا (للتعديل عليه)
		$.ajax({
			url: `https://api.github.com/repos/${repo}/contents/${path}`,
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github.v3+json'
			},
			success: function(response) {
				const sha = response.sha;
				console.log(response);

				// تحديث الملف
				$.ajax({
					url: `https://api.github.com/repos/${repo}/contents/${path}`,
					method: 'PUT',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Accept': 'application/vnd.github.v3+json'
					},
					data: JSON.stringify({
						message: message,
						content: fileContent,
						sha: sha // sha الحالي للتعديل
					}),
					success: function(data) {
						console.log('File updated successfully:', data);
					},
					error: function(error) {
						console.log('Error updating file:', error);
					}
				});
			},
			error: function(error) {
				// إذا لم يكن الملف موجودًا، أنشئه
				if (error.status === 404) {
					$.ajax({
						url: `https://api.github.com/repos/${repo}/contents/${path}`,
						method: 'PUT',
						headers: {
							'Authorization': `Bearer ${token}`,
							'Accept': 'application/vnd.github.v3+json'
						},
						data: JSON.stringify({
							message: message,
							content: fileContent
						}),
						success: function(data) {
							console.log('File created successfully:', data);
						},
						error: function(error) {
							console.log('Error creating file:', error);
						}
					});
				} else {
					console.log('Error fetching file SHA:', error);
				}
			}
		});
		
		$("#msg1").text("تم حفظ البيانات").fadeIn(1000, function() {
            setTimeout(function() {
                $("#msg1").fadeOut(1000);
            }, 1500);
		});

	});
	
	
	$("#get-data").click(function(){
		
		function base64DecodeUnicode(str) {
			// فك التشفير من base64 إلى سلسلة UTF-8
			return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
		}
		

		$.ajax({
			url: `https://api.github.com/repos/${repo}/contents/${path}`,
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/vnd.github.v3+json'
			},
			success: function(response) {
				const fileContent = base64DecodeUnicode(response.content);
				const flightData = JSON.parse(fileContent);

				chrome.storage.local.set({ flights: flightData.flights });
				chrome.storage.local.set({ outbound: flightData.outbound });
				chrome.storage.local.set({ inbound: flightData.inbound });
				chrome.storage.local.set({ amman: flightData.amman });
				showData("total");
			},
			error: function(xhr, status, error) {
				console.error('Error fetching file data:', error);
			}
		});
		
		$("#msg1").text("تم تحميل البيانات").fadeIn(1000, function() {
            setTimeout(function() {
                $("#msg1").fadeOut(1000);
            }, 1500);
		});
		

	});
	
	
	
	
	function getThrid(startDate, endDate){
	startDate = new Date(startDate);
	endDate = new Date(endDate);
	var filteredFlights = amman.filter(function (flight) {
		var dDate = new Date(flight.dateNum1);
		return dDate >= startDate && dDate <= endDate;
	});

	var sortedFlights = filteredFlights.sort(function (a, b) {
		return a.amount1 - b.amount1;
	});
	var getTh3 = sortedFlights;
	return getTh3;
	}

	var radioTy = $("input[name='ty1']:checked").val();
	
	$("input[name='ty1']").change(function(){
	var radioTy1 = $(this).val();
	radioTy = radioTy1;
	$(".btn-ty.active").click();
	});

	$("#sort-all").click(function(){
	$(".pop-box").html("");
	if(radioTy === "total"){
		showData("all-total");
	}else{
		showData("all-date");
	}
	});

	$("#sort-1-2").click(function(){
	$(".pop-box").html("");
	if(radioTy === "total"){
		showData("total");
	}else{
		showData("date");
	}
	});

	$("#sort-1-3").click(function(){
		$(".pop-box").html("");
		if(radioTy === "total"){
			showData("one-th3-total");
		}else{
			showData("one-th3-date");
		}
	});

	$("#sort-th3").click(function(){
		$(".pop-box").html("");
		if(radioTy === "total"){
			showData("total");
		}else{
			showData("date");
		}
		});

	$("#sort-one").click(function(){
		$(".pop-box").html("");
		if(radioTy === "total"){
			showData("one-total");
		}else{
			showData("one-date");
		}
	});

	$("#sort-two").click(function(){
		$(".pop-box").html("");
		if(radioTy === "total"){
			showData("two-total");
		}else{
			showData("two-date");
		}
	});


	$("#sort-th3").click(function(){
		$(".pop-box").html("");
		if(radioTy === "total"){
			showData("th3-total");
		}else{
			showData("th3-date");
		}
		});
	
	
	


	try{
		showData("total");
	}catch(x1){}
	
	
	function showData(ty){


		if(ty == "all-date"){
		flInOut = flights;
		var sortedList = flInOut.sort(function(a, b) {
			var dateA = parseArabicDate(a.date1);
			var dateB = parseArabicDate(b.date1);
			if (dateA - dateB === 0) {
			return a.total - b.total;
			} else {
				return dateA - dateB;
			}
		});
		}

		if(ty == "all-total"){
		flInOut = flights;
		var sortedList = flInOut.sort(function(a, b) {
		var dateA = parseArabicDate(a.date1);
		var dateB = parseArabicDate(b.date1);
		if (a.total - b.total === 0) {
			return dateA - dateB;
		} else {
			return a.total - b.total;
		}
		});
	}

	if(ty == "one-th3-date"){
		flInOut = flights;
		var sortedList = flInOut.sort(function(a, b) {
			var dateA = parseArabicDate(a.date1);
			var dateB = parseArabicDate(b.date1);
			if (dateA - dateB === 0) {
			return a.total - b.total;
			} else {
				return dateA - dateB;
			}
		});
		}

		if(ty == "one-th3-total"){
		flInOut = flights;
		var sortedList = flInOut.sort(function(a, b) {
		var dateA = parseArabicDate(a.date1);
		var dateB = parseArabicDate(b.date1);
		if (a.total - b.total === 0) {
			return dateA - dateB;
		} else {
			return a.total - b.total;
		}
		});
	}

	if(ty == "date"){
		flInOut = flights;
		var sortedList = flInOut.sort(function(a, b) {
			var dateA = parseArabicDate(a.date1);
			var dateB = parseArabicDate(b.date1);
			if (dateA - dateB === 0) {
			return a.total - b.total;
			} else {
				return dateA - dateB;
			}
		});
		}
		
		if(ty == "total"){
			flInOut = flights;
		var sortedList = flInOut.sort(function(a, b) {
			var dateA = parseArabicDate(a.date1);
			var dateB = parseArabicDate(b.date1);
			if (a.total - b.total === 0) {
			return dateA - dateB;
			} else {
				return a.total - b.total;
			}
		});
		}
		if(ty == "one-date"){
			flInOut = outbound;
		var sortedList = flInOut.sort(function(a, b) {
			var dateA = parseArabicDate(a.date1);
			var dateB = parseArabicDate(b.date1);
			if (dateA - dateB === 0) {
			return a.amount1 - b.amount1;
			} else {
				return dateA - dateB;
			}
		});
		}

		if(ty == "one-total"){
		flInOut = outbound;
		var sortedList = flInOut.sort(function(a, b) {
		var dateA = parseArabicDate(a.date1);
		var dateB = parseArabicDate(b.date1);
		if (a.amount1 - b.amount1 === 0) {
			return dateA - dateB;
		} else {
			return a.amount1 - b.amount1;
		}
		});
	}
		if(ty == "two-date"){
			flInOut = inbound;
		var sortedList = flInOut.sort(function(a, b) {
			var dateA = parseArabicDate(a.date2);
			var dateB = parseArabicDate(b.date2);
			if (dateA - dateB  === 0) {
			return a.amount2 - b.amount2;
			} else {
				return dateA - dateB;
			}
		});
		}

		if(ty == "two-total"){
		flInOut = inbound;
		var sortedList = flInOut.sort(function(a, b) {
		var dateA = parseArabicDate(a.date2);
		var dateB = parseArabicDate(b.date2);
		if (a.amount2 - b.amount2 === 0) {
			return dateA - dateB;
			} else {
				return a.amount2 - b.amount2;
			}
		});
	}

		if(ty == "th3-date"){
		flInOut = amman;
		var sortedList = flInOut.sort(function(a, b) {
		var dateA = parseArabicDate(a.date1);
		var dateB = parseArabicDate(b.date1);
		if (dateA - dateB === 0) {
			return a.amount1 - b.amount1;
			} else {
				return dateA - dateB;
			}
		});
	}

	if(ty == "th3-total"){
		flInOut = amman;
		var sortedList = flInOut.sort(function(a, b) {
		var dateA = parseArabicDate(a.date1);
		var dateB = parseArabicDate(b.date1);
		if (a.amount1 - b.amount1 === 0) {
			return dateA - dateB;
			} else {
				return a.amount1 - b.amount1;
			}
		});
	}
		flInOut.forEach(function(ee){

			if(stat !== "true"){
				return;
			}
			
			if(ee.site === "flynas" || ee.site1 === "flynas" || ee.site2 === "flynas"){
				var vv1 = '<div class="tooltiptext1">'+ee.seatleft1+'</div>';
				var vv2 = '<div class="tooltiptext2">'+ee.seatleft2+'</div>';
			}else
			{
				var vv1 = '';
				var vv2 = '';
			}
			try{

	
				var goLink = `https://booking.flynas.com/#/booking/search-redirect?origin=${getCode(ee.depart1)}&destination=${getCode(ee.arrive1)}&origin1=${getCode(ee.depart2)}&destination1=${getCode(ee.arrive2)}&currency=SAR&departureDate=${ee.dateNum1}&returnDate=${ee.dateNum2}&flightMode=multi&adultCount=1&childCount=0&infantCount=0&promoCode=&naSmiles=false&specialDiscount=null&culture=en-GB&reference=undefined&multicityObject=%5B%5D&locationsource=SA`;

				var newProducts = '<div class="flight-box '+ ee.site +'">';
				if(ee.timeout == 1){
					newProducts     += '<div class="clock-box"><img src="clock.png" alt="timeout"></div>';
				}
				newProducts     += '<div class="plane-box"><a target="_blank" href="'+ goLink +'"><img src="plane.png" alt="plane"></a></div>';
				newProducts     += '<div class="row">';
				newProducts       += '<div class="col-4 seat1">' + ee.date1 + vv1 + '</div>';
				newProducts       += '<div class="col-2"><bdi>' + ee.depart1 + '</bdi></div>';
				newProducts       += '<div class="col-2"><bdi>' + ee.arrive1 + '</bdi></div>';
				newProducts       += '<div class="col-2"><bdi>' + ee.amount1 + ' <div class="rs1">RS</div></bdi></div>';
				newProducts       += '<div class="col-2 total-rs">اجمالي بالريال</div>';
				newProducts    += '</div>';
				newProducts     += '<div class="row">';
				newProducts       += '<div class="col-4 seat2">' + ee.date2 + vv2 +'</div>';
				newProducts       += '<div class="col-2"><bdi>' + ee.depart2 + '</bdi></div>';
				newProducts       += '<div class="col-2"><bdi>' + ee.arrive2 + '</bdi></div>';
				newProducts       += '<div class="col-2"><bdi>' + ee.amount2 + ' <div class="rs1">RS</div></bdi></div>';
				newProducts       += '<div class="col-2 total-num">'+ ee.total +'</div>';
				newProducts    += '</div>';
				newProducts += '</div>';
			}catch(e){}

			try{
				var thisThrid = getThrid(ee.dateNum1, ee.dateNum2);
				var thisThrid1 = thisThrid[0];

				$.each(thisThrid, function(index, item) {

					var ar1 = ee.arrive1.trim();
					var timelist1xx = ar1.match(/\d+/g);
					var timeInNumber1xx = parseInt(timelist1xx.join(''));

					var de2 = item.depart1.trim();
					var timelist2xx = de2.match(/\d+/g);
					var timeInNumber2xx = parseInt(timelist2xx.join(''));

					var btwTime = timeInNumber2xx - timeInNumber1xx;
					if(item.date1 === ee.date1 && btwTime < 200){
						return true;
					}else{
						thisThrid1 = item;
						return false;
					}
							
				});

				if(thisThrid1.depart1.includes("المدينة")){var deThrid = thisThrid1.depart1.replace("المنورة ", "");}else{var deThrid = thisThrid1.depart1;}
				if(thisThrid1.arrive1.includes("(+1)")){var arThrid = thisThrid1.arrive1.replace("(+1)", "");}else{var arThrid = thisThrid1.arrive1;}
				

				var goLink = `https://booking.flynas.com/#/booking/search-redirect?origin=${getCode(ee.depart1)}&destination=${getCode(ee.arrive1)}&origin1=${getCode(deThrid)}&destination1=${getCode(arThrid)}&currency=SAR&departureDate=${ee.dateNum1}&returnDate=${thisThrid1.dateNum1}&flightMode=multi&adultCount=1&childCount=0&infantCount=0&promoCode=&naSmiles=false&specialDiscount=null&culture=en-GB&reference=undefined&multicityObject=%5B%5D&locationsource=SA`;

				var newProducts1 = '<div class="flight-box '+ ee.site +'">';arThrid
				var tot13 = ee.amount1 + thisThrid1.amount1;
				newProducts1     += '<div class="plane-box"><a target="_blank" href="'+ goLink +'"><img src="plane.png" alt="plane"></a></div>';
				newProducts1     += '<div class="row">';
				newProducts1       += '<div class="col-4 seat1">' + ee.date1 + vv1 + '</div>';
				newProducts1       += '<div class="col-2"><bdi>' + ee.depart1 + '</bdi></div>';
				newProducts1       += '<div class="col-2"><bdi>' + ee.arrive1 + '</bdi></div>';
				newProducts1       += '<div class="col-2"><bdi>' + ee.amount1 + ' <div class="rs1">RS</div></bdi></div>';
				newProducts1       += '<div class="col-2 total-rs">اجمالي بالريال</div>';
				newProducts1    += '</div>';
				newProducts1     += '<div class="row">';
				newProducts1       += '<div class="col-4 seat2">' + thisThrid1.date1 + vv2 +'</div>';
				newProducts1       += '<div class="col-2"><bdi>' + deThrid + '</bdi></div>';
				newProducts1       += '<div class="col-2"><bdi>' + arThrid + '</bdi></div>';
				newProducts1       += '<div class="col-2"><bdi>' + thisThrid1.amount1 + ' <div class="rs1">RS</div></bdi></div>';
				newProducts1       += '<div class="col-2 total-num">'+ tot13 +'</div>';
				newProducts1    += '</div>';
				newProducts1 += '</div>';
			}catch(e){}

			try{
				
				var thisThrid = getThrid(ee.dateNum1, ee.dateNum2);
				

				var thisThrid1 = thisThrid[0];

				$.each(thisThrid, function(index, item) {

					var ar1 = ee.arrive1.trim();
					var timeAr1 = ar1.match(/\d+/g);
					var ntimeAr1 = parseInt(timeAr1.join(''));

					var de2 = ee.depart2.trim();
					var timeDe2 = de2.match(/\d+/g);
					var ntimeDe2 = parseInt(timeDe2.join(''));

					var de3 = item.depart1.trim();
					var timeDe3 = de3.match(/\d+/g);
					var ntimeDe3 = parseInt(timeDe3.join(''));

					var ar3 = item.arrive1.trim();
					var timeAr3 = ar3.match(/\d+/g);
					var ntimeAr3 = parseInt(timeAr3.join(''));

					var btwTime1 = ntimeDe3 - ntimeAr1;
					var btwTime2 = ntimeDe2 - ntimeAr3;

					if((item.date1 === ee.date1 && btwTime1 < 99) || (item.date1 === ee.date2 && btwTime2 < 199) || (item.date1 === ee.date2 && ntimeDe3 > 1099)){
						return true;
					}else{
						thisThrid1 = item;
						return false;
					}
							
				});

				var total99 = ee.total + thisThrid1.amount1;
				if(thisThrid1.depart1.includes("المدينة")){var deThrid = thisThrid1.depart1.replace("المنورة ", "");}else{var deThrid = thisThrid1.depart1;}
				if(thisThrid1.arrive1.includes("(+1)")){var arThrid = thisThrid1.arrive1.replace("(+1)", "");}else{var arThrid = thisThrid1.arrive1;}

				
				var goLink = `https://booking.flynas.com/#/booking/search-redirect?origin=${getCode(ee.depart1)}&destination=${getCode(ee.arrive1)}&origin1=${getCode(deThrid)}&destination1=${getCode(arThrid)}&currency=SAR&departureDate=${ee.dateNum1}&returnDate=${thisThrid1.dateNum1}&flightMode=multi&adultCount=1&childCount=0&infantCount=0&promoCode=&naSmiles=false&specialDiscount=null&culture=en-GB&reference=undefined&multicityObject=%5B%7B%22origin%22%3A%22JED%22%2C%22destination%22%3A%22EG1%22%2C%22departureDate%22%3A%22${ee.dateNum2}%22%7D%5D&locationsource=SA`;
				var newProducts3 = '<div class="flight-box '+ ee.site +'">';
				if(ee.timeout == 1){
					newProducts3     += '<div class="clock-box"><img src="clock.png" alt="timeout"></div>';
				}
				
				newProducts3     += '<div class="plane-box"><a target="_blank" href="'+ goLink +'"><img src="plane.png" alt="plane"></a></div>';
				newProducts3     += '<div class="row">';
				newProducts3       += '<div class="col-4 seat1">' + ee.date1 + vv1 + '</div>';
				newProducts3       += '<div class="col-2"><bdi>' + ee.depart1 + '</bdi></div>';
				newProducts3       += '<div class="col-2"><bdi>' + ee.arrive1 + '</bdi></div>';
				newProducts3       += '<div class="col-2"><bdi>' + ee.amount1 + ' <div class="rs1">RS</div></bdi></div>';
				newProducts3       += '<div class="col-2 total-rs">الاجمالي</div>';
				newProducts3    += '</div>';
				newProducts3     += '<div class="row">';
				newProducts3       += '<div class="col-4 seat2">' + thisThrid1.date1 + vv2 +'</div>';
				newProducts3       += '<div class="col-2"><bdi>' + deThrid + '</bdi></div>';
				newProducts3       += '<div class="col-2"><bdi>' + arThrid + '</bdi></div>';
				newProducts3       += '<div class="col-2"><bdi>' + thisThrid1.amount1 + ' <div class="rs1">RS</div></bdi></div>';
				newProducts3       += '<div class="col-2 total-num">'+ total99 +'</div>';
				newProducts3    += '</div>';
				newProducts3     += '<div class="row">';
				newProducts3       += '<div class="col-4 seat2">' + ee.date2 + vv2 +'</div>';
				newProducts3       += '<div class="col-2"><bdi>' + ee.depart2 + '</bdi></div>';
				newProducts3       += '<div class="col-2"><bdi>' + ee.arrive2 + '</bdi></div>';
				newProducts3       += '<div class="col-2"><bdi>' + ee.amount2 + ' <div class="rs1">RS</div></bdi></div>';
				newProducts3       += '<div class="col-2 total-rs">ريال</div>';
				newProducts3    += '</div>';
				newProducts3 += '</div>';
			}catch(e){console.log(e);}


			try{
				var goLink = `https://booking.flynas.com/#/booking/search-redirect?origin=${getCode(ee.depart1)}&destination=${getCode(ee.arrive1)}&origin1=undefined&destination1=undefined&currency=SAR&departureDate=${ee.dateNum1}&returnDate=${ee.dateNum1}&flightMode=oneway&adultCount=1&childCount=0&infantCount=0&promoCode=&naSmiles=false&specialDiscount=null&culture=en-GB&reference=undefined&multicityObject=%5B%5D&locationsource=SA`;
				var oneFlights = '<div class="flight-box '+ ee.site1 +'">';
				oneFlights     += '<div class="plane-box"><a target="_blank" href="'+ goLink +'"><img src="plane.png" alt="plane"></a></div>';
				oneFlights     += '<div class="row">';
				oneFlights       += '<div class="col-5 seat1">' + ee.date1 + vv1 +'</div>';
				oneFlights       += '<div class="col-2"><bdi>' + ee.depart1 + '</bdi></div>';
				oneFlights       += '<div class="col-2"><bdi>' + ee.arrive1 + '</bdi></div>';
				oneFlights       += '<div class="col-3"><bdi style="font-size: 18px;">' + ee.amount1 + ' <div class="rs1">ريال</div></bdi></div>';
				oneFlights    += '</div>';
				oneFlights += '</div>';
			}catch(e){}
			
			try{
				var goLink = `https://booking.flynas.com/#/booking/search-redirect?origin=${getCode(ee.depart2)}&destination=${getCode(ee.arrive2)}&origin1=undefined&destination1=undefined&currency=SAR&departureDate=${ee.dateNum2}&returnDate=${ee.dateNum2}&flightMode=oneway&adultCount=1&childCount=0&infantCount=0&promoCode=&naSmiles=false&specialDiscount=null&culture=en-GB&reference=undefined&multicityObject=%5B%5D&locationsource=SA`;
				var twoFlights = '<div class="flight-box '+ ee.site2 +'">';
				twoFlights     += '<div class="plane-box"><a target="_blank" href="'+ goLink +'"><img src="plane.png" alt="plane"></a></div>';
				twoFlights     += '<div class="row">';
				twoFlights       += '<div class="col-5 seat2">' + ee.date2 + vv2 +'</div>';
				twoFlights       += '<div class="col-2"><bdi>' + ee.depart2 + '</bdi></div>';
				twoFlights       += '<div class="col-2"><bdi>' + ee.arrive2 + '</bdi></div>';
				twoFlights       += '<div class="col-3"><bdi  style="font-size: 18px;">' + ee.amount2 + ' <div class="rs1">ريال</div></bdi></div>';
				twoFlights    += '</div>';
				twoFlights += '</div>';
			}catch(e){}

			try{
				if(ee.arrive1.includes("(+1)")){var arThrid = ee.arrive1.replace("(+1)", "");}else{var arThrid = ee.arrive1;}
				if(ee.depart1.includes("المدينة")){var deThrid = ee.depart1.replace("المنورة ", "");}else{var deThrid = ee.depart1;}
				var goLink = `https://booking.flynas.com/#/booking/search-redirect?origin=${getCode(deThrid)}&destination=${getCode(arThrid)}&origin1=undefined&destination1=undefined&currency=SAR&departureDate=${ee.dateNum1}&returnDate=${ee.dateNum1}&flightMode=oneway&adultCount=1&childCount=0&infantCount=0&promoCode=&naSmiles=false&specialDiscount=null&culture=en-GB&reference=undefined&multicityObject=%5B%5D&locationsource=SA`;
				var th3Flights = '<div class="flight-box '+ ee.site1 +'">';
				th3Flights     += '<div class="plane-box"><a target="_blank" href="'+ goLink +'"><img src="plane.png" alt="plane"></a></div>';
				th3Flights     += '<div class="row">';
				th3Flights       += '<div class="col-5 seat1">' + ee.date1 + vv1 +'</div>';
				th3Flights       += '<div class="col-2"><bdi>' + deThrid + '</bdi></div>';
				th3Flights       += '<div class="col-2"><bdi>' + arThrid + '</bdi></div>';
				th3Flights       += '<div class="col-3"><bdi  style="font-size: 18px;">' + ee.amount1 + ' <div class="rs1">ريال</div></bdi></div>';
				th3Flights    += '</div>';
				th3Flights += '</div>';
			}catch(e){}

			if(ty === "one-date" || ty === "one-total"){
				$('.pop-box').append(oneFlights);  
			}else if(ty === "two-date" || ty === "two-total"){
				$('.pop-box').append(twoFlights);  
			}else if(ty === "th3-date" || ty === "th3-total"){
				$('.pop-box').append(th3Flights);  
			}else if(ty === "all-total" || ty === "all-date"){
				$('.pop-box').append(newProducts3);  
			}else if(ty === "one-th3-date" || ty === "one-th3-total"){
				$('.pop-box').append(newProducts1);  
			}else{
				$('.pop-box').append(newProducts); 
			}
		});
	}
});
});
  
