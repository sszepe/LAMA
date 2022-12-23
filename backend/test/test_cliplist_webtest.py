import pytest
from webtest import TestApp as WebTestApp

from lama.server import app as webapp

pytestmark = pytest.mark.usefixtures("testingdb_top10")


@pytest.fixture(scope="module")
def app():
    return WebTestApp(webapp)


CLIP_GAGA = "_Clip_14f985fc-d62c-4c60-8894-4ebe9e3775ba"
CLIP_HACKL = "_Clip_38bcc5ea-be94-44b1-85ae-f635a2559352"
CLIP_POP = "_Clip_9d39960d-d19a-4d4c-bab4-cb2169290be6"
CLIP_DICKICHT = "_Clip_a931664d-d7dc-4832-b818-62d86e00919f"
CLIP_WELLESZ = "_Clip_85356dfc-9e9d-4bd6-9827-0187aa7faf91"
CLIP_UNGAR = "_Clip_f0942be4-33a0-419f-bd93-603c348a3baa"
CLIP_AETHER = "_Clip_8ad72c95-7b2e-412c-b58e-5dce290823aa"
CLIP_MARIONETT = "_Clip_747b2f15-b05e-46a0-9232-a125af7b20c3"
CLIP_GULDA = "_Clip_70353990-7f87-4875-8897-072edff62d88"
CLIP_BARONIN = "_Clip_04fedbe1-2665-45e9-8753-708b7c1aaaeb"

# title;label;duration;updatedAny
# _Clip_14f985fc-d62c-4c60-8894-4ebe9e3775ba;Demonstration gegen die Räumung der GAGA Teil 5: Polizei;Gassergasse eviction demonstration (Vienna, 28/06/1983), part 5;143;dsmirnov;2021-02-10T14:02:18.181925+00:00
# _Clip_38bcc5ea-be94-44b1-85ae-f635a2559352;Endlich 1955 - Gespräch mit Albert Hackl - 1. Teil;;3672;pgulewycz;2021-02-04T12:35:31.096385+00:00
# _Clip_9d39960d-d19a-4d4c-bab4-cb2169290be6;Mittagsjournal 1986.12.17;Mittagsjournal: Österreichisches Pop - Benefizkonzert in der Wiener Stadthalle (1986);3595;bmichlmayr;2021-02-08T18:27:19.579540+00:00
# _Clip_a931664d-d7dc-4832-b818-62d86e00919f;Patina - Fundstücke: Sommerliche Ermittlungen im Dickicht der Tonträger;Patina 94: summery acoustic finds;1728;abasaran;2021-02-09T11:50:13.520594+00:00
# _Clip_85356dfc-9e9d-4bd6-9827-0187aa7faf91;Egon Wellesz: Begegnungen - Rückblick und Ausschau eines Musikers;;2843;eberner;2021-02-07T09:28:02.310525+00:00
# _Clip_f0942be4-33a0-419f-bd93-603c348a3baa;Imre Fábián: Die ungarische Musik nach Bartók;;4398;eberner;2021-02-02T14:55:29.925422+00:00
# _Clip_04fedbe1-2665-45e9-8753-708b7c1aaaeb;Interview mit Frau Baronin von Trapp über die Zukunft des Chores;;621;msanti;2021-01-30T21:35:14.376687+00:00
# _Clip_8ad72c95-7b2e-412c-b58e-5dce290823aa;Patina - Reporter unterwegs: Populismus aus dem Äther;Patina 176: Populism in the radio;1493;abasaran;2021-02-05T02:02:31.103347+00:00
# _Clip_747b2f15-b05e-46a0-9232-a125af7b20c3;Interview in New York mit Prof. Hermann Aicher, Direktor des Salzburger Marionettentheaters;;329;pgulewycz;2021-02-09T09:56:26.272391+00:00
# _Clip_70353990-7f87-4875-8897-072edff62d88;Interview mit Friedrich Gulda und Wilhelm Schlag, dem Leiter des österreichischen Kulturinstitutes in New York;;307;pgulewycz;2021-02-09T11:24:07.927516+00:00

# also write tests for validation errors if possible


