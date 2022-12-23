from lama.userstore import is_valid_username, is_valid_password


def test_normal_username():
    assert is_valid_username("blackbeauty") is True
    assert is_valid_username("whitepegasus") is True


def test_badchars_username():
    assert is_valid_username("BlAcKbEaUtY") is False


def test_badchars_username_2():
    assert is_valid_username("1aß--__ <=><") is False


def test_short_username():
    assert is_valid_username("x") is False


def test_long_username():
    assert is_valid_username("xxxxxxxxxxxxxxxx") is False


def test_normal_pass():
    assert is_valid_password("kArVFhz9FuiN") is True
    assert is_valid_password("40EPdFQdvfSa") is True


def test_no_numbers_pass():
    assert is_valid_password("BlAcKbEaUtY") is False


def test_only_numbers_pass():
    assert is_valid_password("1234567890") is False


def test_badchars_pass():
    assert is_valid_password('xßßßß--->>>2"') is False


def test_too_long_pass():
    assert is_valid_password("kArVFhz9FuiNkArVFhz9FuiN") is False


def test_too_short_pass():
    assert is_valid_password("aGDad35") is False
