import json

import pytest
from webtest import TestApp as WebTestApp

from lama.server import app as webapp

pytestmark = pytest.mark.usefixtures("testingdb_top10")


@pytest.fixture(scope="module")
def app():
    return WebTestApp(webapp)


# CLIP_GAGA = "_Clip_14f985fc-d62c-4c60-8894-4ebe9e3775ba"
# CLIP_HACKL = "_Clip_38bcc5ea-be94-44b1-85ae-f635a2559352"
# CLIP_POP = "_Clip_9d39960d-d19a-4d4c-bab4-cb2169290be6"
# CLIP_DICKICHT = "_Clip_a931664d-d7dc-4832-b818-62d86e00919f"
# CLIP_WELLESZ = "_Clip_85356dfc-9e9d-4bd6-9827-0187aa7faf91"
# CLIP_UNGAR = "_Clip_f0942be4-33a0-419f-bd93-603c348a3baa"
# CLIP_AETHER = "_Clip_8ad72c95-7b2e-412c-b58e-5dce290823aa"
# CLIP_MARIONETT = "_Clip_747b2f15-b05e-46a0-9232-a125af7b20c3"
# CLIP_GULDA = "_Clip_70353990-7f87-4875-8897-072edff62d88"
# CLIP_BARONIN = "_Clip_04fedbe1-2665-45e9-8753-708b7c1aaaeb"

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

dickicht_clip = json.loads(
    """{
    "_id": "_Clip_a931664d-d7dc-4832-b818-62d86e00919f",
    "type": "Clip",
    "title": "Patina - Fundstücke: Sommerliche Ermittlungen im Dickicht der Tonträger",
    "label": "Patina 94: summery acoustic finds",
    "subtitle": "Patina - Kostbares und Kurioses aus dem Archiv, Nr. 94",
    "url": "https://www.mediathek.at/portaltreffer/atom/136E6FB6-0FF-00551-000007B8-136D9DB6/pool/BWEB/",
    "platform": "_Platform_Mediathek",
    "collections": [
      "_Collection_sammlung-radio-mitschnitte-der-oesterreichischen-mediathek",
      "_Collection_patina"
    ],
    "fileType": "a",
    "duration": 1728,
    "shelfmark": "ax-00013_b02_k02",
    "language": [
      "_VLanguage_de"
    ],
    "clipType": [
      "_VClipType_collage",
      "_VClipType_radio-broadcast"
    ],
    "description": "Radioshow by ORF of the 1990s which assembles and comments archival footage on archival finds that do not fit in any archival category.\\n[Partly identical with Patina 185 on 'comic people'!!!]"
}"""
)


# XXX: if this or something like it ends up mutating data: reset!
def test_unique_clip_url_create(app):
    resp = app.post_json("/clips", {**dickicht_clip, **{"_id": ""}}, status=400)
    assert resp.json.get("message", "").startswith(
        "A clip with this URL already exists"
    )


def test_unique_clip_url_update(app):
    resp = app.put_json(
        "/clips", {**dickicht_clip, **{"description": "Whinny!"}}
    )
