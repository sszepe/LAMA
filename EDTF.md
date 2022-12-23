# EDTF

Vorraussetzung: “extended format” as defined in 8601: hyphen between calendar components and colon between clock components (e.g. 2005-09-24T10:00:00). “Basic format" as defined in ISO 8601, which omits separators (e.g. 20050924T100000), is not permitted.

Level 0 (without approximations and uncertainty): 

## Date

+ [year][“-”][month][“-”][day] or [year][“-”][month] or [year]
+ {0-9}4-?([0-1][0-9])-?([0-3][0-9])

## Date and Time 

+ [date][“T”][time]
Complete representations for calendar date and (local) time of day
Example 1: ‘1985-04-12T23:20:30’ refers to the date 1985 April 12th at 23:20:30 local time.
+ [date][T](([0-2][0-9]):([0-5][0-9]):?([0-5][0-9]))

## Time Interval

+ both the start and end are dates: start and end date only; that is, both start and duration, and duration and end, are excluded. Time of day is excluded.
+ [date]/[date]

level 1:
+ A null string may be used for the start or end date when it is unknown. ( ‘1985-04-12/’)
+ Double-dot (“..”) may be used when either the start or end date is not specified, either because there is none or for any other reason. (‘1985-04-12/..’)
+ A modifier ('?', '~', '%') may appear at the end of the date to indicate "uncertain" and/or "approximate"

## Qualification of a date (complete)

The characters '?', '~' and '%' are used to mean "uncertain", "approximate", and "uncertain" as well as "approximate", respectively. These characters may occur only at the end of the date string and apply to the entire date.

'?': uncertain
leave these out?
    '~': approximate
    '%': "uncertain" as well as "approximate"

+ [date] plus eins der 3 Zeichen

Example 1: '1984?' year uncertain (possibly the year 1984, but not definitely)


# Interresting, but probably not relevant

## Letter-prefixed calendar year

+ 'Y' may be used at the beginning of the date string to signify that the date is a year, when (and only when) the year exceeds four digits, i.e. for years later than 9999 or earlier than -9999.

## Seasons

+ The values 21, 22, 23, 24 may be used used to signify ' Spring', 'Summer', 'Autumn', 'Winter', respectively, in place of a month value (01 through 12) for a year-and-month format string.