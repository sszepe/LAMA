from lama.platform_effective_ids import effective_id_from_url as eff


def test_fb():
    assert (
        eff("https://facebook.com/115203485178163/videos/210382983531052")
        == "fb:210382983531052"
    )
    assert (
        eff(
            "https://facebook.com/115203485178163/videos/210382983531052?start=25"
        )
        == "fb:210382983531052"
    )


def test_fb_2():
    assert (
        eff(
            "https://www.facebook.com/watch/live/?v=210382983531052&ref=watch_permalink"
        )
        == "fb:210382983531052"
    )


def test_fb_3():
    assert (
        eff("http://www.facebook.com/wheeewheeeponies:whinny!")
        == "http://www.facebook.com/wheeewheeeponies:whinny!"
    )


def test_mediathek():
    assert (
        eff(
            "https://www.mediathek.at/portaltreffer/atom/1CF3E39B-373-00408-000020FF-1CF3791D"
        )
        == "mediathek:1CF3E39B-373-00408-000020FF-1CF3791D"
    )


def test_pha():
    assert (
        eff("http://protokolle.pharchiv.local/catalog/viewsession.php?id=18853")
        == "pha:18853"
    )


def test_pha_2():
    assert eff("http://catalog.phonogrammarchiv.at/session/5119") == "pha:5119"


def test_okto():
    assert eff("https://www.okto.tv/de/oktothek/episode/24676") == "okto:24676"


def test_youtube():
    assert (
        eff("https://www.youtube.com/watch?v=4q9DozOjsdw") == "yt:4q9DozOjsdw"
    )


def test_youtube_2():
    assert eff("https://youtu.be/4q9DozOjsdw?t=5") == "yt:4q9DozOjsdw"
