/**
 * Render functions and field-mappings thereof.
 */
import React, { FC } from 'react';

import { Chip } from './components/Chip';
import { ExternalLink } from './components/ExternalLink';
import { Timecodes as TimecodesComponent } from './components/Timecodes';

import { secondsToString } from './util';

import { Annotation } from './types/clips';
import { Relation } from './types/relations';
import { Typography } from '@material-ui/core';

export type AorV = 'a' | 'v';
type BasicRenderer<T> = FC<{ value: T }>;
type AnyBasicRenderer = BasicRenderer<any>;
type AnnotRenderer = FC<{ value: Annotation }>;

const multi = (
  RenderComponent: BasicRenderer<string>,
): BasicRenderer<string[]> => {
  return function Multi(props: { value: string[] }) {
    const values = props.value;
    return (
      <>
        {values.map((v, i) => (
          <RenderComponent key={i} value={v} />
        ))}
      </>
    );
  };
};

const Literally: BasicRenderer<string> = ({ value }) => <>{value}</>;
// const Link: BasicRenderer = ({ value }) => <>{value as string}</>; // implement
const Link: BasicRenderer<string> = ({ value }) => (
  <>{<ExternalLink href={value}>{value}</ExternalLink>}</>
);
const AudioVideo: BasicRenderer<AorV> = ({ value }) => (
  <>{value === 'a' ? 'Audio' : 'Video'}</>
);
const Timecode: BasicRenderer<number> = ({ value }) => (
  <>{secondsToString(value)}</>
);
const Timecodes: BasicRenderer<Array<[number, number]>> = ({ value }) => (
  <TimecodesComponent timecodes={value} />
);
const SimpleChip: BasicRenderer<string> = ({ value }) => (
  <Chip entityId={value} />
);

const AnnotDate: AnnotRenderer = ({ value }) => {
  const a = value as Annotation;
  return (
    <>
      <Typography style={{ fontSize: '0.8rem' }}>
        <code>{a.date}</code>
      </Typography>
      {a.target && (
        <>
          &#160;&#160;
          <Chip entityId={a.target} />
        </>
      )}
    </>
  );
};

const AnnotQuote: AnnotRenderer = ({ value }) => {
  const a = value as Annotation;
  return (
    <>
      <Typography style={{ fontSize: '0.8rem' }}>{a.quotes}</Typography>
      {a.target && (
        <>
          &#160;&#160;
          <Chip entityId={a.target} />
        </>
      )}
    </>
  );
};

const AnnotChip: AnnotRenderer = ({ value }) => {
  const annot = value as Annotation;
  return <Chip entityId={annot.target} />;
};

const AnnotChipRole: AnnotRenderer = ({ value }) => {
  const a = value as Annotation;
  return (
    <>
      <Chip entityId={a.target} />
      {a.role && <Chip entityId={a.role} />}
    </>
  );
};

export type BasicField =
  | 'title'
  | 'subtitle'
  | 'label'
  | 'url'
  | 'platform'
  | 'collections'
  | 'shelfmark'
  | 'fileType'
  | 'duration'
  | 'language'
  | 'clipType'
  | 'description'
  | 'timecodes'
  | 'timecodeStart'
  | 'timecodeEnd'
  | 'annotationCount';

export const basicLabels: Record<BasicField, string> = {
  title: 'Title',
  subtitle: 'Subtitle',
  label: 'Label',
  url: 'URL',
  platform: 'Platform',
  collections: 'Collections',
  shelfmark: 'Shelfmark',
  fileType: 'File type',
  duration: 'Duration',
  language: 'Language',
  clipType: 'Clip type',
  description: 'Description',
  timecodes: 'Timecodes',
  timecodeStart: 'Start',
  timecodeEnd: 'End',
  annotationCount: 'Annotations',
};

export const basicRenderers: Record<BasicField, AnyBasicRenderer> = {
  title: Literally,
  subtitle: Literally,
  label: Literally,
  url: Link,
  platform: SimpleChip,
  collections: multi(SimpleChip),
  shelfmark: Literally,
  fileType: AudioVideo,
  duration: Timecode,
  language: multi(SimpleChip),
  clipType: multi(SimpleChip),
  description: Literally,
  timecodes: Timecodes,
  timecodeStart: Timecode,
  timecodeEnd: Timecode,
  annotationCount: Literally,
};

export const annotRenderers: Record<Relation, AnnotRenderer> = {
  RBroadcastDate: AnnotDate,
  RBroadcastSeries: AnnotChip,
  RContributor: AnnotChipRole,
  RDateOfCreation: AnnotDate,
  RInstrument: AnnotChip,
  RKeyword: AnnotChip,
  RLyricsQuote: AnnotQuote,
  RMentions: AnnotChip,
  RMusicalQuote: AnnotChip,
  RPerformanceDate: AnnotDate,
  RPerformer: AnnotChipRole,
  RPieceOfMusic: AnnotChip,
  RProductionTechniquePicture: AnnotChip,
  RProductionTechniqueSound: AnnotChip,
  RQuote: AnnotQuote,
  RRecordingDate: AnnotDate,
  RReminiscentOfMusic: AnnotChip,
  RReminiscentOfNoise: AnnotChip,
  RReminiscentOfPicture: AnnotChip,
  RReminiscentOfSpeech: AnnotChip,
  RTextQuote: AnnotQuote,
  RShot: AnnotChip,
  RShows: AnnotChip,
  RSoundAdjective: AnnotChip,
  RSoundsLike: AnnotChip,
  RSoundsLikeNoise: AnnotChip,
  RSpeaker: AnnotChip,
  RSpeechDescriptionText: AnnotChip,
};
