from lama.events import _process_anything

# TEST CASES:
# - undefined/None/falsey should be removed,
# - empty string should be removed
# - timecode 0 should be preserved
# - surrounding whitespace should be removed in text fields
# - empty arrays/lists should be preserved
# - everything else should be passed through as it is
# NB: nested objects/dicts are not supported right now


def test_remove_empty_strings():
    assert _process_anything({"nonEmptyField": "pony", "emptyField": " "}) == {
        "nonEmptyField": "pony"
    }


def test_remove_undefined():
    assert _process_anything(
        {"nonEmptyField": "pony", "undefinedField": None}
    ) == {
        "nonEmptyField": "pony",
    }


def test_dont_remove_tc_zero():
    assert _process_anything(
        {"nonEmptyField": "pony", "timecodeStart": 0, "timecodeEnd": 234}
    ) == {"nonEmptyField": "pony", "timecodeStart": 0, "timecodeEnd": 234}


# remove timecodeStart, in case it is 0 and there is no timecodeEnd?
def test_dont_remove_tc_zero_alone():
    assert _process_anything({"nonEmptyField": "pony", "timecodeStart": 0}) == {
        "nonEmptyField": "pony",
        "timecodeStart": 0,
    }


def test_remove_surrounding_whitespace():
    assert (
        _process_anything(
            {
                "nonEmptyField": "pony",
                "fieldwithWhitespace": "  \t special snowflake   ",
            }
        )
        == {"nonEmptyField": "pony", "fieldwithWhitespace": "special snowflake"}
    )


def test_arrays():
    assert _process_anything(
        {"nonEmptyField": "pony", "array": ["test1", "test2"], "emptyArray": []}
    ) == {
        "nonEmptyField": "pony",
        "array": ["test1", "test2"],
        "emptyArray": [],
    }


def test_preserve_description():
    assert _process_anything(
        {"nonEmptyField": "pony", "emptyField": " ", "description": ""}
    ) == {
        "nonEmptyField": "pony",
        "description": "",
    }


def test_from_platform_metadata():
    assert _process_anything(
        {
            "nonEmptyField": "pony",
            "fromPlatformMetadata": True,
        }
    ) == {
        "nonEmptyField": "pony",
        "fromPlatformMetadata": True,
    }
