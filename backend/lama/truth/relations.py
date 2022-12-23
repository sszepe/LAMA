from enum import Enum, auto, unique

from lama.errors import MissingInfoError
from lama.truth.annotations import AnnotationFields
from lama.truth.entitytypes import EntityTypes
from lama.util import sorted_enums


@unique
class Relations(Enum):
    RBroadcastDate = auto()
    RBroadcastSeries = auto()
    RContributor = auto()
    RDateOfCreation = auto()
    RInstrument = auto()
    RKeyword = auto()
    RLyricsQuote = auto()
    RTextQuote = auto()
    RMentions = auto()
    RMusicalQuote = auto()
    RPerformanceDate = auto()
    RPerformer = auto()
    RPieceOfMusic = auto()
    RProductionTechniquePicture = auto()
    RProductionTechniqueSound = auto()
    RQuote = auto()
    RRecordingDate = auto()
    RReminiscentOfMusic = auto()
    RReminiscentOfNoise = auto()
    RReminiscentOfPicture = auto()
    RReminiscentOfSpeech = auto()
    RShot = auto()
    RShows = auto()
    RSoundAdjective = auto()
    RSoundsLike = auto()
    RSoundsLikeNoise = auto()
    RSpeaker = auto()
    RSpeechDescriptionText = auto()


@unique
class Elements(Enum):
    Clip = auto()
    Segment = auto()
    Music = auto()
    Speech = auto()
    Noise = auto()
    Picture = auto()


R = Relations
A = AnnotationFields
T = EntityTypes
E = Elements

showable = sorted_enums(
    [
        T.CollectiveIdentity,
        T.CreativeWork,
        T.Event,
        T.FictionalCharacter,
        T.Group,
        T.LieuDeMemoire,
        T.Location,
        T.Organization,
        T.Person,
        T.Place,
        T.Thing,
        T.Topos,
        T.VActivity,
        T.VInstrument,
    ]
)

all_keywords = sorted_enums(
    [
        *showable,
        T.BroadcastSeries,
        T.Broadcaster,
        T.EventSeries,
        T.Genre,
        T.Movement,
        T.PieceOfMusic,
        T.Repertoire,
        T.TimePeriod,
        T.Topic,
        T.VMusicArts,
        T.VLanguage,
    ]
)

basic_fields = sorted_enums([A.attribution, A.comment, A.confidence])
timecode = sorted_enums(
    [
        A.timecodeEnd,
        A.timecodeStart,
    ]
)
just_target = sorted_enums([*basic_fields, A.target])
target_timecode = sorted_enums(
    [
        *just_target,
        *timecode,
    ]
)
target_timecode_metadate = sorted_enums(
    [
        *target_timecode,
        A.metaDate,
    ]
)
just_date = sorted_enums(
    [
        *basic_fields,
        A.date,
    ]
)

