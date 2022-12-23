from lama.fuzzy import fuzzy_map


EXAMPLE_DATA = {
    "_Bernstein": "Leonard Bernstein",
    "_Topic_Garten-Oesterreich": "Garten Österreich",
    "_Platform_Mediathek": "Österreichische Mediathek",
    "_PieceOfMusic_Oesterreich-ueber-alles": "Österreich über alles, wenn es nur will",
    "_Organization_Mediathek": "Österreichische Mediathek",
    "_Location_Oesterreich": "Österreich",
    "_Steinway": "Steinway & Sons",
    "_Pony": "Pony",
    "_PieceOfMusic_Bartok-String-Quartet-1st-movement": "String Quartet No. 4, I. Allegro (B. Bartók)",
    "_Person_bela-bartok": "Béla Bartók",
    "_Topic_art": "Art",
}


def test_stein():
    assert fuzzy_map(EXAMPLE_DATA, "stein") == [
        "_Steinway",
        "_Bernstein",
        "_PieceOfMusic_Bartok-String-Quartet-1st-movement",
    ]


def test_mediathek():
    assert fuzzy_map(EXAMPLE_DATA, "mediathek") == [
        "_Platform_Mediathek",
        "_Organization_Mediathek",
    ]


def test_oesterreich():
    assert fuzzy_map(EXAMPLE_DATA, "österreich") == [
        "_Location_Oesterreich",
        "_PieceOfMusic_Oesterreich-ueber-alles",
        "_Platform_Mediathek",
        "_Organization_Mediathek",
        "_Topic_Garten-Oesterreich",
    ]


def test_bartok():
    assert fuzzy_map(EXAMPLE_DATA, "bartok") == [
        "_Person_bela-bartok",
        "_PieceOfMusic_Bartok-String-Quartet-1st-movement",
        "_Topic_art",
    ]
