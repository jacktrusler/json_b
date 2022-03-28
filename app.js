const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req,res) => {
	res.send({
		name: "Jason Kent Bateman",
		birthday: "14 January 1969",
		birthplace: "Rye, New York",
		nationality: "American",
		ethnicity: "White",
		zodiac: "Capricorn",
		height: "5ft 11in",
		weight: "167.5lbs",
	});
});

app.listen(port, () => console.log(`JSON_B running on port: ${port}`));
