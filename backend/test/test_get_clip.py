from unittest.mock import patch

from pytest_dictsdiff import check_objects

import lama.clips

mock_clip = {
    "_id": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
    "type": "Clip",
    "title": "Die Beatles kommen nach Salzburg [Ausschnitt]",
    "label": "Die Beatles kommen nach Salzburg",
    "url": "https://www.mediathek.at/portaltreffer/atom/1574483C-0DC-0005E-000013C4-1573BB37/pool/BWEB/",
    "platform": "_Platform_Mediathek",
    "fileType": "v",
    "duration": 50,
    "language": ["_VLanguage_de"],
    "clipType": ["_VClipType_Wochenschau"],
    "description": "Austria Wochenschau 19. März 1965.\n1965 wurde ein Teil des Beatles-Filmes 'Help' in Obertauern, Salzburg, gedreht. Die Ankunft der Beatles rief nicht nur Fans auf den Plan.",
    "created": "2020-12-14T09:30:27.343492+00:00",
    "createdBy": "tsteam",
    "shelfmark": "12-00131_b02_k02",
    "updated": "2020-12-14T09:31:44.825636+00:00",
    "updatedBy": "tsteam",
}

mock_elements = [
    {
        "_id": "_Music_e5126526-6a5f-4ca9-b01c-3afe658573ba",
        "type": "Music",
        "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
        "label": "Jazzy Background Music",
        "description": "Does not sound like Beatles (not like jazz either).",
        "created": "2020-12-14T09:37:08.598710+00:00",
        "createdBy": "tsteam",
    },
    {
        "_id": "_Picture_d20f1132-b5e2-4694-8cb9-7940ee932ddb",
        "type": "Picture",
        "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
        "label": "Video footage: Beatles arriving",
        "description": "... on Salzburg airport.",
        "created": "2020-12-14T09:39:05.506628+00:00",
        "createdBy": "tsteam",
    },
    {
        "_id": "_Speech_0c2c8065-856e-4149-a92b-435da365b1a7",
        "type": "Speech",
        "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
        "label": "Voiceover",
        "description": "... reporting on this glorious event.",
        "created": "2020-12-14T09:41:38.661500+00:00",
        "createdBy": "tsteam",
    },
]

mock_annots = [
    {
        "_id": "_Annotation_e7a6b89b-88cc-4e85-a42b-26a0a5c1fbbd",
        "type": "Annotation",
        "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
        "relation": "RBroadcastDate",
        "date": "1965-03-19T00:00:00.000Z",
        "attribution": "Mediathek Metadaten",
        "constitutedBy": [],
        "created": "2020-12-14T09:34:17.389027+00:00",
        "createdBy": "tsteam",
    },
    {
        "_id": "_Annotation_45029c39-5e68-455a-8648-2c7c25b9fee3",
        "type": "Annotation",
        "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
        "relation": "RKeyword",
        "target": "_Topic_1960s",
        "attribution": "Mediathek Metadaten",
        "constitutedBy": [],
        "created": "2020-12-14T09:36:08.194636+00:00",
        "createdBy": "tsteam",
        "updated": "2020-12-14T09:36:22.061094+00:00",
        "updatedBy": "tsteam",
    },
    {
        "_id": "_Annotation_278b37b8-f808-492d-bc6f-da9cc3727b2e",
        "type": "Annotation",
        "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
        "element": "_Music_e5126526-6a5f-4ca9-b01c-3afe658573ba",
        "relation": "RSoundsLike",
        "target": "_Genre_jazz",
        "constitutedBy": [],
        "created": "2020-12-14T09:37:32.310209+00:00",
        "createdBy": "tsteam",
    },
    {
        "_id": "_Annotation_9c563c06-7443-49cd-9729-e322723070ad",
        "type": "Annotation",
        "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
        "element": "_Picture_d20f1132-b5e2-4694-8cb9-7940ee932ddb",
        "relation": "RPersonPicture",
        "target": "_Person_PaulMcCartney",
        "constitutedBy": [],
        "created": "2020-12-14T09:39:51.102415+00:00",
        "createdBy": "tsteam",
    },
    {
        "_id": "_Annotation_4c32521f-ae9c-4213-8880-a90b3281dfd1",
        "type": "Annotation",
        "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
        "element": "_Picture_d20f1132-b5e2-4694-8cb9-7940ee932ddb",
        "relation": "RPersonPicture",
        "target": "_Person_JohnLennon",
        "constitutedBy": [],
        "created": "2020-12-14T09:40:10.739984+00:00",
        "createdBy": "tsteam",
    },
    {
        "_id": "_Annotation_ec19bfa2-8e8c-4505-89b3-c8bd84653fba",
        "type": "Annotation",
        "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
        "element": "_Speech_0c2c8065-856e-4149-a92b-435da365b1a7",
        "relation": "RQuote",
        "target": "_Person_anonymous-speaker",
        "quotes": "Die Beatle-Freunde können sich vor Freude kaum mehr halten... [...] Und die vier Idole aus Liverpool, die angeblich das gleiche machen was schon Mozart in Salzburg gemacht hat, nämlich Musik, fühlen sich sofort wie zu Hause. Es sei ihnen gegönnt, denn Hetz bleibt Hetz, in England wie in Österreich.",
        "timecodeStart": 39,
        "constitutedBy": [],
        "created": "2020-12-14T09:44:12.780626+00:00",
        "createdBy": "tsteam",
    },
]


