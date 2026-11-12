/* Original unsolved CS50P learning scaffolds for Python Lab.
 * Assignment names, filenames, and links correspond to Harvard's official
 * CS50P Problem Sets 0-8. Code and teaching prompts are newly authored.
 */
(() => {
 'use strict';
 const subjects=["Functions & Variables","Conditionals","Loops","Exceptions","Libraries","Unit Tests","File I/O","Regular Expressions","OOP"];
 const catalog=[
 {
  "id": "cs50p-0-indoor",
  "set": 0,
  "slug": "indoor",
  "title": "Indoor Voice",
  "filename": "indoor.py",
  "goal": "Read a string and produce its lowercase equivalent.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/0/indoor/"
 },
 {
  "id": "cs50p-0-playback",
  "set": 0,
  "slug": "playback",
  "title": "Playback Speed",
  "filename": "playback.py",
  "goal": "Practice replacing spaces in a string.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/0/playback/"
 },
 {
  "id": "cs50p-0-faces",
  "set": 0,
  "slug": "faces",
  "title": "Making Faces",
  "filename": "faces.py",
  "goal": "Write convert(text) and a main function.",
  "functions": [
   "convert(text)"
  ],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/0/faces/"
 },
 {
  "id": "cs50p-0-einstein",
  "set": 0,
  "slug": "einstein",
  "title": "Einstein",
  "filename": "einstein.py",
  "goal": "Read mass and calculate an energy value.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/0/einstein/"
 },
 {
  "id": "cs50p-0-tip",
  "set": 0,
  "slug": "tip",
  "title": "Tip Calculator",
  "filename": "tip.py",
  "goal": "Write the two currency and percentage conversion helpers.",
  "functions": [
   "dollars_to_float(d)",
   "percent_to_float(p)"
  ],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/0/tip/"
 },
 {
  "id": "cs50p-1-deep",
  "set": 1,
  "slug": "deep",
  "title": "Deep Thought",
  "filename": "deep.py",
  "goal": "Practice conditionals and normalized user input.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/1/deep/"
 },
 {
  "id": "cs50p-1-bank",
  "set": 1,
  "slug": "bank",
  "title": "Home Federal Savings Bank",
  "filename": "bank.py",
  "goal": "Use string checks and ordered conditions.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/1/bank/"
 },
 {
  "id": "cs50p-1-extensions",
  "set": 1,
  "slug": "extensions",
  "title": "File Extensions",
  "filename": "extensions.py",
  "goal": "Classify filename extensions using conditions.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/1/extensions/"
 },
 {
  "id": "cs50p-1-interpreter",
  "set": 1,
  "slug": "interpreter",
  "title": "Math Interpreter",
  "filename": "interpreter.py",
  "goal": "Parse two values and an operator from input.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/1/interpreter/"
 },
 {
  "id": "cs50p-1-meal",
  "set": 1,
  "slug": "meal",
  "title": "Meal Time",
  "filename": "meal.py",
  "goal": "Implement convert(time) for a 24-hour time string.",
  "functions": [
   "convert(time)"
  ],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/1/meal/"
 },
 {
  "id": "cs50p-2-camel",
  "set": 2,
  "slug": "camel",
  "title": "camelCase",
  "filename": "camel.py",
  "goal": "Loop over characters to transform a name.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/2/camel/"
 },
 {
  "id": "cs50p-2-coke",
  "set": 2,
  "slug": "coke",
  "title": "Coke Machine",
  "filename": "coke.py",
  "goal": "Repeatedly accept coins and track the balance.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/2/coke/"
 },
 {
  "id": "cs50p-2-twttr",
  "set": 2,
  "slug": "twttr",
  "title": "Just setting up my twttr",
  "filename": "twttr.py",
  "goal": "Filter selected letters out of a string.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/2/twttr/"
 },
 {
  "id": "cs50p-2-plates",
  "set": 2,
  "slug": "plates",
  "title": "Vanity Plates",
  "filename": "plates.py",
  "goal": "Create is_valid(s) to validate a plate string.",
  "functions": [
   "is_valid(s)"
  ],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/2/plates/"
 },
 {
  "id": "cs50p-2-nutrition",
  "set": 2,
  "slug": "nutrition",
  "title": "Nutrition Facts",
  "filename": "nutrition.py",
  "goal": "Look up nutrition information using a dictionary.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/2/nutrition/"
 },
 {
  "id": "cs50p-3-fuel",
  "set": 3,
  "slug": "fuel",
  "title": "Fuel Gauge",
  "filename": "fuel.py",
  "goal": "Validate a fraction, catch bad input, and format a gauge.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/3/fuel/"
 },
 {
  "id": "cs50p-3-taqueria",
  "set": 3,
  "slug": "taqueria",
  "title": "Felipe's Taqueria",
  "filename": "taqueria.py",
  "goal": "Track orders and a running total using a dictionary.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/3/taqueria/"
 },
 {
  "id": "cs50p-3-grocery",
  "set": 3,
  "slug": "grocery",
  "title": "Grocery List",
  "filename": "grocery.py",
  "goal": "Count repeated items until end-of-input.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/3/grocery/"
 },
 {
  "id": "cs50p-3-outdated",
  "set": 3,
  "slug": "outdated",
  "title": "Outdated",
  "filename": "outdated.py",
  "goal": "Parse and normalize date formats, retrying invalid entries.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/3/outdated/"
 },
 {
  "id": "cs50p-4-emojize",
  "set": 4,
  "slug": "emojize",
  "title": "Emojize",
  "filename": "emojize.py",
  "goal": "Use the emoji package to transform names into emoji.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/4/emojize/"
 },
 {
  "id": "cs50p-4-figlet",
  "set": 4,
  "slug": "figlet",
  "title": "Frank, Ian and Glen's Letters",
  "filename": "figlet.py",
  "goal": "Use command-line arguments and a FIGlet font.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/4/figlet/"
 },
 {
  "id": "cs50p-4-adieu",
  "set": 4,
  "slug": "adieu",
  "title": "Adieu, Adieu",
  "filename": "adieu.py",
  "goal": "Use an inflection library to format a list of names.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/4/adieu/"
 },
 {
  "id": "cs50p-4-game",
  "set": 4,
  "slug": "game",
  "title": "Guessing Game",
  "filename": "game.py",
  "goal": "Use random numbers, validation, and a guessing loop.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/4/game/"
 },
 {
  "id": "cs50p-4-professor",
  "set": 4,
  "slug": "professor",
  "title": "Little Professor",
  "filename": "professor.py",
  "goal": "Write get_level() and generate_integer(level).",
  "functions": [
   "get_level()",
   "generate_integer(level)"
  ],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/4/professor/"
 },
 {
  "id": "cs50p-4-bitcoin",
  "set": 4,
  "slug": "bitcoin",
  "title": "Bitcoin Price Index",
  "filename": "bitcoin.py",
  "goal": "Read a CLI argument and handle an HTTP request.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/4/bitcoin/"
 },
 {
  "id": "cs50p-5-test_twttr",
  "set": 5,
  "slug": "test_twttr",
  "title": "Testing my twttr",
  "filename": "test_twttr.py",
  "goal": "Build thorough pytest cases for shorten(word).",
  "functions": [
   "shorten(word)"
  ],
  "sourceFile": "twttr.py",
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/5/test_twttr/"
 },
 {
  "id": "cs50p-5-test_bank",
  "set": 5,
  "slug": "test_bank",
  "title": "Back to the Bank",
  "filename": "test_bank.py",
  "goal": "Write pytest cases for value(greeting).",
  "functions": [
   "value(greeting)"
  ],
  "sourceFile": "bank.py",
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/5/test_bank/"
 },
 {
  "id": "cs50p-5-test_plates",
  "set": 5,
  "slug": "test_plates",
  "title": "Re-requesting a Vanity Plate",
  "filename": "test_plates.py",
  "goal": "Write tests for is_valid(s) and boundary cases.",
  "functions": [
   "is_valid(s)"
  ],
  "sourceFile": "plates.py",
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/5/test_plates/"
 },
 {
  "id": "cs50p-5-test_fuel",
  "set": 5,
  "slug": "test_fuel",
  "title": "Refueling",
  "filename": "test_fuel.py",
  "goal": "Write tests for convert(fraction) and gauge(percentage).",
  "functions": [
   "convert(fraction)",
   "gauge(percentage)"
  ],
  "sourceFile": "fuel.py",
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/5/test_fuel/"
 },
 {
  "id": "cs50p-6-lines",
  "set": 6,
  "slug": "lines",
  "title": "Lines of Code",
  "filename": "lines.py",
  "goal": "Read a Python file from sys.argv and count code lines.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/6/lines/"
 },
 {
  "id": "cs50p-6-pizza",
  "set": 6,
  "slug": "pizza",
  "title": "Pizza Py",
  "filename": "pizza.py",
  "goal": "Read CSV data and print a formatted table.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/6/pizza/"
 },
 {
  "id": "cs50p-6-scourgify",
  "set": 6,
  "slug": "scourgify",
  "title": "Scourgify",
  "filename": "scourgify.py",
  "goal": "Transform a source CSV into a new CSV.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/6/scourgify/"
 },
 {
  "id": "cs50p-6-shirt",
  "set": 6,
  "slug": "shirt",
  "title": "CS50 P-Shirt",
  "filename": "shirt.py",
  "goal": "Combine images using Pillow and file arguments.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/6/shirt/"
 },
 {
  "id": "cs50p-7-numb3rs",
  "set": 7,
  "slug": "numb3rs",
  "title": "NUMB3RS",
  "filename": "numb3rs.py",
  "goal": "Write validate(ip) and tests for IPv4 inputs.",
  "functions": [
   "validate(ip)"
  ],
  "sourceFile": null,
  "testFile": "test_numb3rs.py",
  "url": "https://cs50.harvard.edu/python/psets/7/numb3rs/"
 },
 {
  "id": "cs50p-7-watch",
  "set": 7,
  "slug": "watch",
  "title": "Watch on YouTube",
  "filename": "watch.py",
  "goal": "Write parse(s) to extract a video URL from HTML.",
  "functions": [
   "parse(s)"
  ],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/7/watch/"
 },
 {
  "id": "cs50p-7-working",
  "set": 7,
  "slug": "working",
  "title": "Working 9 to 5",
  "filename": "working.py",
  "goal": "Write convert(s) and test time formats.",
  "functions": [
   "convert(s)"
  ],
  "sourceFile": null,
  "testFile": "test_working.py",
  "url": "https://cs50.harvard.edu/python/psets/7/working/"
 },
 {
  "id": "cs50p-7-um",
  "set": 7,
  "slug": "um",
  "title": "Regular, um, Expressions",
  "filename": "um.py",
  "goal": "Write count(s) and test word matching.",
  "functions": [
   "count(s)"
  ],
  "sourceFile": null,
  "testFile": "test_um.py",
  "url": "https://cs50.harvard.edu/python/psets/7/um/"
 },
 {
  "id": "cs50p-7-response",
  "set": 7,
  "slug": "response",
  "title": "Response Validation",
  "filename": "response.py",
  "goal": "Validate an email address with a library.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/7/response/"
 },
 {
  "id": "cs50p-8-seasons",
  "set": 8,
  "slug": "seasons",
  "title": "Seasons of Love",
  "filename": "seasons.py",
  "goal": "Use dates and readable number words; write unit tests.",
  "functions": [
   "calculate_minutes(birth_date)"
  ],
  "sourceFile": null,
  "testFile": "test_seasons.py",
  "url": "https://cs50.harvard.edu/python/psets/8/seasons/"
 },
 {
  "id": "cs50p-8-jar",
  "set": 8,
  "slug": "jar",
  "title": "Cookie Jar",
  "filename": "jar.py",
  "goal": "Implement the Jar class and its required properties.",
  "functions": [
   "Jar"
  ],
  "sourceFile": null,
  "testFile": "test_jar.py",
  "url": "https://cs50.harvard.edu/python/psets/8/jar/"
 },
 {
  "id": "cs50p-8-shirtificate",
  "set": 8,
  "slug": "shirtificate",
  "title": "CS50 Shirtificate",
  "filename": "shirtificate.py",
  "goal": "Make a PDF certificate using fpdf2 and an image.",
  "functions": [],
  "sourceFile": null,
  "testFile": null,
  "url": "https://cs50.harvard.edu/python/psets/8/shirtificate/"
 }
];


 // Derived only from file names, import statements, function/class
 // signatures, and test names in the project owner's private reference.
 // No implementation logic, assertions, API tokens, or solution text is copied.
 const reference={
  '0/faces':{functions:['convert(s)'],main:true},
  '0/tip':{functions:['dollars_to_float(d)','percent_to_float(p)'],main:true},
  '1/meal':{functions:['convert(time)'],main:true},
  '2/twttr':{functions:['is_vowel(letter)'],main:true},
  '2/plates':{functions:['is_valid(s)'],main:true},
  '4/emojize':{imports:['import emoji']},
  '4/figlet':{imports:['import random','import sys','from pyfiglet import Figlet']},
  '4/adieu':{imports:['import inflect']},
  '4/game':{imports:['import random'],functions:[],main:true},
  '4/professor':{imports:['import random'],functions:['get_level()','generate_integer(level)'],main:true},
  '4/bitcoin':{imports:['import os','import requests','import sys']},
  '5/test_twttr':{functions:['shorten(word)'],main:true,testNames:['test_shorten']},
  '5/test_bank':{functions:['value(greeting)'],main:true,testNames:['test_hello','test_with_h','test_without_h']},
  '5/test_plates':{functions:['is_valid(s)'],main:true,testNames:['test_starts_with_two_letters','test_two_to_six_characters','test_numbers_at_end','test_not_allowed']},
  '5/test_fuel':{functions:['convert(fraction)','gauge(percentage)'],main:true,testNames:['test_convert','test_gauge'],testImports:['import pytest']},
  '6/lines':{imports:['import sys']},
  '6/pizza':{imports:['import csv','import sys','from tabulate import tabulate']},
  '6/scourgify':{imports:['import csv','import sys']},
  '6/shirt':{imports:['import os','import sys','from PIL import Image, ImageOps']},
  '7/numb3rs':{imports:['import re'],functions:['validate(ip)'],main:true,testNames:['test_valid','test_invalid']},
  '7/watch':{imports:['import re'],functions:['parse(s)'],main:true},
  '7/working':{imports:['import re','import sys'],functions:['convert(s)'],main:true,testNames:['test_format','test_with_minutes','test_without_minutes'],testImports:['import pytest']},
  '7/um':{imports:['import re'],functions:['count(s)'],main:true,testNames:['test_0','test_1','test_2']},
  '7/response':{imports:['import validators'],main:true},
  '8/seasons':{imports:['import inflect','import sys','from datetime import date'],functions:[],main:true,testNames:['test_calculate'],testImports:['from datetime import date']},
  '8/jar':{functions:['Jar'],testNames:['test_init','test_str','test_deposit','test_withdraw'],testImports:['import pytest']},
  '8/shirtificate':{imports:['from fpdf import FPDF'],functions:[],main:true}
 };
 const learnerGuide={
 "0/indoor": {
  "mission": "Make a program that turns typed words into lowercase letters.",
  "steps": [
   "Ask the user to type a word or a sentence.",
   "Use a string tool to make the letters lowercase.",
   "Print the new text."
  ],
  "checks": [
   "Try the input HELLO.",
   "Try a sentence with spaces and numbers."
  ],
  "setup": "speech = input(\"Say something: \")"
 },
 "0/playback": {
  "mission": "Make a program that slows down a sentence by changing its spaces.",
  "steps": [
   "Ask the user to type a sentence.",
   "Change each space into three dots.",
   "Print the new sentence."
  ],
  "checks": [
   "Try a sentence with three words.",
   "Try one word with no spaces."
  ],
  "setup": "speech = input(\"Enter a sentence: \")"
 },
 "0/faces": {
  "mission": "Make a program that swaps typed faces for emoji.",
  "steps": [
   "Write the convert(s) function to change the two faces listed in the problem.",
   "In main(), ask for text and call convert(s).",
   "Print the changed text."
  ],
  "checks": [
   "Try each face on its own.",
   "Try a sentence with both faces."
  ]
 },
 "0/einstein": {
  "mission": "Use a math rule to find energy from mass.",
  "steps": [
   "Ask the user for a mass in kilograms.",
   "Turn the input into a number.",
   "Use the math rule shown on the problem page.",
   "Print the energy value."
  ],
  "checks": [
   "Try a mass of 1.",
   "Check that you used the speed of light twice."
  ],
  "setup": "mass_text = input(\"Mass (kg): \")"
 },
 "0/tip": {
  "mission": "Make a tip calculator for a restaurant meal.",
  "steps": [
   "Ask for the meal cost and the tip percent.",
   "Write dollars_to_float(d) to read a price.",
   "Write percent_to_float(p) to read a percent.",
   "Find the tip and print it as shown in the problem."
  ],
  "checks": [
   "Try a cost with cents.",
   "Try a percent with the % sign."
  ]
 },
 "1/deep": {
  "mission": "Check if the user knows a special answer.",
  "steps": [
   "Ask the user for an answer.",
   "Remove extra spaces at the start and end.",
   "Check the answers listed on the problem page.",
   "Print the right message."
  ],
  "checks": [
   "Try an answer written as digits.",
   "Try the word form with capital letters."
  ],
  "setup": "answer = input(\"What is the Answer? \")"
 },
 "1/bank": {
  "mission": "Pick a dollar amount based on a greeting.",
  "steps": [
   "Ask the user for a greeting.",
   "Make the letters the same case.",
   "Check the most exact greeting first.",
   "Print the dollar amount it earns."
  ],
  "checks": [
   "Try the special greeting.",
   "Try a different greeting that starts with H."
  ],
  "setup": "greeting = input(\"Greeting: \")"
 },
 "1/extensions": {
  "mission": "Find the file type from its name.",
  "steps": [
   "Ask for a file name.",
   "Look at the letters after the last dot.",
   "Match the ending to a file type.",
   "Use the default type if the ending is unknown."
  ],
  "checks": [
   "Try a .jpg and a .jpeg file.",
   "Try a file ending you do not know."
  ],
  "setup": "filename = input(\"File name: \")"
 },
 "1/interpreter": {
  "mission": "Make a simple math program for two numbers.",
  "steps": [
   "Ask for a math problem with two numbers and a sign.",
   "Split the text into three parts.",
   "Do the math shown by the sign.",
   "Print the answer as the problem asks."
  ],
  "checks": [
   "Try each of the four math signs.",
   "Try a division problem with a decimal answer."
  ],
  "setup": "expression = input(\"Expression: \")"
 },
 "1/meal": {
  "mission": "Find which meal fits a time of day.",
  "steps": [
   "Ask for a time in the form shown on the problem page.",
   "Write convert(time) to turn the time into hours.",
   "Check if the time falls in a meal range.",
   "Print the meal name when there is a match."
  ],
  "checks": [
   "Try the first minute of a meal range.",
   "Try a time between meal ranges."
  ]
 },
 "2/camel": {
  "mission": "Change a camelCase name into snake_case.",
  "steps": [
   "Ask for a camelCase name.",
   "Look at one letter at a time.",
   "When a letter is uppercase, add an underscore before it.",
   "Make the letter lowercase and print the new name."
  ],
  "checks": [
   "Try a name with two uppercase letters.",
   "Try a name with no uppercase letters."
  ],
  "setup": "variable_name = input(\"camelCase: \")"
 },
 "2/coke": {
  "mission": "Make a coin machine that tracks money owed.",
  "steps": [
   "Start with the price listed on the problem page.",
   "Show how much money is still needed.",
   "Keep asking for coins the machine accepts.",
   "Stop when the user has paid enough."
  ],
  "checks": [
   "Try paying the exact amount.",
   "Try a coin the machine should not take."
  ],
  "setup": "amount_due = 50  # cents; read the allowed coin values in the assignment"
 },
 "2/twttr": {
  "mission": "Remove vowels from a word or sentence.",
  "steps": [
   "Ask for a word or a sentence.",
   "Look at each letter.",
   "Keep the letters that are not vowels.",
   "Print the new text."
  ],
  "checks": [
   "Try both big and small vowel letters.",
   "Check that numbers and marks stay in place."
  ]
 },
 "2/plates": {
  "mission": "Check if a license plate follows the rules.",
  "steps": [
   "Ask the user to type a plate.",
   "Write is_valid(s) to check its length and first letters.",
   "Check where numbers are allowed.",
   "Return True if all rules pass. Return False if not."
  ],
  "checks": [
   "Try a plate that is too short.",
   "Try a plate with a number in the wrong place."
  ]
 },
 "2/nutrition": {
  "mission": "Look up the calories in a food.",
  "steps": [
   "Make a dictionary with the foods from the problem page.",
   "Ask the user for a food name.",
   "Find the food in the dictionary.",
   "Print its calories if the food is listed."
  ],
  "checks": [
   "Try a food from the chart.",
   "Try a word that is not on the chart."
  ],
  "setup": "fruit = input(\"Item: \")\n# TODO: Create the calorie lookup dictionary from the official table."
 },
 "3/fuel": {
  "mission": "Show how full a gas tank is from a fraction.",
  "steps": [
   "Ask for a fraction like 1/4.",
   "Check that both parts are whole numbers.",
   "Ask again if the fraction is not valid.",
   "Show the percent or the letter from the problem rules."
  ],
  "checks": [
   "Try a tank that is almost empty.",
   "Try a fraction with zero on the bottom."
  ],
  "setup": "# TODO: Build a retry loop for valid X/Y input.\n# A try/except block can handle invalid numeric conversions."
 },
 "3/taqueria": {
  "mission": "Add up the cost of food orders.",
  "steps": [
   "Make a dictionary of the menu prices.",
   "Ask for one food item at a time.",
   "Add each valid food price to the total.",
   "Show the new total until the user ends the order."
  ],
  "checks": [
   "Try ordering two different foods.",
   "Try a food that is not on the menu."
  ],
  "setup": "total = 0.0\n# TODO: Add the official menu prices and an input loop."
 },
 "3/grocery": {
  "mission": "Count how many times each food is entered.",
  "steps": [
   "Ask for food names until the user ends the list.",
   "Keep a count for each food.",
   "Sort the food names from A to Z.",
   "Print each food and its count."
  ],
  "checks": [
   "Enter the same food more than once.",
   "Enter food names in mixed case."
  ],
  "setup": "counts = {}\n# TODO: Collect items until EOF and update counts."
 },
 "3/outdated": {
  "mission": "Change a date into the year-month-day form.",
  "steps": [
   "Ask the user for a date.",
   "Read either date form shown in the problem.",
   "Ask again if the date does not make sense.",
   "Print the date with two digits for month and day."
  ],
  "checks": [
   "Try a date with a named month.",
   "Try a date with a day that does not exist."
  ],
  "setup": "# TODO: Keep requesting a date until a valid date is entered."
 },
 "4/emojize": {
  "mission": "Turn written emoji names into emoji pictures.",
  "steps": [
   "Ask the user for text.",
   "Look at the emoji name rules on the problem page.",
   "Use the emoji library to change known names.",
   "Print the new text."
  ],
  "checks": [
   "Try a known emoji name.",
   "Try text with no emoji name."
  ],
  "setup": "text = input(\"Input: \")"
 },
 "4/figlet": {
  "mission": "Print words using large text letters.",
  "steps": [
   "Read the options typed after the program name.",
   "Check that the font option is allowed.",
   "Use pyfiglet to draw the user's text.",
   "Print the result."
  ],
  "checks": [
   "Run with no font option.",
   "Try a font name that is not allowed."
  ],
  "setup": "# TODO: Examine sys.argv and decide which font to use."
 },
 "4/adieu": {
  "mission": "Print a farewell message with a list of names.",
  "steps": [
   "Ask for names until the user stops.",
   "Keep the names in a list.",
   "Use inflect to join the names into one phrase.",
   "Print the full farewell message."
  ],
  "checks": [
   "Try one name, then two names.",
   "Try three or more names."
  ],
  "setup": "names = []\n# TODO: Keep accepting names until EOF."
 },
 "4/game": {
  "mission": "Make a game where the player guesses a number.",
  "steps": [
   "Ask the player to pick a level.",
   "Choose a secret number in that level's range.",
   "Keep asking for guesses.",
   "Give hints until the guess is right."
  ],
  "checks": [
   "Try a guess that is too high.",
   "Try a level that is not allowed."
  ]
 },
 "4/professor": {
  "mission": "Make a quiz that asks math questions.",
  "steps": [
   "Ask the player to pick a level.",
   "Pick numbers in the range for that level.",
   "Ask the number of questions shown in the problem.",
   "Track wrong tries and the final score."
  ],
  "checks": [
   "Try each game level.",
   "Try wrong answers until tries run out."
  ]
 },
 "4/bitcoin": {
  "mission": "Find the cost of a chosen amount of Bitcoin.",
  "steps": [
   "Read the amount typed after the program name.",
   "Check that it is a number.",
   "Ask the web service for the current price.",
   "Find and print the total cost."
  ],
  "checks": [
   "Try a decimal amount.",
   "Try leaving the amount blank."
  ],
  "setup": "# TODO: Validate sys.argv, obtain the current price, and calculate the total."
 },
 "5/test_twttr": {
  "mission": "Write tests for the program that removes vowels.",
  "steps": [
   "Read the shorten(word) function in twttr.py.",
   "Make test cases for words with and without vowels.",
   "Add assert checks to test_twttr.py.",
   "Run pytest and fix any problems you find."
  ],
  "checks": [
   "Test big and small letters.",
   "Test a word with no vowels."
  ]
 },
 "5/test_bank": {
  "mission": "Write tests for a program that checks greetings.",
  "steps": [
   "Read the value(greeting) function in bank.py.",
   "Plan tests for each kind of greeting.",
   "Add assert checks in test_bank.py.",
   "Run pytest to see which tests pass."
  ],
  "checks": [
   "Try a greeting that starts with H.",
   "Try greetings with extra spaces or capital letters."
  ]
 },
 "5/test_plates": {
  "mission": "Write tests for license plate rules.",
  "steps": [
   "Read the is_valid(s) function in plates.py.",
   "Write tests for the first two letters and total length.",
   "Write tests for numbers and other symbols.",
   "Run pytest and check each result."
  ],
  "checks": [
   "Test both good and bad plates.",
   "Try the shortest and longest valid lengths."
  ]
 },
 "5/test_fuel": {
  "mission": "Write tests for the gas tank functions.",
  "steps": [
   "Write convert(fraction) to turn a fraction into a percent.",
   "Write gauge(percentage) to show a tank level.",
   "Add assert checks to test_fuel.py.",
   "Run pytest and check for errors."
  ],
  "checks": [
   "Test zero on the bottom of a fraction.",
   "Try values near empty and full."
  ]
 },
 "6/lines": {
  "mission": "Count the code lines in a Python file.",
  "steps": [
   "Read the file name typed after the program name.",
   "Check that it ends in .py and can be opened.",
   "Count code lines, but not blank lines or comments.",
   "Print the number of lines."
  ],
  "checks": [
   "Try a file with blank lines.",
   "Try a file that cannot be found."
  ],
  "setup": "# TODO: Check sys.argv and read the selected .py file."
 },
 "6/pizza": {
  "mission": "Show a pizza menu from a CSV file.",
  "steps": [
   "Read the CSV file name typed after the program name.",
   "Use csv to read each row.",
   "Use tabulate to turn the rows into a table.",
   "Print the table in the format shown in the problem."
  ],
  "checks": [
   "Try each menu file from the problem.",
   "Try a file name that does not exist."
  ],
  "setup": "# TODO: Validate the CSV path, read rows, then format with tabulate."
 },
 "6/scourgify": {
  "mission": "Fix the names in a CSV file.",
  "steps": [
   "Read the input and output file names.",
   "Use csv.DictReader to read the rows.",
   "Split each full name into first and last names.",
   "Use csv.DictWriter to save the new rows."
  ],
  "checks": [
   "Check the new column names.",
   "Try leaving out a file name."
  ],
  "setup": "# TODO: Read with csv.DictReader and write with csv.DictWriter."
 },
 "6/shirt": {
  "mission": "Place a shirt picture over a photo.",
  "steps": [
   "Read the two image file names.",
   "Check that both file endings are allowed.",
   "Open and size the photo to fit the shirt.",
   "Put the shirt image on top and save the result."
  ],
  "checks": [
   "Try files with two different endings.",
   "Check that the output photo was saved."
  ],
  "setup": "# TODO: Validate paths before opening or editing an image."
 },
 "7/numb3rs": {
  "mission": "Check if text is a valid IP address.",
  "steps": [
   "Write validate(ip) to check a set of numbers with dots.",
   "Check that there are four number parts.",
   "Check the size of each number.",
   "Return True or False and write tests."
  ],
  "checks": [
   "Try the smallest and largest allowed numbers.",
   "Try an address with too many parts."
  ]
 },
 "7/watch": {
  "mission": "Find a YouTube link in a piece of HTML.",
  "steps": [
   "Write parse(s) to read HTML text.",
   "Find the YouTube link in the video tag.",
   "Take out the video ID.",
   "Return the link form shown in the problem."
  ],
  "checks": [
   "Try HTML with a working video link.",
   "Try HTML with no video link."
  ]
 },
 "7/working": {
  "mission": "Change a time range to 24-hour time.",
  "steps": [
   "Write convert(s) to read a time range.",
   "Check that the times use the right format.",
   "Decide if a helper for one time would make your code easier to understand.",
   "Return the new time range and write tests."
  ],
  "checks": [
   "Try noon and midnight.",
   "Try minutes that are not valid."
  ]
 },
 "7/um": {
  "mission": "Count the times a word appears in a sentence.",
  "steps": [
   "Write count(s) to find the word on its own.",
   "Use a pattern that does not count parts of other words.",
   "Count both big and small letter forms.",
   "Write tests for a few sentences."
  ],
  "checks": [
   "Try the word next to a comma.",
   "Try the same letters inside a longer word."
  ]
 },
 "7/response": {
  "mission": "Check if an email address looks valid.",
  "steps": [
   "Ask the user for an email address.",
   "Use the validators library to check it.",
   "Print the message shown in the problem.",
   "Test some good and bad addresses."
  ],
  "checks": [
   "Try an address with no @ sign.",
   "Try an address with no website ending."
  ],
  "setup": "# TODO: Read an email address and validate it."
 },
 "8/seasons": {
  "mission": "Find how many minutes a person has been alive.",
  "steps": [
   "Ask for a date of birth.",
   "Use dates to find how much time has passed.",
   "Choose whether to write a helper to make date calculations easier to test.",
   "Write the answer in words and test your code."
  ],
  "checks": [
   "Try a date one year ago.",
   "Try a date that is not valid."
  ]
 },
 "8/jar": {
  "mission": "Make a class that holds a number of cookies.",
  "steps": [
   "Set up a Jar with a limit on how many cookies it holds.",
   "Write deposit and withdraw to change the cookie count.",
   "Make the size and capacity values easy to read.",
   "Show the cookies as the problem asks."
  ],
  "checks": [
   "Try adding too many cookies.",
   "Try taking out more cookies than you have."
  ]
 },
 "8/shirtificate": {
  "mission": "Make a PDF award with a shirt picture.",
  "steps": [
   "Ask for the person's name.",
   "Make a PDF page with fpdf2.",
   "Add the shirt picture, title, and name.",
   "Save the PDF with the required file name."
  ],
  "checks": [
   "Try a short name and a long name.",
   "Check that the picture and name fit on the page."
  ]
 }
};

 const topLevelHint={
  '0/indoor':'Read input and print a lowercase version.',
  '0/playback':'Read input and replace each space with three periods.',
  '0/einstein':'Ask for mass and calculate energy with the supplied equation.',
  '1/deep':'Normalize the user input before checking acceptable answers.',
  '1/bank':'Consider conditions in order, from most to least specific.',
  '1/extensions':'Use the suffix of a normalized filename to choose a media type.',
  '1/interpreter':'Split an expression into operands and an operator.',
  '2/camel':'Iterate through the characters of a camelCase variable name.',
  '2/coke':'Repeat valid coin deposits until the purchase amount is reached.',
  '2/nutrition':'Use a mapping and handle an unknown fruit name.',
  '3/fuel':'Handle invalid fractions and zero denominators using exceptions.',
  '3/taqueria':'Continue reading item names until the input ends.',
  '3/grocery':'Count repeated entries and output sorted totals.',
  '3/outdated':'Accept both common date formats and reject invalid dates.',
  '4/emojize':'Call the emoji library on the provided text.',
  '4/figlet':'Validate command-line flags before selecting a text font.',
  '4/adieu':'Collect names until EOF and format them with inflect.',
  '4/bitcoin':'Validate command-line input and catch network errors.',
  '6/lines':'Validate the filename argument, then count source lines.',
  '6/pizza':'Validate one CSV path and use tabulate to format its records.',
  '6/scourgify':'Read a source CSV and write the transformed rows to another CSV.',
  '6/shirt':'Validate matching image extensions before composing the overlay.'
 };
 const shape=problem=>reference[problem.set+'/'+problem.slug]||{};

 // Small pieces of runnable setup help students reach the first TODO.
 // These inputs are not solutions to the assignment.
 const firstMove={
  '0/faces':"Decide what convert(s) returns, not what it prints.",
  '0/tip':"Work out how each helper changes input text into a number.",
  '1/meal':"Write the contract for convert(time): what number does it return?",
  '2/twttr':"Choose where to collect the characters that you keep.",
  '2/plates':"Write down each validation rule before combining them.",
  '3/fuel':"Identify which invalid inputs should cause another prompt.",
  '3/outdated':"Identify which of the two accepted date formats was entered.",
  '4/professor':"Identify the responsibility of each required function.",
  '5/test_fuel':"Plan one normal case and one exception case for convert.",
  '6/scourgify':"Compare input and output CSV column names.",
  '6/shirt':"List the checks to perform before opening image files.",
  '7/working':"Write down when convert(s) must raise ValueError.",
  '8/jar':"Choose how capacity and current size will be stored."
 };
 const mainInputs={
  '0/faces':['text = input("Input: ")'],
  '0/tip':['meal_cost = input("How much was the meal? ")','tip_percent = input("What percentage would you like to tip? ")'],
  '1/meal':['time_text = input("What time is it? ")'],
  '2/twttr':['text = input("Input: ")'],
  '2/plates':['plate = input("Plate: ")'],
  '4/game':['# TODO: Ask for and validate the chosen level before guessing.'],
  '4/professor':['# TODO: Choose a level, then track correct answers.'],
  '5/test_twttr':['word = input("Input: ")'],
  '5/test_bank':['greeting = input("Greeting: ")'],
  '5/test_plates':['plate = input("Plate: ")'],
  '5/test_fuel':['fraction = input("Fraction: ")'],
  '7/numb3rs':['address = input("IPv4 Address: ")'],
  '7/watch':['html = input("HTML: ")'],
  '7/working':['hours = input("Hours: ")'],
  '7/um':['text = input("Text: ")'],
  '7/response':['email = input("Email: ")'],
  '8/seasons':['birth_date = input("Date of Birth: ")'],
  '8/shirtificate':['student_name = input("Name: ")']
 };
 const indentedHint=(text,level=1)=>'    '.repeat(level)+'# TODO: '+text+'\n';
 const safeGuide=problem=>learnerGuide[problem.set+'/'+problem.slug]||{steps:[problem.goal],checks:['Compare your output with the official examples.']};
 const supportBand=set=>set<=1?'guided':set<=3?'supported':set<=5?'targeted':'independent';
 function header(problem){
  return '# '+problem.title+'\n# Read README.md for the assignment steps.\n'+
   '# Learning support: '+supportBand(problem.set)+'. Write your own solution.\n\n';
 }
 function functionBlock(signature,problem){
  const funcName=signature.split('(')[0];
  const initial=funcName==='main'?(mainInputs[problem.set+'/'+problem.slug]||[]):[];
  const todo=funcName==='main'?
   'Connect input, processing, and output using your README plan.':
   'Identify what '+funcName+' must return or raise. Read the official rules.';
  return [
   'def '+signature+':',
   ...initial.map(line=>'    '+line),
   ...(supportBand(problem.set)==='guided'&&firstMove[problem.set+'/'+problem.slug]?['    # First step: '+firstMove[problem.set+'/'+problem.slug]]:[]),
   '    # TODO: '+todo,
   '    pass  # Replace this placeholder when you implement the function.',
   '',
   ''
  ].join('\n');
 }
 function buildPython(problem){
  // Approved light scaffolds: keep the programming decisions with students.
  // The README provides the detailed steps, hints and testing advice.
  if(problem.set===0&&problem.slug==='indoor')return header(problem)+
   'message = input("Say something: ")\n\n'+
   '# TODO: Change the message to lowercase.\n\n'+
   '# TODO: Display the result.\n';
  if(problem.set===2&&problem.slug==='coke')return header(problem)+
   'amount_due = 50\n\n'+
   '# TODO: Repeat until enough money is inserted.\n\n'+
   '# TODO: Accept valid coins and update the amount due.\n\n'+
   '# TODO: Display the change owed.\n';
  const outline=shape(problem),signatures=outline.functions||problem.functions;
  const guide=safeGuide(problem);
  let body=(outline.imports||[]).join('\n');
  if(body)body+='\n\n';
  if(signatures.includes('Jar')){
   body+='class Jar:\n';
   for(const [signature,task] of [
    ['__init__(self, capacity=12)','Save the limit and start with an empty jar.'],
    ['__str__(self)','Return the required cookie string, not a printed value.'],
    ['deposit(self, n)','Add n cookies if there is room.'],
    ['withdraw(self, n)','Take n cookies out if there are enough.']
   ]){
    body+='    def '+signature+':\n'+indentedHint(task,2)+'        pass  # Replace this placeholder.\n\n';
   }
   for(const signature of ['capacity(self)','size(self)']){
    body+='    @property\n    def '+signature+':\n'+indentedHint('Return the requested value; do not print it.',2)+'        pass  # Replace this placeholder.\n\n';
   }
   return header(problem)+body;
  }
  if(problem.slug==='shirtificate'){
   body+='class PDF(FPDF):\n    def header(self):\n'+
    indentedHint('Add the top part of the PDF page.',2)+
    '        pass\n\n\n';
  }
  const wantMain=!!outline.main;
  if(wantMain)body+=functionBlock('main()',problem);
  for(const signature of signatures){
   if(signature==='PDF.header(self)'||signature==='Jar')continue;
   body+=(wantMain||body?'\n':'')+functionBlock(signature,problem);
  }
  if(wantMain)body+='\nif __name__ == "__main__":\n    main()\n';
  if(!wantMain&&signatures.filter(x=>x!=='PDF.header(self)').length===0){
   // Use any existing input/import setup, but move the teaching steps out of Python.
   const setup=(guide.setup||'').split('\n').filter(line=>!/^\s*# TODO:/i.test(line)).join('\n').trim();
   if(setup)body+=setup+'\n\n';
   const tasks=guide.steps.slice(/\binput\s*\(/.test(setup)?1:0).slice(0,supportBand(problem.set)==='independent'?2:3);
   if(firstMove[problem.set+'/'+problem.slug])body+='# First step: '+firstMove[problem.set+'/'+problem.slug]+'\n\n';
   body+=tasks.map(step=>'# TODO: '+step).join('\n\n')+'\n';
  }
  return header(problem)+body;
 }
 const testingPlans={
 "5/test_twttr": {
  "test_shorten": "Test upper/lowercase vowels, digits, and words with no vowels."
 },
 "5/test_bank": {
  "test_hello": "Test the special greeting.",
  "test_with_h": "Test another greeting that starts with H.",
  "test_without_h": "Test a greeting that does not start with H."
 },
 "5/test_plates": {
  "test_starts_with_two_letters": "Test the first two characters.",
  "test_two_to_six_characters": "Test minimum, maximum, and invalid lengths.",
  "test_numbers_at_end": "Test where digits may appear.",
  "test_not_allowed": "Test punctuation and the zero-position rule."
 },
 "5/test_fuel": {
  "test_convert": "Test normal fractions and exceptions for invalid fractions.",
  "test_gauge": "Test empty/full threshold boundaries and a middle value."
 },
 "7/numb3rs": {
  "test_valid": "Test valid addresses with boundary octets.",
  "test_invalid": "Test missing parts and out-of-range octets."
 },
 "7/working": {
  "test_format": "Test range separators and invalid formats.",
  "test_with_minutes": "Test valid and invalid minute values.",
  "test_without_minutes": "Test noon, midnight, and hour-only input."
 },
 "7/um": {
  "test_0": "Test a sentence without the whole word.",
  "test_1": "Test one whole-word match beside punctuation.",
  "test_2": "Test repeated words without matching longer words."
 },
 "8/jar": {
  "test_init": "Test starting size, capacity, and invalid capacity.",
  "test_str": "Test zero and nonzero cookie display.",
  "test_deposit": "Test valid deposits and capacity errors.",
  "test_withdraw": "Test valid withdrawals and not enough cookies."
 },
 "8/seasons": {
  "test_calculate": "Plan a date-based test; optional helper names are your choice."
 }
};
 function buildTest(filename,source,problem){
  const outline=shape(problem);
  const functions=(outline.functions||problem.functions).filter(x=>x!=='Jar'&&!x.startsWith('PDF.'));
  let imported;
  if((outline.functions||problem.functions).includes('Jar'))imported='from jar import Jar';
  else if(functions.length)imported='from '+source.replace(/\.py$/,'')+' import '+functions.map(x=>x.split('(')[0]).join(', ');
  else imported='import '+source.replace(/\.py$/,'');
  const imports=[...new Set(['import pytest',...(outline.testImports||[]),imported])];
  const names=outline.testNames||['test_your_first_case'];
  const plans=testingPlans[problem.set+'/'+problem.slug]||{};
  const stubs=names.map(name=>[
   'def '+name+'():',
   '    # TODO: '+(plans[name]||'Plan a normal, boundary, or invalid case.'),
   '    # TODO: Write an assert or use pytest.raises for an expected error.',
   '    pytest.skip("Not yet tested: replace this with your assertion.")',
   ''
  ].join('\n')).join('\n');
  return [
   '# '+problem.title+' — Student tests',
   '# Read README.md for the testing steps.',
   '',
   ...imports,
   '',
   '',
   ...stubs.split('\n')
  ].join('\n');
 }
 const resourceNotes={
  emojize:'This program uses the emoji package. It may not work in every browser.',
  figlet:'This program uses pyfiglet. Check it in CS50 Codespaces too.',
  adieu:'This program uses inflect. It may not work in every browser.',
  bitcoin:'This program gets prices from the web. The link may not work in Python Lab.',
  pizza:'Get the CSV menu file from the CS50 problem page.',
  scourgify:'Get the input CSV file from the CS50 problem page.',
  shirt:'You will need an image and the Pillow package. Get the image from CS50.',
  shirtificate:'You will need the shirt picture and fpdf2. Get the picture from CS50.',
  response:'This problem uses the validators package to check an email address.',
  seasons:'This problem uses inflect to turn numbers into words.'
 };
 // Files supplied by CS50 or made by students for testing.
 // A file needed to run the code is not always a file required for submission.
 const dependencies={
 "6/lines": {
  "files": [],
  "steps": [
   "Make a second `.py` file or use one you already have to test `lines.py`.",
   "Put your sample Python file beside `lines.py` in Codespaces.",
   "The sample file is for testing. Follow the CS50 page for what to submit."
  ]
 },
 "6/pizza": {
  "files": [
   {
    "name": "sicilian.csv",
    "url": "https://cs50.harvard.edu/python/2022/psets/6/pizza/sicilian.csv",
    "kind": "Sample menu"
   },
   {
    "name": "regular.csv",
    "url": "https://cs50.harvard.edu/python/2022/psets/6/pizza/regular.csv",
    "kind": "Sample menu"
   }
  ],
  "steps": [
   "Get `sicilian.csv` and `regular.csv` from the CS50 page.",
   "Put both menu files beside `pizza.py` in the `pizza` folder.",
   "Run `python pizza.py regular.csv` to test one menu.",
   "The CSV files help you test. Submit extra files only if CS50 asks."
  ]
 },
 "6/scourgify": {
  "files": [
   {
    "name": "before.csv",
    "url": "https://cs50.harvard.edu/python/2022/psets/6/scourgify/before.csv",
    "kind": "Sample input"
   }
  ],
  "steps": [
   "Get `before.csv` from the CS50 page.",
   "Put `before.csv` beside `scourgify.py` in the `scourgify` folder.",
   "Run `python scourgify.py before.csv after.csv` to make an output file.",
   "`after.csv` is made by your code. Check the CS50 page before you submit extra files."
  ]
 },
 "6/shirt": {
  "files": [
   {
    "name": "shirt.png",
    "url": "https://cs50.harvard.edu/python/2022/psets/6/shirt/shirt.png",
    "kind": "Needed shirt image"
   },
   {
    "name": "muppets.zip",
    "url": "https://cs50.harvard.edu/python/2022/psets/6/shirt/muppets.zip",
    "kind": "Optional sample photos"
   }
  ],
  "steps": [
   "Get `shirt.png` from CS50. Your code needs this picture to run.",
   "CS50 also has `muppets.zip` with sample photos for testing.",
   "Put `shirt.png` and a test photo beside `shirt.py` in Codespaces.",
   "You can unzip the sample photos in Codespaces. You do not need to submit your photos."
  ]
 },
 "8/shirtificate": {
  "files": [
   {
    "name": "shirtificate.png",
    "url": "https://cs50.harvard.edu/python/2022/psets/8/shirtificate/shirtificate.png",
    "kind": "Needed shirt image"
   }
  ],
  "steps": [
   "Get `shirtificate.png` from the CS50 page.",
   "Put it beside `shirtificate.py` in the `shirtificate` folder.",
   "Run your code to make `shirtificate.pdf`.",
   "CS50 says you do not need to submit the PDF."
  ]
 }
};

 const wordsToKnow=[
  ['**Input:** Text or numbers that a user types.','**String:** Text saved in a Python program.'],
  ['**Condition:** A rule your code checks.','**Case:** Whether letters are uppercase or lowercase.'],
  ['**Loop:** Code that runs more than once.','**Dictionary:** Names paired with values, like foods and prices.'],
  ['**Error:** A problem your code may need to handle.','**End of input (EOF):** A signal that the user is done typing.'],
  ['**Library:** Code you can import and use.','**Argument:** Text you type after a program name in a command.'],
  ['**Test:** Code that checks other code.','**Assert:** A way to check that a result is right.'],
  ['**CSV:** A text file with rows and commas.','**File path:** The name and place of a file.'],
  ['**Pattern:** A rule for finding text.','**Regular expression:** A short pattern used to search text.'],
  ['**Class:** A plan for a kind of object.','**Method:** A function inside a class.']
 ];
 function build(problem){
  const mainFile=problem.sourceFile||problem.filename;
  const files={};
  files[mainFile]=buildPython(problem);
  if(problem.sourceFile){
   files[problem.filename]=buildTest(problem.filename,mainFile,problem);
  }else if(problem.testFile){
   files[problem.testFile]=buildTest(problem.testFile,mainFile,problem);
  }
  const extras=dependencies[problem.set+'/'+problem.slug]||null;
  const notes=resourceNotes[problem.slug]||'';
  const guide=safeGuide(problem);
  const codeFiles=Object.keys(files).filter(name=>name.endsWith('.py'));
  const sendList=codeFiles.map(name=>'- `'+name+'`');
  const steps=guide.steps.map((step,i)=>(i+1)+'. '+step);
  const checks=guide.checks.map(test=>'- '+test);
  const suffix=problem.set===5?'tests/'+problem.slug.replace(/^test_/,''):problem.slug;
  const cs50Path='cs50/problems/2022/python/'+suffix;
  files['README.md']=[
   '# '+problem.title,
   '',
   '**CS50P · Problem Set '+problem.set+'**',
   '',
   '## What will you make?',
   '',
   guide.mission||problem.goal,
   '',
   '## Where are your files?',
   '',
   'Your folder is `'+problem.slug+'`.',
   'Your code files are:',
   ...sendList,
   '',
   'This `README.md` file is your help sheet. You do **not** need to send it to CS50.',
   '',
   '## Start here',
   '',
   '1. Open `'+problem.filename+'` in Python Lab.',
   '2. Read the official problem page: '+problem.url,
   '3. Look for `TODO` in your code. Those are spots you need to finish.',
   '',
   '## Step-by-step plan',
   '',
   ...steps,
   '',
   '## Check your work',
   '',
   ...checks,
   'Run your code and compare the results with the official problem page.',
   '',
   '## Words to know',
   '',
   ...wordsToKnow[problem.set],
   '',
   '## Files your program may need',
   '',
   'Move any files your code reads, such as a CSV, photo, or another Python file.',
   'Put each file in the folder your code uses. Keep its name the same.',
   'Do not mix up files needed to **run** your code with files CS50 asks you to **submit**.',
   'Only send extra files if the official CS50 problem tells you to.',
   '',
   ...(extras?[
    '**For this problem:**',
    '',
    ...extras.steps.map((step,i)=>(i+1)+'. '+step),
    '',
    ...extras.files.map(file=>'- Get `'+file.name+'` ('+file.kind+'): '+file.url),
    ''
   ]:[
    'This problem does not list any extra starter files from CS50.',
    'If you use your own data or extra Python files, bring them to Codespaces too.',
    ''
   ]),
   '## Move your code to CS50 Codespaces',
   '',
   'Use **Move to Codespaces** in Python Lab for a file list, download buttons, and a checklist.',
   '',
   '1. In Python Lab, right-click each code file listed above. Choose **Download File**. You can also use the guide to copy or download the file.',
   '2. Go to https://cs50.dev and open your Codespace.',
   '3. Make or open the folder named `'+problem.slug+'`.',
   '4. Put your downloaded Python file'+(codeFiles.length>1?'s':'')+' inside that folder.',
   '5. Add any data or image files your code needs to run. Get sample files from the CS50 problem page.',
   '6. Keep `README.md` in Python Lab. It is **not** one of the files you need to send.',
   '7. Only submit extra files when the official CS50 page asks for them.',
   '8. After moving your files, keep working in Codespaces. This way, you only have one copy to update.',
   '9. Open a terminal in that folder to check and send your work.',
   '',
   'Check your code: `check50 '+cs50Path+'`',
   '',
   'Send your code: `submit50 '+cs50Path+'`',
   '',
   'Check the official problem page before you send your work.',
   'Some problems also need a data file or picture from CS50. Follow those rules if needed.',
   '',
   notes?'## Need another file or package?\n\n'+notes+'\n':'',
   '## Remember',
   '',
   'Write your own code. The starter is NOT an official CS50 starter or an answer key.',
   'Python Lab cannot send work to CS50 for you. Use CS50 Codespaces to submit.',
   ''
  ].join('\n');
  return {
   id:problem.id,
   title:problem.title,
   description:guide.mission||problem.goal,
   set:problem.set,
   subject:subjects[problem.set],
   url:problem.url,
   slug:problem.slug,
   folderName:problem.slug,
   entryFile:problem.filename,
   sourceFile:mainFile,
   extraFiles:extras?extras.files:[],
   extraFileSteps:extras?extras.steps:[],
   files
  };
 }
 function get(id){
  const p=catalog.find(item=>item.id===id);
  return p?build(p):null;
 }
 const list=()=>catalog.map(item=>({
  id:item.id,title:item.title,description:safeGuide(item).mission||item.goal,
  set:item.set,slug:item.slug,folderName:item.slug,subject:subjects[item.set],filename:item.filename,
  url:item.url,files:Object.keys(build(item).files)
 }));
 window.pythonLabCS50P={subjects,catalog:list,get};
})();
