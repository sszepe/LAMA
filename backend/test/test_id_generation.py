from unittest.mock import Mock, patch

import lama.commands
from lama.commands import create_human_id


def test_vanilla():
    with patch("lama.commands.id_exists"):
        lama.commands.id_exists = Mock(return_value=False)
        assert (
            create_human_id({"type": "Person", "label": "Leonard Bernstein"})
            == "_Person_leonard-bernstein"
        )


def test_umlaut():
    with patch("lama.commands.id_exists"):
        lama.commands.id_exists = Mock(return_value=False)
        assert (
            create_human_id(
                {"type": "Platform", "label": "Österreichische Mediathek"}
            )
            == "_Platform_oesterreichische-mediathek"
        )


def test_whitespace():
    with patch("lama.commands.id_exists"):
        lama.commands.id_exists = Mock(return_value=False)
        assert (
            create_human_id({"type": "Place", "label": "\tHeldenplatz   "})
            == "_Place_heldenplatz"
        )


def test_remove_special_characters_replace_whitespace():
    with patch("lama.commands.id_exists"):
        lama.commands.id_exists = Mock(return_value=False)
        assert (
            create_human_id({"type": "Group", "label": "Allies  (WW2)"})
            == "_Group_allies-ww2"
        )


def test_existing():
    with patch("lama.commands.id_exists"):
        lama.commands.id_exists = Mock()
        lama.commands.id_exists.side_effect = [True, False]
        assert (
            create_human_id({"type": "Group", "label": "Allies  (WW2)"})
            == "_Group_allies-ww2_1"
        )