class MockClips:
    def find_one(self, *args):
        return mock_clip


class MockElements:
    def find(self, *args):
        return mock_elements


class MockAnnotations:
    def find(self, *args):
        return mock_annots


class MockDB:
    def __init__(self):
        self.clips = MockClips()
        self.elements = MockElements()
        self.annotations = MockAnnotations()


expected = {
    "clip": {
        "_id": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
        "type": "Clip",
        "title": "Die Beatles kommen nach Salzburg [Ausschnitt]",
        "label": "Die Beatles kommen nach Salzburg",
        "url": "https://www.mediathek.at/portaltreffer/atom/1574483C-0DC-0005E-000013C4-1573BB37/pool/BWEB/",
        "platform": "_Platform_Mediathek",
        "fileType": "v",
        "duration": 50,
        "language": ["_VLanguage_de"],
        "clipType": ["_VClipType_Wochenschau"],
        "description": "Austria Wochenschau 19. März 1965.\n1965 wurde ein Teil des Beatles-Filmes 'Help' in Obertauern, Salzburg, gedreht. Die Ankunft der Beatles rief nicht nur Fans auf den Plan.",
        "created": "2020-12-14T09:30:27.343492+00:00",
        "createdBy": "tsteam",
        "shelfmark": "12-00131_b02_k02",
        "updated": "2020-12-14T09:31:44.825636+00:00",
        "updatedBy": "tsteam",
        "annotations": {
            "RBroadcastDate": [
                "_Annotation_e7a6b89b-88cc-4e85-a42b-26a0a5c1fbbd"
            ],
            "RBroadcastSeries": [],
            "RContributor": [],
            "RRecordingDate": [],
            "RKeyword": ["_Annotation_45029c39-5e68-455a-8648-2c7c25b9fee3"],
            "RQuote": [],
            "RDateOfCreation": [],
        },
        "elements": {
            "Segment": [],
            "Music": ["_Music_e5126526-6a5f-4ca9-b01c-3afe658573ba"],
            "Speech": ["_Speech_0c2c8065-856e-4149-a92b-435da365b1a7"],
            "Noise": [],
            "Picture": ["_Picture_d20f1132-b5e2-4694-8cb9-7940ee932ddb"],
        },
    },
    "clipElements": {
        "_Music_e5126526-6a5f-4ca9-b01c-3afe658573ba": {
            "_id": "_Music_e5126526-6a5f-4ca9-b01c-3afe658573ba",
            "type": "Music",
            "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
            "label": "Jazzy Background Music",
            "description": "Does not sound like Beatles (not like jazz either).",
            "created": "2020-12-14T09:37:08.598710+00:00",
            "createdBy": "tsteam",
            "annotations": {
                "RSoundsLike": [
                    "_Annotation_278b37b8-f808-492d-bc6f-da9cc3727b2e"
                ]
            },
        },
        "_Picture_d20f1132-b5e2-4694-8cb9-7940ee932ddb": {
            "_id": "_Picture_d20f1132-b5e2-4694-8cb9-7940ee932ddb",
            "type": "Picture",
            "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
            "label": "Video footage: Beatles arriving",
            "description": "... on Salzburg airport.",
            "created": "2020-12-14T09:39:05.506628+00:00",
            "createdBy": "tsteam",
            "annotations": {
                "RPersonPicture": [
                    "_Annotation_9c563c06-7443-49cd-9729-e322723070ad",
                    "_Annotation_4c32521f-ae9c-4213-8880-a90b3281dfd1",
                ]
            },
        },
        "_Speech_0c2c8065-856e-4149-a92b-435da365b1a7": {
            "_id": "_Speech_0c2c8065-856e-4149-a92b-435da365b1a7",
            "type": "Speech",
            "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
            "label": "Voiceover",
            "description": "... reporting on this glorious event.",
            "created": "2020-12-14T09:41:38.661500+00:00",
            "createdBy": "tsteam",
            "annotations": {
                "RQuote": ["_Annotation_ec19bfa2-8e8c-4505-89b3-c8bd84653fba"]
            },
        },
    },
    "clipAnnotations": {
        "_Annotation_e7a6b89b-88cc-4e85-a42b-26a0a5c1fbbd": {
            "_id": "_Annotation_e7a6b89b-88cc-4e85-a42b-26a0a5c1fbbd",
            "type": "Annotation",
            "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
            "relation": "RBroadcastDate",
            "date": "1965-03-19T00:00:00.000Z",
            "attribution": "Mediathek Metadaten",
            "constitutedBy": [],
            "created": "2020-12-14T09:34:17.389027+00:00",
            "createdBy": "tsteam",
        },
        "_Annotation_45029c39-5e68-455a-8648-2c7c25b9fee3": {
            "_id": "_Annotation_45029c39-5e68-455a-8648-2c7c25b9fee3",
            "type": "Annotation",
            "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
            "relation": "RKeyword",
            "target": "_Topic_1960s",
            "attribution": "Mediathek Metadaten",
            "constitutedBy": [],
            "created": "2020-12-14T09:36:08.194636+00:00",
            "createdBy": "tsteam",
            "updated": "2020-12-14T09:36:22.061094+00:00",
            "updatedBy": "tsteam",
        },
        "_Annotation_278b37b8-f808-492d-bc6f-da9cc3727b2e": {
            "_id": "_Annotation_278b37b8-f808-492d-bc6f-da9cc3727b2e",
            "type": "Annotation",
            "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
            "element": "_Music_e5126526-6a5f-4ca9-b01c-3afe658573ba",
            "relation": "RSoundsLike",
            "target": "_Genre_jazz",
            "constitutedBy": [],
            "created": "2020-12-14T09:37:32.310209+00:00",
            "createdBy": "tsteam",
        },
        "_Annotation_9c563c06-7443-49cd-9729-e322723070ad": {
            "_id": "_Annotation_9c563c06-7443-49cd-9729-e322723070ad",
            "type": "Annotation",
            "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
            "element": "_Picture_d20f1132-b5e2-4694-8cb9-7940ee932ddb",
            "relation": "RPersonPicture",
            "target": "_Person_PaulMcCartney",
            "constitutedBy": [],
            "created": "2020-12-14T09:39:51.102415+00:00",
            "createdBy": "tsteam",
        },
        "_Annotation_4c32521f-ae9c-4213-8880-a90b3281dfd1": {
            "_id": "_Annotation_4c32521f-ae9c-4213-8880-a90b3281dfd1",
            "type": "Annotation",
            "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
            "element": "_Picture_d20f1132-b5e2-4694-8cb9-7940ee932ddb",
            "relation": "RPersonPicture",
            "target": "_Person_JohnLennon",
            "constitutedBy": [],
            "created": "2020-12-14T09:40:10.739984+00:00",
            "createdBy": "tsteam",
        },
        "_Annotation_ec19bfa2-8e8c-4505-89b3-c8bd84653fba": {
            "_id": "_Annotation_ec19bfa2-8e8c-4505-89b3-c8bd84653fba",
            "type": "Annotation",
            "clip": "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7",
            "element": "_Speech_0c2c8065-856e-4149-a92b-435da365b1a7",
            "relation": "RQuote",
            "target": "_Person_anonymous-speaker",
            "quotes": "Die Beatle-Freunde können sich vor Freude kaum mehr halten... [...] Und die vier Idole aus Liverpool, die angeblich das gleiche machen was schon Mozart in Salzburg gemacht hat, nämlich Musik, fühlen sich sofort wie zu Hause. Es sei ihnen gegönnt, denn Hetz bleibt Hetz, in England wie in Österreich.",
            "timecodeStart": 39,
            "constitutedBy": [],
            "created": "2020-12-14T09:44:12.780626+00:00",
            "createdBy": "tsteam",
        },
    },
}


def test_get_clip_by_id():
    clip_id = "_Clip_8e88bead-4a56-4959-8abc-2c21dbe667c7"
    with patch("lama.clips.db"):
        lama.clips.db = MockDB()
        result = lama.clips.get_clip_by_id(clip_id)
        assert check_objects(result, expected)
