$(document).ready(function(){

	$("input").first().focus();

	$(".playButton").click(function(){
		var song = {
			title: $(this).closest(".songContainer").attr("data-title"),
			artist: $(this).closest(".songContainer").attr("data-artist"),
			genre: $(this).closest(".songContainer").attr("data-genre"),
			duration: $(this).closest(".songContainer").attr("data-duration")
		}
		songPlayed(song);
		alert("Song was played!");
	});

	$(".purchaseButton").click(function(){
		var song = {
			title: $(this).closest(".songContainer").attr("data-title"),
			artist: $(this).closest(".songContainer").attr("data-artist"),
			genre: $(this).closest(".songContainer").attr("data-genre"),
			duration: $(this).closest(".songContainer").attr("data-duration"),
			price: $(this).closest(".songContainer").attr("data-price")
		}
		songPurchased(song);
		alert("Song was purchased!");
	});

	$("#upgradeButton").click(function(){
		var email = sessionStorage.email;
		$.get(
			config.auth,
			{
				action: "upgrade",
				email: email
			},
			function (data) {
				if (data == 0) {
					alert("Server Error: please contact Neema");
				}
				else {
					sessionStorage.plan = "Premium";
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
			config.auth,
			{
				action: "downgrade",
				email: email
			},
			function (data) {
				if (data == 0) {
					alert("Server Error: please contact Neema");
				}
				else {
					sessionStorage.plan = "Free";
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
			config.auth,
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
					sessionStorage.id = user.id;
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
		var plan;
		if (config.plan) {
			plan = $("select[name='plan']").val();
		}
		$.get(
			config.auth,
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
					sessionStorage.id = user.id;
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
		var user = {
			name: sessionStorage.name,
			email: sessionStorage.email,
			favorite_genre: sessionStorage.genre,
			plan: sessionStorage.plan,
			id: sessionStorage.id
		}
		login(user);
	}

	if (sessionStorage.justCreatedAccount) {
		sessionStorage.removeItem("justCreatedAccount");
		var user = {
			name: sessionStorage.name,
			email: sessionStorage.email,
			favorite_genre: sessionStorage.genre,
			plan: sessionStorage.plan,
			id: sessionStorage.id
		}
		accountCreated(user);
	}

	$("#logoutButton").click(function(){
		sessionStorage.removeItem("loggedIn");
		setTimeout(function(){
			window.location.replace("index.html");
		},333);
	});

	if (config.plan) {
		if (sessionStorage.plan == "Premium") {
			$("#upgradeButton").hide();
		}
		if (sessionStorage.plan == "Free") {
			$("#downgradeButton").hide();
		}
	}

	if (sessionStorage.genre) {
		$('[data-genre="'+sessionStorage.genre+'"]').show();
	}

})