relation_info = {
    R.RBroadcastDate: {
        "label": "Broadcast date",
        "definition": "Date of public broadcast.",
        "multi": True,
        "types": [T.Station],
        "roles": [],
        "allowed": [*just_date, A.target],
        "required": [A.date],
    },
    R.RBroadcastSeries: {
        "label": "Broadcast series",
        "definition": "The series material in the clips belongs to.",
        "multi": False,
        "types": [T.BroadcastSeries],
        "roles": [],
        "allowed": just_target,
        "required": [A.target],
    },
    R.RContributor: {
        "label": "Contributor",
        "definition": "An agent who is (or should be) mentioned in the credits.",
        "multi": True,
        "types": [T.Person, T.Group, T.Organization, T.Broadcaster],
        "roles": [T.VClipContributorRole],
        "allowed": [*target_timecode_metadate, A.role],
        "required": [A.role, A.target],
    },
    R.RDateOfCreation: {
        "label": "Date of Creation",
        "definition": "The date or time period the primary contents of the clip were created.",
        "multi": False,
        "types": [],
        "roles": [],
        "allowed": just_date,
        "required": [A.date],
    },
    R.RRecordingDate: {
        "label": "Recording date",
        "definition": "The date or time period the material was recorded.",
        "multi": False,
        "types": [],
        "roles": [],
        "allowed": just_date,
        "required": [A.date],
    },
    R.RQuote: {
        "label": "Quote",
        "definition": "A verbatim quote appearing in the clip.",
        "multi": True,
        "types": [T.Person, T.FictionalCharacter],
        "roles": [],
        "allowed": [*target_timecode_metadate, A.quotes],
        "required": [A.quotes],
    },
    R.RTextQuote: {
        "label": "Quote",
        "definition": "A text shown in the Picture of a clip.",
        "multi": True,
        "types": [T.Person, T.FictionalCharacter],
        "roles": [],
        "allowed": [*target_timecode_metadate, A.quotes],
        "required": [A.quotes],
    },
    R.RLyricsQuote: {
        "label": "Lyrics",
        "definition": "The lyrics in a Music (the text someone is singing for example).",
        "multi": True,
        "types": [T.Person, T.FictionalCharacter],
        "roles": [],
        "allowed": [*target_timecode_metadate, A.quotes],
        "required": [A.quotes],
    },
    R.RMusicalQuote: {
        "label": "Musical quote",
        "definition": "A piece of music that is being quoted musically.",
        "multi": True,
        "types": [T.PieceOfMusic],
        "roles": [],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RInstrument: {
        "label": "Has Instrument",
        "definition": "The musical instrument whose sound can be heard.",
        "multi": True,
        "types": [T.Thing, T.VInstrument],
        "roles": [],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RKeyword: {
        "label": "Keyword",
        "definition": "Anything appearing in the clip that seems noteworthy.",
        "multi": True,
        "types": all_keywords,
        "roles": [T.VFunctionInClipRole],
        "allowed": [*target_timecode_metadate, A.role],
        "required": [A.target],
    },
    R.RMentions: {
        "label": "Mentions",
        "definition": "Something or someone mentioned in the Speech.",
        "multi": True,
        "types": [
            *all_keywords,
            T.ProductionTechniquePicture,
            T.ProductionTechniqueSound,
        ],
        "roles": [],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RShows: {
        "label": "Shows",
        "definition": "Someone or something shown in the Picture.",
        "multi": True,
        "types": showable,
        "roles": [T.VFunctionInClipRole],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RPieceOfMusic: {
        "label": "Is Piece of Music",
        "definition": "The piece of music this Music has been identified as.",
        "multi": False,
        "types": [T.PieceOfMusic],
        "roles": [],
        "allowed": target_timecode,
        "required": [A.target],
    },
    R.RSoundsLike: {
        "label": "Sounds like (music)",
        "definition": "(Other) music that this Music or section is sharing characteristics with.",
        "multi": True,
        "types": [T.PieceOfMusic, T.Genre, T.Repertoire],
        "roles": [],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RReminiscentOfMusic: {
        "label": "Reminiscent of (Music)",
        "definition": "Something (usually) extra-musical that can be associated with the Music.",
        "multi": True,
        "types": [T.Thing, T.AnySound],
        "roles": [],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RPerformer: {
        "label": "Performer",
        "definition": "An agent participating in a musical performance.",
        "multi": True,
        "types": [T.Person, T.Group, T.FictionalCharacter],
        "roles": [T.VMusicPerformanceRole],
        "allowed": [*just_target, A.role],
        "required": [A.role, A.target],
    },
    R.RPerformanceDate: {
        "label": "Performance date",
        "definition": "The date of a musical performance.",
        "multi": False,
        "types": [],
        "roles": [],
        "allowed": just_date,
        "required": [A.date],
    },
    R.RSpeaker: {
        "label": "Speaker",
        "definition": "The person that is speaking.",
        "multi": False,
        "types": [T.Person, T.FictionalCharacter],
        "roles": [T.VClipContributorRole, T.VFunctionInClipRole],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RSpeechDescriptionText: {
        "label": "Speech description",
        "definition": "Description of how somebody is speaking.",
        "multi": True,
        "types": [
            T.VActivity,
            T.VAdjective,
            T.VLanguage,
            T.VSpeechGenre,
        ],
        "roles": [],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RReminiscentOfSpeech: {
        "label": "Reminiscent of (Speech)",
        "definition": "Something the Speech can be associated with, but isn't actually.",
        "multi": True,
        "types": [
            T.AnySound,
            T.Person,
            T.FictionalCharacter,
            T.Thing,
            T.VActivity,
            T.VLanguage,
            T.VSpeechGenre,
        ],
        "roles": [],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RReminiscentOfNoise: {
        "label": "Reminiscent of (Other Sounds)",
        "definition": "Something the sound can be associated with, but most likely isn't.",
        "multi": True,
        "types": [T.AnySound, T.Thing, T.VActivity],
        "roles": [],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RSoundsLikeNoise: {
        "label": "Sounds like",
        "definition": "Best description (or guess) of what a sound actually is.",
        "multi": True,
        "types": [
            T.AnySound,
            T.Thing,
            T.VActivity,
            T.VAdjective,
        ],
        "roles": [],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RShot: {
        "label": "Camera shot",
        "definition": "The camera technique used.",
        "multi": True,
        "types": [T.Shot],
        "roles": [],
        "allowed": target_timecode,
        "required": [A.target],
    },
    R.RReminiscentOfPicture: {
        "label": "Reminiscent of (Picture)",
        "definition": "Something the Picture can be associated with, but most likely isn't.",
        "multi": True,
        "types": [
            T.Broadcaster,
            T.BroadcastSeries,
            T.CreativeWork,
            T.Station,
            T.Thing,
            T.Topic,
            T.VActivity,
        ],
        "roles": [],
        "allowed": target_timecode_metadate,
        "required": [A.target],
    },
    R.RProductionTechniquePicture: {
        "label": "Production technique (picture)",
        "definition": "A visual production technique being used.",
        "multi": True,
        "types": [T.ProductionTechniquePicture],
        "roles": [],
        "allowed": target_timecode,
        "required": [A.target],
    },
    R.RProductionTechniqueSound: {
        "label": "Production technique (sound)",
        "definition": "A auditory production technique being used.",
        "multi": True,
        "types": [T.ProductionTechniqueSound],
        "roles": [],
        "allowed": target_timecode,
        "required": [A.target],
    },
    R.RSoundAdjective: {
        "label": "Adjective describing sound",
        "definition": "Description of a sound.",
        "multi": True,
        "types": [T.VAdjective, T.VMusicArts],
        "roles": [],
        "allowed": target_timecode,
        "required": [A.target],
    },
}


supported_relations = {
    E.Clip: [
        R.RBroadcastDate,
        R.RBroadcastSeries,
        R.RContributor,
        R.RDateOfCreation,
        R.RKeyword,
        R.RQuote,
    ],
    E.Segment: [],
    E.Music: [
        R.RInstrument,
        R.RKeyword,
        R.RLyricsQuote,
        R.RMusicalQuote,
        R.RPerformanceDate,
        R.RPerformer,
        R.RPieceOfMusic,
        R.RProductionTechniqueSound,
        R.RRecordingDate,
        R.RReminiscentOfMusic,
        R.RSoundAdjective,
        R.RSoundsLike,
    ],
    E.Speech: [
        R.RKeyword,
        R.RMentions,
        R.RProductionTechniqueSound,
        R.RQuote,
        R.RRecordingDate,
        R.RReminiscentOfSpeech,
        R.RSoundAdjective,
        R.RSpeaker,
        R.RSpeechDescriptionText,
    ],
    E.Noise: [
        R.RProductionTechniqueSound,
        R.RRecordingDate,
        R.RReminiscentOfNoise,
        R.RSoundAdjective,
        R.RSoundsLikeNoise,
        R.RKeyword,
    ],
    E.Picture: [
        R.RKeyword,
        R.RProductionTechniquePicture,
        R.RRecordingDate,
        R.RReminiscentOfPicture,
        R.RShot,
        R.RShows,
        R.RTextQuote,
    ],
}

missing_info = [r for r in Relations if r not in relation_info]
if len(missing_info) > 0:
    raise MissingInfoError(missing_info)
