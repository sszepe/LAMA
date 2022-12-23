const fs = require("fs");
const _ = require("lodash");

const groupByElementRelation = (annots) =>
  Object.entries(
    _.groupBy(
      _.sortBy(
        annots,
        ["timecodeStart", "timecodeEnd", "created"],
        ["asc", "asc", "asc"]
      ),
      (a) => a.element || "Clip"
    )
  ).reduce(
    (acc, [elementId, annots]) => ({
      ...acc,
      [elementId]: _.groupBy(annots, "relation"),
    }),
    {}
  );

const clip = JSON.parse(fs.readFileSync("./clip.json", "utf-8"));
// const elements = Object.values(clip.clipElements);
const segments = Object.values(clip.clipSegments);
const annotations = Object.values(clip.clipAnnotations);
// const byElementType = _.groupBy(elements, "type");
const groupedClip = groupByElementRelation(annotations);
process.stdout.write(JSON.stringify(groupedClip, null, 2));

// const forSegments = segments.map((s) => {
//   const sAnnots = s.segmentContains.map(
//     (sc) => clip.clipAnnotations[sc.annotation]
//   );
//   return groupByElementRelation(sAnnots);
// });
// process.stdout.write(JSON.stringify(forSegments, null, 2));
