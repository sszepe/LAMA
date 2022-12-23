// generated 2021-11-15T11:51:25.412795... don't make changes here! :)

export type Element =
  | 'Clip'
  | 'Segment'
  | 'Music'
  | 'Speech'
  | 'Noise'
  | 'Picture';

export type Relation =
  | 'RBroadcastDate'
  | 'RBroadcastSeries'
  | 'RContributor'
  | 'RDateOfCreation'
  | 'RInstrument'
  | 'RKeyword'
  | 'RLyricsQuote'
  | 'RTextQuote'
  | 'RMentions'
  | 'RMusicalQuote'
  | 'RPerformanceDate'
  | 'RPerformer'
  | 'RPieceOfMusic'
  | 'RProductionTechniquePicture'
  | 'RProductionTechniqueSound'
  | 'RQuote'
  | 'RRecordingDate'
  | 'RReminiscentOfMusic'
  | 'RReminiscentOfNoise'
  | 'RReminiscentOfPicture'
  | 'RReminiscentOfSpeech'
  | 'RShot'
  | 'RShows'
  | 'RSoundAdjective'
  | 'RSoundsLike'
  | 'RSoundsLikeNoise'
  | 'RSpeaker'
  | 'RSpeechDescriptionText';

export type AnnotationField =
  | 'attribution'
  | 'comment'
  | 'confidence'
  | 'date'
  | 'metaDate'
  | 'quotes'
  | 'role'
  | 'target'
  | 'timecodeEnd'
  | 'timecodeStart';

export const allClipRelations = [
  'RBroadcastDate',
  'RBroadcastSeries',
  'RContributor',
  'RDateOfCreation',
  'RKeyword',
  'RQuote',
];

export const allMusicRelations = [
  'RInstrument',
  'RKeyword',
  'RLyricsQuote',
  'RMusicalQuote',
  'RPerformanceDate',
  'RPerformer',
  'RPieceOfMusic',
  'RProductionTechniqueSound',
  'RRecordingDate',
  'RReminiscentOfMusic',
  'RSoundAdjective',
  'RSoundsLike',
];

export const allSpeechRelations = [
  'RKeyword',
  'RMentions',
  'RProductionTechniqueSound',
  'RQuote',
  'RRecordingDate',
  'RReminiscentOfSpeech',
  'RSoundAdjective',
  'RSpeaker',
  'RSpeechDescriptionText',
];

export const allNoiseRelations = [
  'RProductionTechniqueSound',
  'RRecordingDate',
  'RReminiscentOfNoise',
  'RSoundAdjective',
  'RSoundsLikeNoise',
  'RKeyword',
];

export const allPictureRelations = [
  'RKeyword',
  'RProductionTechniquePicture',
  'RRecordingDate',
  'RReminiscentOfPicture',
  'RShot',
  'RShows',
  'RTextQuote',
];

export type ClipRelation =
  | 'RBroadcastDate'
  | 'RBroadcastSeries'
  | 'RContributor'
  | 'RDateOfCreation'
  | 'RKeyword'
  | 'RQuote';

export type MusicRelation =
  | 'RInstrument'
  | 'RKeyword'
  | 'RLyricsQuote'
  | 'RMusicalQuote'
  | 'RPerformanceDate'
  | 'RPerformer'
  | 'RPieceOfMusic'
  | 'RProductionTechniqueSound'
  | 'RRecordingDate'
  | 'RReminiscentOfMusic'
  | 'RSoundAdjective'
  | 'RSoundsLike';

export type SpeechRelation =
  | 'RKeyword'
  | 'RMentions'
  | 'RProductionTechniqueSound'
  | 'RQuote'
  | 'RRecordingDate'
  | 'RReminiscentOfSpeech'
  | 'RSoundAdjective'
  | 'RSpeaker'
  | 'RSpeechDescriptionText';

export type NoiseRelation =
  | 'RProductionTechniqueSound'
  | 'RRecordingDate'
  | 'RReminiscentOfNoise'
  | 'RSoundAdjective'
  | 'RSoundsLikeNoise'
  | 'RKeyword';

export type PictureRelation =
  | 'RKeyword'
  | 'RProductionTechniquePicture'
  | 'RRecordingDate'
  | 'RReminiscentOfPicture'
  | 'RShot'
  | 'RShows'
  | 'RTextQuote';

