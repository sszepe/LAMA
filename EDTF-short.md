# EDTF

Extended Date/Time Format (EDTF) Specification: https://www.loc.gov/standards/datetime/
Das LAMA unterstützt momentan die Level 0 und 1. Im folgenden sind die wichtigsten Features zusammengefasst, für Details bitte in die Spezifikation schauen. 

## Date

Representation of a Date.

YYYY or YYYY-MM or YYYY-MM-DD (eg.:  '1985' or '1985-04' or '1985-04-12')

A modifier ('?', '~', '%') may appear at the end of the date to indicate "uncertain" and/or "approximate"
    + '?': uncertain (possibly the given date, but not definitely)
    + '~': approximate
    + '%': "uncertain" as well as "approximate"

## Date and Time

Complete representations for calendar date and (local) time of day. Timezone-options are available in the specification.

[date]THH:MM:SS (eg.: '1985-04-12T23:20:30')

## Time Interval

Representations of a time interval where both the start and end are dates, time of day is excluded.

[date]/[date] (eg.: '2004-02-01/2005-02')

A null string may be used for the start or end date when it is unknown. ( '1985-04-12/')
Double-dot (“..”) may be used when either the start or end date is not specified, either because there is none (the event/time period etc. is still going on) or for any other reason. ('1985-04-12/..')

## Seasons

The values 21, 22, 23, 24 may be used used to signify ' Spring', 'Summer', 'Autumn', 'Winter', respectively, in place of a month value (01 through 12) for a year-and-month format string.
Seasons are not compatible with intervals or time.
