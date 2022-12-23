## EDTF quick guide

### Date

`YYYY` or `YYYY-MM` or `YYYY-MM-DD` (eg.:  `1985` or `1985-04` or `1985-04-12`)

Modifiers (add as suffix):

+ `?`: uncertain (possibly the given date, but not definitely)
+ `~`: approximate
+ `%`: "uncertain" as well as "approximate"

Example: `1977-05~`

### Date and Time

`[date]THH:MM:SS` (eg.: `1985-04-12T23:20:30`)

### Intervals

`[date]/[date]` (eg.: `2004-02-01/2005-02`)

`1985-04-12/`: null-string for unknown start or end date
(`1985-04-12/..`): double-dot (`..`) for unspecified start or end date

### EDTF Specification

<https://www.loc.gov/standards/datetime/>