export const supportedRelations = {
  Clip: [
    'RBroadcastDate',
    'RBroadcastSeries',
    'RContributor',
    'RDateOfCreation',
    'RKeyword',
    'RQuote',
  ],
  Segment: [],
  Music: [
    'RInstrument',
    'RKeyword',
    'RLyricsQuote',
    'RMusicalQuote',
    'RPerformanceDate',
    'RPerformer',
    'RPieceOfMusic',
    'RProductionTechniqueSound',
    'RRecordingDate',
    'RReminiscentOfMusic',
    'RSoundAdjective',
    'RSoundsLike',
  ],
  Speech: [
    'RKeyword',
    'RMentions',
    'RProductionTechniqueSound',
    'RQuote',
    'RRecordingDate',
    'RReminiscentOfSpeech',
    'RSoundAdjective',
    'RSpeaker',
    'RSpeechDescriptionText',
  ],
  Noise: [
    'RProductionTechniqueSound',
    'RRecordingDate',
    'RReminiscentOfNoise',
    'RSoundAdjective',
    'RSoundsLikeNoise',
    'RKeyword',
  ],
  Picture: [
    'RKeyword',
    'RProductionTechniquePicture',
    'RRecordingDate',
    'RReminiscentOfPicture',
    'RShot',
    'RShows',
    'RTextQuote',
  ],
};

