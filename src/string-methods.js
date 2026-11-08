'use strict';

// Standalone examples for looking up Python methods during CS50P assignments.
module.exports=[
 {label:'.lower()', purpose:'Make letters lowercase.', example:'"Good Morning".lower()', result:"'good morning'"},
 {label:'.upper()', purpose:'Make letters uppercase.', example:'"good night".upper()', result:"'GOOD NIGHT'"},
 {label:'.capitalize()', purpose:'Capitalize the first letter and make the rest lowercase.', example:'"hELLO WORLD".capitalize()', result:"'Hello world'"},
 {label:'.title()', purpose:'Capitalize the start of each word.', example:'"blue sky".title()', result:"'Blue Sky'"},
 {label:'.strip()', purpose:'Remove spaces, tabs, and line breaks from both ends.', example:'"  garden  ".strip()', result:"'garden'", tip:'Use lstrip() or rstrip() to clean just one end.'},
 {label:'.lstrip(chars)', purpose:'Remove spaces or chosen characters from the start.', example:'"$$balance".lstrip("$")', result:"'balance'", tip:'It removes any of the listed characters from the start.'},
 {label:'.rstrip(chars)', purpose:'Remove spaces or chosen characters from the end.', example:'"discount%%%".rstrip("%")', result:"'discount'", tip:'It removes any of the listed characters from the end.'},
 {label:'.replace(old, new)', purpose:'Replace matching text with new text.', example:'"red bike".replace("red", "blue")', result:"'blue bike'"},
 {label:'.split()', purpose:'Break text into a list of pieces.', example:'"red blue".split()', result:"['red', 'blue']"},
 {label:'.startswith(prefix)', purpose:'Check whether text begins with something.', example:'"Python".startswith("Py")', result:'True'},
 {label:'.endswith(suffix)', purpose:'Check whether text ends with something.', example:'"picture.png".endswith(".png")', result:'True'},
 {label:'.isupper()', purpose:'Check whether letters are all uppercase.', example:'"NASA".isupper()', result:'True'},
 {label:'.isalpha()', purpose:'Check whether every character is a letter.', example:'"Robotics".isalpha()', result:'True'},
 {label:'.isalnum()', purpose:'Check whether every character is a letter or number.', example:'"Team2137".isalnum()', result:'True'},
 {label:'.isdigit()', purpose:'Check whether every character is a digit.', example:'"2048".isdigit()', result:'True', tip:'Some special digit symbols also pass this check. Compare isdecimal().'},
 {label:'.isdecimal()', purpose:'Check whether every character is a decimal digit.', example:'"123".isdecimal()', result:'True', tip:'Try ²: isdigit() returns True, while isdecimal() returns False.'},
];
