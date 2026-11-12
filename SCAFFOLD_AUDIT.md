# CS50 Companion starter-scaffolding audit

Updated for version 0.9.6 (November 2026).

## Scope

The catalog contains **41 CS50P assignments** across Problem Sets 0–8. The shared generator creates **50 Python files**, including source and test files. These are *unsolved* student scaffolds, not Harvard's starter solutions. The official problem page linked in each README remains the source of truth.

## Learning design

| Sets | Support band | Intended assistance |
| --- | --- | --- |
| 0–1 | Guided | Concrete starting input, short TODOs, first-step direction |
| 2–3 | Supported | Initial variables or structure; students design loops and decisions |
| 4–5 | Targeted | Required function interfaces, library imports, and meaningful test prompts |
| 6–8 | Independent | Minimum structure; students plan most of the algorithm and may name optional helpers |

Keep implementation decisions, actual return values, assertions, error handling, and algorithm design with the student. `pass` and `pytest.skip` explicitly indicate **unfinished work**, not success.

## Curriculum/contract spot checks

| Area | Verified guidance |
| --- | --- |
| [Testing my twttr](https://cs50.harvard.edu/python/psets/5/test_twttr/) | `main()` and `shorten(word)`, plus student-authored tests |
| [Refueling](https://cs50.harvard.edu/python/psets/5/test_fuel/) | `convert(fraction)` and `gauge(percentage)`; test normal returns and exceptions |
| [Little Professor](https://cs50.harvard.edu/python/psets/4/professor/) | `get_level()` and `generate_integer(level)` are required |
| [NUMB3RS](https://cs50.harvard.edu/python/psets/7/numb3rs/) | `validate(ip)`, test valid/invalid IPv4 formats |
| [Working 9 to 5](https://cs50.harvard.edu/python/psets/7/working/) | `convert(s)` required; `convert_time` not required; invalid input raises `ValueError` |
| [Seasons of Love](https://cs50.harvard.edu/python/psets/8/seasons/) | `main()` **and at least one student-chosen helper**; tests must target helper functions |
| [Cookie Jar](https://cs50.harvard.edu/python/psets/8/jar/) | `deposit(self, n)` and `withdraw(self, n)`; exact required class members |
| [CS50P Problem Sets](https://cs50.harvard.edu/python/psets/) | Cross-check all assignment names, links, and instructions against the current course |

The remaining assignment specifications should be checked individually whenever Harvard revises them; this audit does **not** claim that every requirement on every official page was independently reverified.

## Automated validation

Run `npm test`. The repository's `tests/starter.test.js` covers all 41 catalog items, required paths, solution-free TODO scaffolds, sample critical APIs, stage-specific support levels, generated Codespaces README alignment, and Python AST parsing (when Python 3 is available).

When reviewing a change locally, additionally inspect representative cases from each band:

- Set 0: `indoor`, `faces`, `tip`.
- Set 2: `coke`, `plates`.
- Set 3: `fuel`, `outdated`.
- Set 4–5: `professor`, `test_fuel`.
- Set 6: `scourgify`, `shirt`.
- Set 7: `numb3rs`, `working`.
- Set 8: `seasons`, `jar`, `shirtificate`.

**Current verification limitation:** A connector-side in-memory structural validation inspected all 41 assignments and 50 Python files and their generated README relationships. It does not execute a Python interpreter, the full Node tests, `check50`, or a live Codespaces installation. Run `npm test` and inspect GitHub Actions before classroom release.

## Student work protection

The extension only creates starter files when an assignment folder is absent. Existing Python files are not rewritten during extension updates. Generated READMEs are refreshed automatically only when recognized as unchanged; replacing modified guides requires student approval and creates a backup.

## Deployment

The package is versioned **0.9.6** so that the classroom update mechanism can discover a newer release after GitHub Actions tests and publishes it. Verify the release checks and the Update button in one student Codespace before broad distribution.
