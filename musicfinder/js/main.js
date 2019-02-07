$(document).ready(function(){
	
	$("input").first().focus();

	$(".playButton").click(function(){
		var title = $(this).closest(".songContainer").attr("data-title");
		var artist = $(this).closest(".songContainer").attr("data-artist");
		var genre = $(this).closest(".songContainer").attr("data-genre");
		var duration = $(this).closest(".songContainer").attr("data-duration");
		songPlayed(title,artist,genre,duration);
		alert("Song was played!");
	});

	$(".purchaseButton").click(function(){
		var title = $(this).closest(".songContainer").attr("data-title");
		var artist = $(this).closest(".songContainer").attr("data-artist");
		var genre = $(this).closest(".songContainer").attr("data-genre");
		var duration = $(this).closest(".songContainer").attr("data-duration");
		var price = $(this).closest(".songContainer").attr("data-price");
		songPurchased(title,artist,genre,duration,price);
		alert("Song was purchased!");
	});

	$("#upgradeButton").click(function(){
		var email = sessionStorage.email;
		$.get(
			"http://musicfinder.live/auth.php",
			{
				action: "upgrade",
				email: email
			},
			function (data) {
				if (data == 0) {
					alert("Server Error: please contact Neema");
				}
				else {
					planUpgraded();
					$("#upgradeButton").hide();
					$("#downgradeButton").show();
					alert("Plan was upgraded!");
				}
			},
			"jsonp"
		);
	});

	$("#downgradeButton").click(function(){
		var email = sessionStorage.email;
		$.get(
			"http://musicfinder.live/auth.php",
			{
				action: "downgrade",
				email: email
			},
			function (data) {
				if (data == 0) {
					alert("Server Error: please contact Neema");
				}
				else {
					planDowngraded();
					$("#upgradeButton").show();
					$("#downgradeButton").hide();
					alert("Plan was downgraded :(");
				}
			},
			"jsonp"
		);
	});

	$("#loginButton").click(function(){

		var email = $("input[name='email']").val().toLowerCase();
		var password = $("input[name='password']").val();
		
		$.get(
			"http://musicfinder.live/auth.php",
			{
				action: "login",
				email: email,
				password: password
			},
			function (data) {
				
				if (data == 0) {
					alert("Server Error: please contact Neema");
				}
				else if (data == 2) {
					alert("Invalid credentials. Please try again.");
				}
				else {
					var user = JSON.parse(data);
					sessionStorage.email = email;
					sessionStorage.genre = user.genre;
					sessionStorage.plan = user.plan;
					sessionStorage.loggedIn = true;
					sessionStorage.justLoggedIn = true;
					setTimeout(function(){
						window.location.href = "home.html";
					},333);
				}
			},
			"jsonp"
		);
	});

	$("#signupButton").click(function(){
		
		var name = $("input[name='name']").val().toLowerCase();
		var email = $("input[name='email']").val().toLowerCase();
		var password = $("input[name='password']").val();
		var genre = $("select[name='genre']").val();
		var plan = $("select[name='plan']").val();
		
		$.get(
			"http://musicfinder.live/auth.php",
			{
				action: "signup",
				email: email,
				password: password,
				genre: genre,
				plan: plan
			},
			function (data) {
				if (data == 0) {
					alert("Server Error: please contact Neema");
				}
				else if (data == 2) {
					alert("Sorry, that email address has already been used.");
				}
				else {
					var user = JSON.parse(data);
					sessionStorage.email = email;
					sessionStorage.name = name;
					sessionStorage.genre = genre;
					sessionStorage.plan = plan;
					sessionStorage.loggedIn = true;
					sessionStorage.justCreatedAccount = true;
					setTimeout(function(){
						window.location.href = "home.html";
					},333);
				}
			},
			"jsonp"
		);

	});

	if (sessionStorage.justLoggedIn) {
		sessionStorage.removeItem("justLoggedIn");
		login(sessionStorage.email);
	}

	if (sessionStorage.justCreatedAccount) {
		sessionStorage.removeItem("justCreatedAccount");
		accountCreated(sessionStorage.name,sessionStorage.email,sessionStorage.genre,sessionStorage.plan);
	}

	$("#logoutButton").click(function(){
		sessionStorage.removeItem("loggedIn");
		setTimeout(function(){
			window.location.replace("index.html");
		},333);
	});

	if (sessionStorage.plan == "Premium") {
		$("#upgradeButton").hide();
	}
	if (sessionStorage.plan == "Free") {
		$("#downgradeButton").hide();
	}

	if (sessionStorage.genre) {
		$('[data-genre="'+sessionStorage.genre+'"]').show();
	}

})