export const connectionRelationInfo = {
  RBroadcastDate: {
    label: 'Broadcast date',
    definition: 'Date of public broadcast.',
    multi: true,
    types: ['Station'],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'date', 'target'],
    required: ['date'],
  },
  RBroadcastSeries: {
    label: 'Broadcast series',
    definition: 'The series material in the clips belongs to.',
    multi: false,
    types: ['BroadcastSeries'],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'target'],
    required: ['target'],
  },
  RContributor: {
    label: 'Contributor',
    definition: 'An agent who is (or should be) mentioned in the credits.',
    multi: true,
    types: ['Person', 'Group', 'Organization', 'Broadcaster'],
    roles: ['VClipContributorRole'],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
      'role',
    ],
    required: ['role', 'target'],
  },
  RDateOfCreation: {
    label: 'Date of Creation',
    definition:
      'The date or time period the primary contents of the clip were created.',
    multi: false,
    types: [],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'date'],
    required: ['date'],
  },
  RRecordingDate: {
    label: 'Recording date',
    definition: 'The date or time period the material was recorded.',
    multi: false,
    types: [],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'date'],
    required: ['date'],
  },
  RQuote: {
    label: 'Quote',
    definition: 'A verbatim quote appearing in the clip.',
    multi: true,
    types: ['Person', 'FictionalCharacter'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
      'quotes',
    ],
    required: ['quotes'],
  },
  RTextQuote: {
    label: 'Quote',
    definition: 'A text shown in the Picture of a clip.',
    multi: true,
    types: ['Person', 'FictionalCharacter'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
      'quotes',
    ],
    required: ['quotes'],
  },
  RLyricsQuote: {
    label: 'Lyrics',
    definition:
      'The lyrics in a Music (the text someone is singing for example).',
    multi: true,
    types: ['Person', 'FictionalCharacter'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
      'quotes',
    ],
    required: ['quotes'],
  },
  RMusicalQuote: {
    label: 'Musical quote',
    definition: 'A piece of music that is being quoted musically.',
    multi: true,
    types: ['PieceOfMusic'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RInstrument: {
    label: 'Has Instrument',
    definition: 'The musical instrument whose sound can be heard.',
    multi: true,
    types: ['Thing', 'VInstrument'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RKeyword: {
    label: 'Keyword',
    definition: 'Anything appearing in the clip that seems noteworthy.',
    multi: true,
    types: [
      'BroadcastSeries',
      'Broadcaster',
      'CollectiveIdentity',
      'CreativeWork',
      'Event',
      'EventSeries',
      'FictionalCharacter',
      'Genre',
      'Group',
      'LieuDeMemoire',
      'Location',
      'Movement',
      'Organization',
      'Person',
      'PieceOfMusic',
      'Place',
      'Repertoire',
      'Thing',
      'TimePeriod',
      'Topic',
      'Topos',
      'VActivity',
      'VInstrument',
      'VLanguage',
      'VMusicArts',
    ],
    roles: ['VFunctionInClipRole'],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
      'role',
    ],
    required: ['target'],
  },
  RMentions: {
    label: 'Mentions',
    definition: 'Something or someone mentioned in the Speech.',
    multi: true,
    types: [
      'BroadcastSeries',
      'Broadcaster',
      'CollectiveIdentity',
      'CreativeWork',
      'Event',
      'EventSeries',
      'FictionalCharacter',
      'Genre',
      'Group',
      'LieuDeMemoire',
      'Location',
      'Movement',
      'Organization',
      'Person',
      'PieceOfMusic',
      'Place',
      'Repertoire',
      'Thing',
      'TimePeriod',
      'Topic',
      'Topos',
      'VActivity',
      'VInstrument',
      'VLanguage',
      'VMusicArts',
      'ProductionTechniquePicture',
      'ProductionTechniqueSound',
    ],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RShows: {
    label: 'Shows',
    definition: 'Someone or something shown in the Picture.',
    multi: true,
    types: [
      'CollectiveIdentity',
      'CreativeWork',
      'Event',
      'FictionalCharacter',
      'Group',
      'LieuDeMemoire',
      'Location',
      'Organization',
      'Person',
      'Place',
      'Thing',
      'Topos',
      'VActivity',
      'VInstrument',
    ],
    roles: ['VFunctionInClipRole'],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RPieceOfMusic: {
    label: 'Is Piece of Music',
    definition: 'The piece of music this Music has been identified as.',
    multi: false,
    types: ['PieceOfMusic'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RSoundsLike: {
    label: 'Sounds like (music)',
    definition:
      '(Other) music that this Music or section is sharing characteristics with.',
    multi: true,
    types: ['PieceOfMusic', 'Genre', 'Repertoire'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RReminiscentOfMusic: {
    label: 'Reminiscent of (Music)',
    definition:
      'Something (usually) extra-musical that can be associated with the Music.',
    multi: true,
    types: ['Thing', 'AnySound'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RPerformer: {
    label: 'Performer',
    definition: 'An agent participating in a musical performance.',
    multi: true,
    types: ['Person', 'Group', 'FictionalCharacter'],
    roles: ['VMusicPerformanceRole'],
    allowed: ['attribution', 'comment', 'confidence', 'target', 'role'],
    required: ['role', 'target'],
  },
  RPerformanceDate: {
    label: 'Performance date',
    definition: 'The date of a musical performance.',
    multi: false,
    types: [],
    roles: [],
    allowed: ['attribution', 'comment', 'confidence', 'date'],
    required: ['date'],
  },
  RSpeaker: {
    label: 'Speaker',
    definition: 'The person that is speaking.',
    multi: false,
    types: ['Person', 'FictionalCharacter'],
    roles: ['VClipContributorRole', 'VFunctionInClipRole'],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RSpeechDescriptionText: {
    label: 'Speech description',
    definition: 'Description of how somebody is speaking.',
    multi: true,
    types: ['VActivity', 'VAdjective', 'VLanguage', 'VSpeechGenre'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RReminiscentOfSpeech: {
    label: 'Reminiscent of (Speech)',
    definition:
      "Something the Speech can be associated with, but isn't actually.",
    multi: true,
    types: [
      'AnySound',
      'Person',
      'FictionalCharacter',
      'Thing',
      'VActivity',
      'VLanguage',
      'VSpeechGenre',
    ],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RReminiscentOfNoise: {
    label: 'Reminiscent of (Other Sounds)',
    definition:
      "Something the sound can be associated with, but most likely isn't.",
    multi: true,
    types: ['AnySound', 'Thing', 'VActivity'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RSoundsLikeNoise: {
    label: 'Sounds like',
    definition: 'Best description (or guess) of what a sound actually is.',
    multi: true,
    types: ['AnySound', 'Thing', 'VActivity', 'VAdjective'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RShot: {
    label: 'Camera shot',
    definition: 'The camera technique used.',
    multi: true,
    types: ['Shot'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RReminiscentOfPicture: {
    label: 'Reminiscent of (Picture)',
    definition:
      "Something the Picture can be associated with, but most likely isn't.",
    multi: true,
    types: [
      'Broadcaster',
      'BroadcastSeries',
      'CreativeWork',
      'Station',
      'Thing',
      'Topic',
      'VActivity',
    ],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'metaDate',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RProductionTechniquePicture: {
    label: 'Production technique (picture)',
    definition: 'A visual production technique being used.',
    multi: true,
    types: ['ProductionTechniquePicture'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RProductionTechniqueSound: {
    label: 'Production technique (sound)',
    definition: 'A auditory production technique being used.',
    multi: true,
    types: ['ProductionTechniqueSound'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
  RSoundAdjective: {
    label: 'Adjective describing sound',
    definition: 'Description of a sound.',
    multi: true,
    types: ['VAdjective', 'VMusicArts'],
    roles: [],
    allowed: [
      'attribution',
      'comment',
      'confidence',
      'target',
      'timecodeEnd',
      'timecodeStart',
    ],
    required: ['target'],
  },
};
