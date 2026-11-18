# CS50P starter baseline audit

Reviewed November 17, 2026 for version 0.9.8.

All **41 assignment pages** in Problem Sets 0–8 were fetched and reviewed for supplied starter programs, data, and test examples. The URLs and selected original code blocks are recorded in `tests/fixtures/cs50-provided-code.json`.

## What students receive

- Harvard's provided program skeletons for Tip Calculator, Meal Time, Vanity Plates, Little Professor, all four Set 5 exercises, NUMB3RS, Watch, Working 9 to 5, Um, Seasons, and Cookie Jar.
- Supplied executable code remains intact, including input/output wiring in `main`, Tip Calculator's calculation/formatting, and Cookie Jar's completed `test_str` example.
- Taqueria's nine-item menu and Outdated's twelve-month list, assigned to named variables.
- FIGlet's supplied object setup and Bitcoin's supplied request-exception outline.
- Nutrition Facts: a teacher-provided dictionary of all 20 fruits and their calorie values, transcribed from the FDA table linked by the assignment. Keys use lowercase names. Input, case handling, lookup and output remain student work.
- Other problems retain the existing light classroom scaffolds. General illustrative snippets, sample API responses, and examples of programs to count in Lines of Code are not inserted as solutions. File/image dependencies remain linked in the guides.

Placeholders are changed to TODO comments and `pass` so generated source parses. In unfinished tests, `pytest.skip` makes incompleteness visible. Optional helper placeholders remain comments. A provided example test passing is not evidence that the whole assignment is complete.

## Attribution

Supplied snippets come from Harvard's CS50 Introduction to Programming with Python, linked per assignment in the fixture and generated source. CS50 course material is available under [CC BY-NC-SA 4.0](https://cs50.harvard.edu/python/license/). The supplied/adapted snippets retain that license; the repository's MIT license applies to the original extension code. Classroom modifications are the placeholder changes, named data variables, and teaching comments described above. The fixture preserves the reviewed originals.

Nutrition data: [FDA Raw Fruits Poster](https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/raw-fruits-poster-text-version-accessible-version).

## Validation

`npm test` checks all generated Python files for valid syntax, verifies that the recorded supplied code is retained, checks all 20 calorie values, and tests assignment creation and protection of existing student files. The snapshot records this review; it does not automatically detect future Harvard changes. Recheck the linked pages when updating the curriculum.

Automatic updates never overwrite student Python files. The explicit Reload starter code action (v0.9.9) asks for confirmation and backs up the targeted Python files before replacing them. Updated starters apply to newly created assignment folders. The versioned release uses the existing classroom updater.
