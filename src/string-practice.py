#!/usr/bin/env python3
"""Practice eight built-in Python string methods using only fixed operations.

This does not evaluate user-provided Python source or access student files.
Input is one small JSON object on stdin. Output is JSON on stdout.
"""
import json
import sys


def evaluate(data):
    text = data["text"]
    args = data["args"]
    method = data["method"]
    if method == "lower":
        result = text.lower()
    elif method == "upper":
        result = text.upper()
    elif method == "strip":
        result = text.strip()
    elif method == "replace":
        result = text.replace(args[0], args[1])
    elif method == "split":
        result = text.split(args[0]) if args[0] else text.split()
    elif method == "startswith":
        result = text.startswith(args[0])
    elif method == "endswith":
        result = text.endswith(args[0])
    elif method == "isdigit":
        result = text.isdigit()
    else:
        raise ValueError("Choose a listed method.")
    return {"value": repr(result), "kind": type(result).__name__}


def main():
    try:
        data = json.loads(sys.stdin.read(1024))
        if not isinstance(data, dict):
            raise ValueError("Invalid practice input.")
        response = evaluate(data)
        print(json.dumps({"ok": True, **response}, ensure_ascii=False))
    except (ValueError, TypeError, KeyError, IndexError) as error:
        print(json.dumps({"ok": False, "error": str(error)}))


if __name__ == "__main__":
    main()
