#!/bin/bash
sudo -u mongodb /usr/bin/mongod --fork --syslog --dbpath /var/lib/mongodb
sudo -u lama .venv/bin/python scripts/reset_from_eventlog.py
sudo -u lama sh -c 'cd frontend/dist/ && python3 -m http.server 8080 &'
sudo -u lama .venv/bin/python -m lama.server --cors
# if [[ "$(python scripts/get_event_count.py)" -eq 0 ]]; then
#   import the stuff
# else
#   complain and don't do it
# fi
