from enum import Enum, unique, auto

from lama.errors import MissingInfoError


@unique
class EntityTypes(Enum):
    AnySound = auto()
    BroadcastSeries = auto()
    Broadcaster = auto()
    Collection = auto()
    CollectiveIdentity = auto()
    CreativeWork = auto()
    Event = auto()
    EventSeries = auto()
    FictionalCharacter = auto()
    Genre = auto()
    Group = auto()
    LieuDeMemoire = auto()
    Location = auto()
    Movement = auto()
    Organization = auto()
    Person = auto()
    PieceOfMusic = auto()
    Place = auto()
    Platform = auto()
    ProductionTechniquePicture = auto()
    ProductionTechniqueSound = auto()
    Repertoire = auto()
    Shot = auto()
    Station = auto()
    Thing = auto()
    TimePeriod = auto()
    Topic = auto()
    Topos = auto()
    VActivity = auto()
    VAdjective = auto()
    VClipContributorRole = auto()
    VFunctionInClipRole = auto()
    VClipType = auto()
    VEventType = auto()
    VInstrument = auto()
    VLanguage = auto()
    VMusicArts = auto()
    VMusicPerformanceRole = auto()
    VSpeechGenre = auto()


E = EntityTypes

entity_type_info = {
    E.AnySound: {
        "label": "Any sound",
        "definition": "An identifiable sound, most often from nature or everyday life (e.g. birdsong).",
    },
    E.BroadcastSeries: {
        "label": "Broadcast series",
        "definition": "A recurring TV or radio program (e.g. Ö1 Mittagsjournal).",
    },
    E.Broadcaster: {
        "label": "Broadcaster",
        "definition": "A broadcasting organization (e.g. ORF).",
    },
    E.Collection: {
        "label": "Collection",
        "definition": "An existing collection of clips (e.g. Wiener Video Rekorder / Mediathek).",
    },
    E.CollectiveIdentity: {
        "label": "Collective identity",
        "definition": "A group of people with something in common (e.g. Youth, Nazis, Police).",
    },
    E.CreativeWork: {
        "label": "Creative work",
        "definition": "An identifiable creative work that is not a piece of music (e.g. a book or a film).",
    },
    E.Event: {
        "label": "Event",
        "definition": "A concrete event at a certain time and location that can actually be attended (e.g. a concert).",
    },
    E.EventSeries: {
        "label": "Event series",
        "definition": "A recurring series of events (e.g. Wiener Festwochen).",
    },
    E.FictionalCharacter: {
        "label": "Fictional character",
        "definition": "A fictional character (e.g. Donald Duck).",
    },
    E.Genre: {
        "label": "Genre",
        "definition": "A subcategory of creative production (e.g. Heavy Metal).",
    },
    E.Group: {
        "label": "Group",
        "definition": "A group where all members are (or could be) known by name (e.g. The Beatles).",
    },
    E.LieuDeMemoire: {
        "label": "Lieu de Memoire",
        "definition": "... ein Gedächtnisort eben.",
    },
    E.Location: {
        "label": "Location",
        "definition": "A place with known GPS coordinates, address, or borders (e.g. Wiener Konzerthaus).",
    },
    E.Movement: {
        "label": "Movement",
        "definition": "A political, cultural, or artistic movement (e.g. Marxism, Dadaism).",
    },
    E.Organization: {
        "label": "Organization",
        "definition": "An organization (e.g. United Nations).",
    },
    E.Person: {
        "label": "Person",
        "definition": "An actual person, living or dead (e.g. Johannes Chrysostomus Wolfgangus Theophilus Mozart).",
    },
    E.PieceOfMusic: {
        "label": "Piece of Music",
        "definition": "Any identifiable piece of music (e.g. Donauwalzer, My Way).",
    },
    E.Place: {
        "label": "Place",
        "definition": "A generic type of place (e.g. the street, a church).",
    },
    E.Platform: {
        "label": "Platform",
        "definition": "A website or institution where clips are to be found (e.g. Österreichische Mediathek).",
    },
    E.ProductionTechniquePicture: {
        "label": "Production technique (picture)",
        "definition": "A production technique on the visual level (e.g. jump-cut).",
    },
    E.ProductionTechniqueSound: {
        "label": "Production technique (sound)",
        "definition": "A production technique on the auditory level (e.g. fade-out).",
    },
    E.Repertoire: {
        "label": "Repertoire",
        "definition": "A musical subcategory (e.g. Wiener Klassik).",
    },
    E.Shot: {
        "label": "Shot type (camera)",
        "definition": "... for film buffs.",
    },
    E.Station: {
        "label": "Broadcasting station",
        "definition": "A broadcasting station (e.g. Ö1).",
    },
    E.Thing: {
        "label": "Thing",
        "definition": "Any thing appearing in the wide world (e.g. Cigarette).",
    },
    E.TimePeriod: {
        "label": "Time period",
        "definition": "A timespan with historical significance.",
    },
    E.Topic: {
        "label": "Topic",
        "definition": "Any (intangible) concept not fitting any other category.",
    },
    E.Topos: {"label": "Topos", "definition": "Topos."},
    E.VLanguage: {
        "label": "Language",
        "definition": "An official language (e.g. Finnish).",
    },
    E.VClipType: {
        "label": "Clip type",
        "definition": "A category describing a clip's form of presentation (e.g. documentary, interview).",
    },
    E.VClipContributorRole: {
        "label": "Contributor role",
        "definition": "The function ascribed to a contributor in the credits (e.g. director, presenter).",
    },
    E.VFunctionInClipRole: {
        "label": "Function in clip (role)",
        "definition": "An agent's role in a clip, derived from their actual actions rather than the credits (e.g. eyewitness).",
    },
    E.VMusicPerformanceRole: {
        "label": "Performer role",
        "definition": "A person's role in a musical performance (e.g. soloist, conductor).",
    },
    E.VEventType: {
        "label": "Event type",
        "definition": "A subcategory of events (e.g. concert, exhibition).",
    },
    E.VSpeechGenre: {
        "label": "Speech type",
        "definition": "The subcategory best describing a Speech (e.g. interview, lecture).",
    },
    E.VActivity: {
        "label": "Activity",
        "definition": "An activity that is being shown or heard (e.g. clapping).",
    },
    E.VInstrument: {
        "label": "Instrument",
        "definition": "A musical instrument (e.g. piano, violin, banjo).",
    },
    E.VAdjective: {
        "label": "Adjective",
        "definition": "A word that describes someone or something (e.g. big, loud, bright).",
    },
    E.VMusicArts: {
        "label": "Music/Arts Vocabulary",
        "definition": "...",
    },
}


missing_info = [e for e in EntityTypes if e not in entity_type_info]
if len(missing_info) > 0:
    raise MissingInfoError(missing_info)