def test_get_clips(app):
    result = app.get("/clips").json
    expected_order = [
        CLIP_BARONIN,
        CLIP_GAGA,
        CLIP_HACKL,
        CLIP_GULDA,
        CLIP_MARIONETT,
        CLIP_WELLESZ,
        CLIP_AETHER,
        CLIP_POP,
        CLIP_DICKICHT,
        CLIP_UNGAR,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order
    assert result["totalCount"] == 10
    assert result["page"] == 0
    assert result["pageSize"] == 16
    assert result["firstIndex"] == 0
    assert result["lastIndex"] == 9


def test_get_clips_sorted_created_by_duration(app):
    result = app.get("/clips?sortBy=createdBy.asc,duration.desc").json
    expected_order = [
        CLIP_DICKICHT,
        CLIP_AETHER,
        CLIP_POP,
        CLIP_GAGA,
        CLIP_UNGAR,
        CLIP_WELLESZ,
        CLIP_BARONIN,
        CLIP_HACKL,
        CLIP_MARIONETT,
        CLIP_GULDA,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order


def test_get_clips_sorted_updated_any(app):
    result = app.get("/clips?sortBy=updatedAny.desc").json
    expected_order = [
        CLIP_GAGA,
        CLIP_DICKICHT,
        CLIP_GULDA,
        CLIP_MARIONETT,
        CLIP_POP,
        CLIP_WELLESZ,
        CLIP_AETHER,
        CLIP_HACKL,
        CLIP_UNGAR,
        CLIP_BARONIN,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order


def test_get_clips_sorted_platform(app):
    result = app.get("/clips?sortBy=platform.desc").json
    expected_order = [
        CLIP_WELLESZ,
        CLIP_UNGAR,
        CLIP_BARONIN,
        CLIP_GAGA,
        CLIP_HACKL,
        CLIP_GULDA,
        CLIP_MARIONETT,
        CLIP_AETHER,
        CLIP_POP,
        CLIP_DICKICHT,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order


def test_get_clips_sorted_label_title(app):
    result = app.get("/clips?sortBy=labelTitle.asc").json
    expected_order = [
        CLIP_WELLESZ,
        CLIP_HACKL,
        CLIP_GAGA,
        CLIP_UNGAR,
        CLIP_MARIONETT,
        CLIP_BARONIN,
        CLIP_GULDA,
        CLIP_POP,
        CLIP_AETHER,
        CLIP_DICKICHT,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order


def test_get_clips_pagination_basic(app):
    result = app.get("/clips?sortBy=labelTitle.asc&pageSize=4").json
    expected_order = [
        CLIP_WELLESZ,
        CLIP_HACKL,
        CLIP_GAGA,
        CLIP_UNGAR,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order
    assert result["totalCount"] == 10
    assert result["page"] == 0
    assert result["pageSize"] == 4
    assert result["firstIndex"] == 0
    assert result["lastIndex"] == 3


def test_get_clips_pagination_2(app):
    result = app.get(
        f"/clips?sortBy=updatedAny.desc&pageSize=8&pageAfter={CLIP_HACKL}"
    ).json
    expected_order = [
        CLIP_UNGAR,
        CLIP_BARONIN,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order
    assert result["totalCount"] == 10
    assert result["page"] == 1
    assert result["pageSize"] == 8
    assert result["firstIndex"] == 8
    assert result["lastIndex"] == 9


def test_get_clips_filter_user(app):
    result = app.get(
        "/clips?sortBy=updatedAny.desc&pageSize=2&createdBy=pgulewycz"
    ).json
    expected_order = [
        CLIP_GULDA,
        CLIP_MARIONETT,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order
    assert result["totalCount"] == 3
    assert result["page"] == 0
    assert result["pageSize"] == 2
    assert result["firstIndex"] == 0
    assert result["lastIndex"] == 1

    result = app.get(
        f"/clips?sortBy=updatedAny.desc&pageSize=2&pageAfter={CLIP_MARIONETT}&createdBy=pgulewycz"
    ).json
    expected_order = [
        CLIP_HACKL,
    ]
    result_ids_2 = [c["_id"] for c in result["clips"]]
    assert result_ids_2 == expected_order
    assert result["totalCount"] == 3
    assert result["page"] == 1
    assert result["pageSize"] == 2
    assert result["firstIndex"] == 2
    assert result["lastIndex"] == 2

    result = app.get(
        f"/clips?sortBy=updatedAny.desc&pageSize=2&pageBefore={CLIP_HACKL}&createdBy=pgulewycz"
    ).json
    expected_order = [
        CLIP_GULDA,
        CLIP_MARIONETT,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order
    assert result["totalCount"] == 3
    assert result["page"] == 0
    assert result["pageSize"] == 2
    assert result["firstIndex"] == 0
    assert result["lastIndex"] == 1


def test_get_clips_filter_entities_basic(app):
    result = app.get(
        "/clips?sortBy=updatedAny.desc&pageSize=4&page=1&entityIds=_Person_ernst-grissemann,_Person_friedrich-gulda"
    ).json
    expected_order = [
        CLIP_DICKICHT,
        CLIP_GULDA,
        CLIP_AETHER,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order
    assert result["totalCount"] == 3
    assert result["page"] == 0
    assert result["pageSize"] == 4
    assert result["firstIndex"] == 0
    assert result["lastIndex"] == 2


def test_get_clips_filter_entities_match_all(app):
    result = app.get(
        "/clips?sortBy=updatedAny.desc&pageSize=4&entityIds=_Person_ernst-grissemann,_Topic_humor&entitiesAll=1"
    ).json
    expected_order = [
        CLIP_DICKICHT,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order
    assert result["totalCount"] == 1
    assert result["page"] == 0
    assert result["pageSize"] == 4
    assert result["firstIndex"] == 0
    assert result["lastIndex"] == 0


def test_get_clips_filter_text(app):
    result = app.get(
        "/clips?sortBy=updatedAny.desc&pageSize=4&match=patina"
    ).json
    expected_order = [
        CLIP_DICKICHT,
        CLIP_AETHER,
    ]
    result_ids = [c["_id"] for c in result["clips"]]
    assert result_ids == expected_order
    assert result["totalCount"] == 2
    assert result["page"] == 0
    assert result["pageSize"] == 4
    assert result["firstIndex"] == 0
    assert result["lastIndex"] == 1
