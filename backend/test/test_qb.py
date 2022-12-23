from lama.query_entities import build_sparql_query as bsq

QUERY_START = """PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX wd: <https://www.wikidata.org/wiki/>
PREFIX gnd: <http://d-nb.info/gnd/>
PREFIX mbr: <https://musicbrainz.org/relations/>
PREFIX mbw: <https://musicbrainz.org/work/>
PREFIX mba: <https://musicbrainz.org/artist/>
PREFIX t: <https://tellingsounds.com/lama/entityTypes#>
PREFIX p: <https://tellingsounds.com/lama/properties#>
PREFIX a: <https://tellingsounds.com/lama/analysisCats#>
PREFIX : <https://tellingsounds.com/lama/entities#>

SELECT DISTINCT ?s WHERE {
  """

QUERY_END = """
  FILTER( regex(str(?s), 'tellingsounds.com/lama') )
}"""


def _q(expected):
    return QUERY_START + expected + QUERY_END


def test_complex_without_negation():
    query_data = {
        "and": [
            {
                "all": [
                    {"var": "entityType"},
                    {"in": [{"var": ""}, ["PieceOfMusic"]]},
                ]
            },
            {
                "or": [
                    {
                        "all": [
                            {"var": "attribute.composer"},
                            {"in": [{"var": ""}, ["_Person_david-bowie"]]},
                        ]
                    },
                    {
                        "and": [
                            {
                                "all": [
                                    {"var": "attribute.composer"},
                                    {
                                        "in": [
                                            {"var": ""},
                                            ["_Person_wolfgang-ambros"],
                                        ]
                                    },
                                ]
                            },
                            {
                                "all": [
                                    {"var": "attribute.lyricist"},
                                    {
                                        "in": [
                                            {"var": ""},
                                            ["_Person_joesi-prokopetz"],
                                        ]
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        "all": [
                            {"var": "attribute.composer"},
                            {
                                "in": [
                                    {"var": ""},
                                    [
                                        "_Person_alban-berg",
                                        "_Person_friedrich-cerha",
                                    ],
                                ]
                            },
                        ]
                    },
                    {
                        "all": [
                            {"var": "isEntity"},
                            {
                                "in": [
                                    {"var": ""},
                                    [
                                        "_PieceOfMusic_the-blue-danube-donauwalzer"
                                    ],
                                ]
                            },
                        ]
                    },
                ]
            },
        ]
    }
    expected = _q(
        """{
    { ?s rdf:type t:PieceOfMusic }
    .
    {
      { ?s mbr:composer :_Person_david-bowie }
      UNION
      {
        { ?s mbr:composer :_Person_wolfgang-ambros }
        .
        { ?s mbr:lyricist :_Person_joesi-prokopetz }
      }
      UNION
      { ?s mbr:composer :_Person_alban-berg, :_Person_friedrich-cerha }
      UNION
      { ?s owl:sameAs :_PieceOfMusic_the-blue-danube-donauwalzer }
    }
  }"""
    )
    assert bsq(query_data) == expected


def test_negation_simple():
    query_data = {
        "and": [
            {
                "all": [
                    {"var": "entityType"},
                    {"in": [{"var": ""}, ["PieceOfMusic"]]},
                ]
            },
            {
                "!": {
                    "all": [
                        {"var": "attribute.composer"},
                        {"in": [{"var": ""}, ["_Person_LudwigVanBeethoven"]]},
                    ]
                }
            },
        ]
    }
    expected = _q(
        """{
    { ?s rdf:type t:PieceOfMusic }
    .
    MINUS { ?s mbr:composer :_Person_LudwigVanBeethoven }
  }"""
    )
    assert bsq(query_data) == expected


def test_double_negation():
    query_data = {
        "!": {
            "or": [
                {
                    "!": {
                        "all": [
                            {"var": "entityType"},
                            {"in": [{"var": ""}, ["PieceOfMusic"]]},
                        ]
                    }
                },
                {
                    "!": {
                        "or": [
                            {
                                "all": [
                                    {"var": "attribute.composer"},
                                    {
                                        "in": [
                                            {"var": ""},
                                            ["_Person_LudwigVanBeethoven"],
                                        ]
                                    },
                                ]
                            },
                            {
                                "!": {
                                    "all": [
                                        {"var": "attribute.composer"},
                                        {
                                            "in": [
                                                {"var": ""},
                                                [
                                                    "_Person_wolfgang-amadeus-mozart"
                                                ],
                                            ]
                                        },
                                    ]
                                }
                            },
                        ]
                    }
                },
            ]
        }
    }
    expected = _q(
        """{
    { ?s rdf:type t:PieceOfMusic }
    .
    {
      { ?s mbr:composer :_Person_LudwigVanBeethoven }
      UNION
      { { ?s ?p ?o } MINUS { ?s mbr:composer :_Person_wolfgang-amadeus-mozart } }
    }
  }"""
    )
    assert bsq(query_data) == expected


def test_all_negated_and():
    query_data = {
        "and": [
            {
                "!": {
                    "all": [
                        {"var": "entityType"},
                        {"in": [{"var": ""}, ["Topic"]]},
                    ]
                }
            },
            {
                "!": {
                    "all": [
                        {"var": "analyticsCat"},
                        {"in": [{"var": ""}, ["AMemory"]]},
                    ]
                }
            },
        ]
    }
    expected = _q(
        """{
    { ?s ?p ?o }
    MINUS { ?s rdf:type t:Topic }
    .
    MINUS { ?s p:analysisCat a:AMemory }
  }"""
    )
    assert bsq(query_data) == expected
