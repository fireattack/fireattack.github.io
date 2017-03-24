$("head").append("<link>");
$("head").children(":last").attr({
	rel: "stylesheet",
	type: "text/css",
	href: 'styles.css'
});
