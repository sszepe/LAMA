"""functions related to clips (get_clips, get_basic_clip_by_id, etc.)"""
from collections import defaultdict, OrderedDict
from typing import Dict, List

from lama.database import db, ASC
from lama.errors import IdNotFoundError  # , ValidationError
from lama.truth.relations import (
    Elements,
    Relations,
    supported_relations,
)


def get_clips(
    filter_created_by=None,
    filter_clip_ids=None,
    sort_by=[],
    favorite_ids=[],
) -> List[Dict]:
    filter_steps = []
    if filter_clip_ids is not None:
        filter_steps.append(
            {
                "$match": {
                    "_id": {"$in": filter_clip_ids},
                }
            }
        )
    if filter_created_by:
        filter_steps.append(
            {
                "$match": {
                    "createdBy": {"$regex": f"^{filter_created_by}"},
                }
            }
        )
    label_or_title_step = {
        "$addFields": {
            "labelTitle": {"$ifNull": ["$label", "$title"]},
        }
    }
    favorite_step = {
        "$addFields": {"isFavorite": {"$in": ["$_id", favorite_ids]}}
    }
    updated_created_step = {
        "$set": {
            "updated": {"$ifNull": ["$updated", "$created"]},
        }
    }
    count_creation_date_steps = [
        {
            "$lookup": {
                "from": "annotations",
                "let": {"clipId": "$_id"},
                "pipeline": [
                    {"$match": {"$expr": {"$eq": ["$$clipId", "$clip"]}}},
                ],
                "as": "__clipAnnots",
            }
        },
        {
            "$addFields": {
                "annotationCount": {"$size": "$__clipAnnots"},
                "__creationAnnot": {
                    "$first": {
                        "$filter": {
                            "input": "$__clipAnnots",
                            "as": "annot",
                            "cond": {
                                "$eq": ["$$annot.relation", "RDateOfCreation"]
                            },
                        }
                    }
                },
            }
        },
        {
            "$addFields": {
                "creationDate": "$__creationAnnot.date",
            }
        },
        {
            "$addFields": {
                # "missing" or "string"
                "__creationDateType": {"$type": "$creationDate"},
            }
        },
    ]
    for i, (field, _) in enumerate(sort_by):
        if field == "creationDate":
            sort_by.insert(i, ("__creationDateType", -1))
            break
    sorting_step = {
        "$sort": OrderedDict(
            (
                *sort_by,
                ("_id", 1),
            ),
        )
    }
    cleanup_step = {
        "$project": {
            "__clipAnnots": 0,
            "__creationAnnot": 0,
            "__creationDateType": 0,
        }
    }
    return list(
        db.clips.aggregate(
            [
                *filter_steps,
                label_or_title_step,
                favorite_step,
                updated_created_step,
                *count_creation_date_steps,
                sorting_step,
                cleanup_step,
            ],
            # collation={"locale": "de", "strength": 1},
        )
    )


def get_basic_clip_by_id(clip_id):
    results = get_clips(filter_clip_ids=[clip_id])
    if len(results) < 1:
        raise IdNotFoundError(f'no result for id "{clip_id}"')
    [clip] = results
    return clip


def get_clip_by_id(clip_id):
    clip = db.clips.find_one({"_id": clip_id})
    if clip is None:
        raise IdNotFoundError(f'no result for id "{clip_id}"')
    annots = list(
        db.annotations.find({"clip": clip_id}).sort(
            [("timecodeStart", ASC), ("timecodeEnd", ASC), ("created", ASC)]
        )
    )
    clip_annots = {r.name: [] for r in supported_relations[Elements.Clip]}
    annots_by_element = defaultdict(dict)
    for a in annots:
        e = a.get("element")
        r = Relations[a["relation"]].name
        if e is not None:
            annots_by_element[e][r] = annots_by_element[e].get(r, []) + [
                a["_id"]
            ]
        else:
            clip_annots[r] = clip_annots.get(r, []) + [a["_id"]]
    elements = {e["_id"]: e for e in db.elements.find({"clip": clip_id})}
    for el in elements.values():
        el["annotations"] = annots_by_element.get(el["_id"], {})
    element_ids = {k.name: [] for k in Elements if k != Elements.Clip}
    for e in sorted(
        elements.values(),
        key=lambda el: (el.get("timecodes", [[-1, -1]]), el["created"]),
    ):
        element_ids[e["type"]].append(e["_id"])
    segments = list(
        db.segments.find({"clip": clip_id}).sort(
            [("timecodes", ASC), ("created", ASC)]
        )
    )
    clip["annotations"] = clip_annots
    clip["elements"] = element_ids
    clip["segments"] = [s["_id"] for s in segments]
    return {
        "clip": clip,
        "clipElements": elements,
        "clipAnnotations": {a["_id"]: a for a in annots},
        "clipSegments": {s["_id"]: s for s in segments},
    }


def get_favorite_clip_ids(user_id):
    return (db.users.find_one({"_id": user_id}) or {}).get("favoriteClips", [])


if __name__ == "__main__":
    from pprint import pprint

    pprint([c for c in get_clips()])
