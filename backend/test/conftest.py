import pytest

import lama.clips
import lama.database
import lama.entities
import lama.events
import lama.query
import lama.validation


@pytest.fixture
def testingdb_top10():
    testing_db = lama.database.client["tellingsounds_db_test_top10"]
    lama.database.db = testing_db
    lama.clips.db = testing_db
    lama.entities.db = testing_db
    lama.events.db = testing_db
    lama.query.db = testing_db
    lama.validation.db = testing_db
