function login() {
	var id = $("#id").val();
	var pw = $("#pw").val();
	var autoLogin = $("#auto_login").prop("checked");
	
	var $form = $("#loginForm");
	$("#loginForm input[name=id]").remove();
	$form.append('<input name="id" value="' + id + '" />');
	$("#loginForm input[name=pw]").remove();
	$form.append('<input name="pw" value="' + pw + '" />');
	$("#loginForm input[name=autoLogin]").remove();
	$form.append('<input name="autoLogin" value="' + autoLogin + '" />');
	
	$.ajax({
		url: "/ajax/login",
		method: "post",
		data: $form.serialize()
	}).done(function(res) {
		if (p !== null && p !== '') {
			if (p === 'childLearning') {
				location.replace('/#childLearning');
				return;
			}
			location.replace(p);
			return;
		}
		location.href = "/";
	}).fail(function(err) {
		var validError = err.responseJSON.validationError === null ? "" : err.responseJSON.validationError.message;
		switch(validError) {
		case "id null":
		case "id empty":
			alert("아이디를 입력하세요.");
			return;
		case "pw null":
		case "pw empty":
			alert("비밀번호를 입력하세요.");
			return;
		default:
			alert(err.responseJSON.error || "에러가 발생했습니다.");
			return;
		}
	});
}

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCY2BZwtJudVwsqMyFj8FXWOBhC6QY-0dI",
  authDomain: "littlehomelearn.firebaseapp.com",
  databaseURL: "https://littlehomelearn.firebaseio.com",
  projectId: "littlehomelearn",
  storageBucket: "littlehomelearn.appspot.com",
  messagingSenderId: "104394237981",
  appId: "1:104394237981:web:3ddf6415bdb548a306fef4",
  measurementId: "G-E3TS8LEN8X"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function kakao() {
	$.ajax({
		url: "/social/kakao/signin",
		method: "post"
	}).done(function(res) {
		location.href = res.result;
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
}

function naver() {
	$.ajax({
		url: "/social/naver/signin",
		method: "post"
	}).done(function(res) {
		location.href = res.result;
	}).fail(function(err) {
		alert(err.responseJSON.error || "에러가 발생했습니다.");
	});
}

function facebook() {
	var provider = new firebase.auth.FacebookAuthProvider();
	provider.addScope('email');
	firebase.auth().signInWithPopup(provider).then(function(result) {
		console.log(result);
		$("#loginForm input").remove();
		var $form = $("#loginForm");
		$form.append('<input name="code" value="' + result.credential.accessToken + '" />');
		$form.append('<input name="id" value="' + result.user.uid + '" />');
		$form.append('<input name="name" value="' + result.user.displayName + '" />');
		$form.append('<input name="email" value="' + result.user.email + '" />');
		$form.attr("method", "post");
		$form.attr("action", "/social/facebook/callback");
		$form.submit();
	}).catch(function(error) {
		console.error(error);
		if (error.credential !== undefined || error.credential !== null) {
			$("#loginForm input").remove();
			var $form = $("#loginForm");
			$form.append('<input name="code" value="' + error.credential.accessToken + '" />');
			$form.append('<input name="id" value="" />');
			$form.append('<input name="name" value="" />');
			$form.append('<input name="email" value="" />');
			$form.attr("method", "post");
			$form.attr("action", "/social/facebook/callback");
			$form.submit();
		}
	});
}

function google() {
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
	firebase.auth().signInWithPopup(provider).then(function(result) {
		console.log(result);
		$("#loginForm input").remove();
		var $form = $("#loginForm");
		$form.append('<input name="code" value="' + result.credential.idToken + '" />');
		$form.append('<input name="id" value="' + result.user.uid + '" />');
		$form.append('<input name="name" value="' + result.user.displayName + '" />');
		$form.append('<input name="email" value="' + result.user.email + '" />');
		$form.attr("method", "post");
		$form.attr("action", "/social/google/callback");
		$form.submit();
	}).catch(function(error) {
		console.error(error);
		if (error.credential !== undefined || error.credential !== null) {
			$("#loginForm input").remove();
			var $form = $("#loginForm");
			$form.append('<input name="code" value="' + error.credential.idToken + '" />');
			$form.append('<input name="id" value="" />');
			$form.append('<input name="name" value="" />');
			$form.append('<input name="email" value="" />');
			$form.attr("method", "post");
			$form.attr("action", "/social/google/callback");
			$form.submit();
		}
	});
}

initEndCallback = function() {
	if (location.search.indexOf("?a&") > -1) {
		alert("로그인이 필요한 서비스 입니다.");
	}
};