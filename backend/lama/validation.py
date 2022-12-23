"""The beginnings of trying to validate and possibly reject Commands putting
them into action. Ideally, the schemas could be used to ensure appropriate
client data."""
from typing import Dict

from lama.truth.commands_events import Commands
from lama.database import db, get_document_by_id
from lama.platform_effective_ids import effective_id_from_url
from lama.errors import IdNotFoundError, ValidationError


def not_the_droids(payload, user_id):
    return


def validate_create_annotation(payload, user_id):
    clip_id = payload["clip"]
    if db.clips.find_one({"_id": clip_id}) is None:
        raise ValidationError("clip does not exist")
    element_id = payload.get("element")
    if (
        element_id is not None
        and db.elements.find_one({"_id": element_id}) is None
    ):
        raise ValidationError("element does not exist")


def validate_delete_annotation(payload, user_id):
    annot_id = payload["_id"]
    annot = get_document_by_id(annot_id)
    if annot["createdBy"] != user_id:
        raise ValidationError("You can only delete annotations you created.")
    referenced_by = [
        a["_id"]
        for a in db.annotations.find(
            {
                "$or": [
                    {
                        "refersTo": annot_id,
                    },
                    {
                        "constitutedBy": annot_id,
                    },
                ]
            }
        )
    ]
    if len(referenced_by) > 0:
        raise ValidationError(
            f"Cannot delete: (annotation referenced in {', '.join(referenced_by)})"
        )
    used_in_segments = [
        f"{s['label']} ({s['_id']})"
        for s in db.segments.find(
            {
                "segmentContains.annotation": annot_id,
            }
        )
    ]
    if len(used_in_segments) > 0:
        raise ValidationError(
            f"Cannot delete: annotation used in {', '.join(used_in_segments)}"
        )


def _get_entity_usage(entity_id):
    relevant_fields_clip = [
        "platform",
        "collections",
        "language",
        "clipType",
    ]
    relevant_fields_annot = [
        "target",
        "role",
        "instrument",
    ]
    clip_results = db.clips.find(
        {"$or": [{f: entity_id} for f in relevant_fields_clip]}
    )
    annot_results = db.annotations.find(
        {"$or": [{f: entity_id} for f in relevant_fields_annot]}
    )
    return [
        clip_or_annot["_id"]
        for clip_or_annot in (*clip_results, *annot_results)
    ]


def validate_delete_entity(payload, user_id):
    entity_id = payload["_id"]
    used_by = _get_entity_usage(entity_id)
    if len(used_by) > 0:
        raise ValidationError(f"Cannot delete: (used in {', '.join(used_by)})")


def validate_delete_segment(payload, user_id):
    segment_id = payload["_id"]
    segment = get_document_by_id(segment_id)
    if segment["createdBy"] != user_id:
        raise ValidationError("You can only delete segments you created.")


def validate_clip(payload, user_id):
    url = payload.get("url")
    if url is None:
        return
    eff_id = effective_id_from_url(url)
    existing_clip = db.clips.find_one({"effectiveId": eff_id})
    if existing_clip is not None and payload["_id"] != existing_clip["_id"]:
        raise ValidationError(
            f"A clip with this URL already exists: {existing_clip['_id']}"
        )


def validate_delete_element(payload, user_id):
    element_id = payload["_id"]
    element = get_document_by_id(element_id)
    if element["createdBy"] != user_id:
        raise ValidationError("You can only delete elements you created.")
    has_annotations = (
        db.annotations.find_one({"element": element_id}) is not None
    )
    if has_annotations:
        raise ValidationError("Cannot delete: not empty")


COMMANDS = {
    # entities
    Commands.DeleteEntity: validate_delete_entity,
    # clips
    Commands.CreateClip: validate_clip,
    Commands.UpdateClip: validate_clip,
    # annotations
    Commands.CreateAnnotation: validate_create_annotation,
    Commands.DeleteAnnotation: validate_delete_annotation,
    # elements
    Commands.DeleteElement: validate_delete_element,
    # segments
    Commands.DeleteSegment: validate_delete_segment,
}


def validate_command(command_name: str, payload: Dict, user_id: str) -> None:
    if command_name not in COMMANDS:
        return
    validation_function = COMMANDS[command_name] or not_the_droids
    try:
        validation_function(payload, user_id)
    except (ValidationError, IdNotFoundError):
        raise
    except Exception:
        raise ValidationError("error validating command")
