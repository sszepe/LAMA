import argparse

from bson import json_util

from lama.types_errors import Event
from lama.util import get_timestamp
from lama.events import handle_event
import lama.eventstore as eventstore


def _make_event(event_name, subject_id, data, prev_data):
    return Event(
        None,
        get_timestamp(),
        event_name,
        1,
        "system",
        subject_id,
        data,
        prev_data,
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "infile",
        type=argparse.FileType("r", encoding="utf-8"),
        help="LAMA MongoDB dump in JSON format",
    )
    parser.add_argument(
        "--store-only",
        action="store_true",
        help="only store event in event log, without handling",
    )
    args = parser.parse_args()
    with args.infile as f:
        data = json_util.loads(f.read())
    event = _make_event("MongoStateLoaded", None, data, None)
    if not args.store_only:
        handle_event(event)
    eventstore.store(event)


if __name__ == "__main__":
    main()
