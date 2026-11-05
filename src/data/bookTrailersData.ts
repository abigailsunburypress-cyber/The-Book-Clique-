import crenshawThumb from '../assets/images/crenshaw_trailer_frame_1793352673047.jpg';
import vacancyThumb from '../assets/images/vacancy_trailer_frame_1793352689262.jpg';
import girlsThumb from '../assets/images/girls_storm_shadow_frame_1793352708260.jpg';

export interface TrailerScene {
  time: string;
  title: string;
  description: string;
  narrationSnippet?: string;
}

export interface BookTrailerWork {
  id: string;
  title: string;
  author: string;
  authorAccolade: string;
  publisher: string;
  clientBadge: string;
  genre: string;
  durationSeconds: number;
  durationFormatted: string;
  aspectRatio: string;
  formatDescription: string;
  thumbnail: string;
  videoSrc: string;
  youtubeId?: string;
  embedUrl?: string;
  watchUrl?: string;
  tagline: string;
  synopsis: string;
  productionDeliverables: string[];
  clientReview: {
    quote: string;
    reviewer: string;
    affiliation: string;
  };
  keyScenes: TrailerScene[];
  fullTranscript: {
    time: string;
    speaker: string;
    text: string;
  }[];
}

export const FEATURED_BOOK_TRAILERS: BookTrailerWork[] = [
  {
    id: 'trailer-crenshaw',
    title: 'Crenshaw',
    author: 'Katherine Applegate',
    authorAccolade: 'Newbery Medal-Winning Author of The One and Only Ivan',
    publisher: 'Feiwel & Friends / Macmillan Children’s Publishing Group',
    clientBadge: 'Macmillan Children’s',
    genre: 'Children’s Fiction & Magic Realism',
    durationSeconds: 98,
    durationFormatted: '1:38',
    aspectRatio: '16:9 Widescreen HD',
    formatDescription: '2D Narrative Character Animation & Kinetic Typography',
    thumbnail: crenshawThumb,
    videoSrc: '/assets/aistudio/Crenshaw_by_Katherine_Applegate_226a70c5.mp4',
    youtubeId: 'tmYB-TZvxxg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/tmYB-TZvxxg',
    watchUrl: 'https://www.youtube.com/watch?v=tmYB-TZvxxg',
    tagline: '“Facts are so much better than stories… or are they?”',
    synopsis:
      'A 5th-grade boy named Jackson believes in cold, measurable scientific facts. But when his family faces difficult times, his oversized, surf-loving imaginary friend Crenshaw returns—taking a bubble bath in his family’s tub and teaching Jackson about courage, empathy, and the magic of stories.',
    productionDeliverables: [
      'Original character silhouette & whimsical environment animations',
      'Dynamic kinetic typography synchronized with child voiceover track',
      'Licensed ambient piano soundtrack & realistic sound design effects',
      '16:9 widescreen master & 9:16 vertical social cutdowns for TikTok & Reels'
    ],
    clientReview: {
      quote:
        'The Book Clique’s animation and kinetic typography captured the delicate balance between Jackson’s scientific curiosity and Crenshaw’s warm, whimsical presence with breathtaking emotional honesty.',
      reviewer: 'Editorial Marketing Team',
      affiliation: 'Feiwel & Friends / Macmillan'
    },
    keyScenes: [
      {
        time: '0:03',
        title: 'Jackson’s Introduction',
        description: 'Silhouette of 5th grader Jackson entering his bedroom with delicate serif typography.',
        narrationSnippet: '“Hi, my name is Jackson. This fall I’m going into the 5th grade, and when I grow up I want to be an animal scientist.”'
      },
      {
        time: '0:15',
        title: 'Cheetah & Cockroach Facts',
        description: 'High-speed cheetah silhouette sprint and fun scientific fact sequences.',
        narrationSnippet: '“A cheetah can run seventy miles an hour. A headless cockroach can survive for two weeks. And when a horned toad gets mad, it shoots blood from its eyes!”'
      },
      {
        time: '0:28',
        title: 'Moon Cheese & Cold Facts',
        description: 'Visual metaphor measuring the moon with 68% Cheddar, 22% Swiss, and 14% Gouda.',
        narrationSnippet: '“I don’t know about you, but I think facts are so much better than stories. You can’t see a story, you can’t hold it in your hand and measure it.”'
      },
      {
        time: '0:43',
        title: 'Rule #1 for Scientists',
        description: 'Sunset umbrella scene introducing the central mystery.',
        narrationSnippet: '“Rule #1 for scientists is this: there is always a logical explanation for things. Like why these purple jellybeans appeared out of thin air…”'
      },
      {
        time: '1:18',
        title: 'Crenshaw’s Bubble Bath',
        description: 'The unforgettable reveal of giant cat Crenshaw soaking peacefully in the family tub.',
        narrationSnippet: '“Most importantly, there must be a logical explanation for why the imaginary friend I invented years ago is now taking a bubble bath in our tub!”'
      },
      {
        time: '1:25',
        title: 'Book Cover & Imprint Reveal',
        description: 'Full cover reveal with Feiwel & Friends / Macmillan Children’s Publishing Group imprint mark.',
        narrationSnippet: '“Crenshaw by Katherine Applegate. For more information, go to crenshawthebook.com.”'
      }
    ],
    fullTranscript: [
      { time: '0:03', speaker: 'Jackson', text: 'Hi, my name is Jackson. This fall I’m going into the 5th grade.' },
      { time: '0:08', speaker: 'Jackson', text: 'And when I grow up, I want to be an animal scientist. Here are some fun facts about animals:' },
      { time: '0:15', speaker: 'Jackson', text: 'A cheetah can run seventy miles an hour.' },
      { time: '0:17', speaker: 'Jackson', text: 'A headless cockroach can survive for two weeks.' },
      { time: '0:21', speaker: 'Jackson', text: 'And when a horned toad gets mad, it shoots blood from its eyes!' },
      { time: '0:27', speaker: 'Jackson', text: 'I don’t know about you, but I think facts are so much better than stories.' },
      { time: '0:31', speaker: 'Jackson', text: 'You can’t see a story. You can’t hold it in your hand and measure it. Stories are lies when you get right down to it, and I don’t like to be lied to.' },
      { time: '0:42', speaker: 'Jackson', text: 'Rule #1 for scientists is this: There is always a logical explanation for things.' },
      { time: '0:50', speaker: 'Jackson', text: 'Like why these purple jellybeans appeared out of thin air when we hardly ever have enough food in the house… or where this silly umbrella came from.' },
      { time: '1:05', speaker: 'Jackson', text: 'Or why parents think you don’t notice them fighting when the bills come.' },
      { time: '1:10', speaker: 'Jackson', text: 'But most importantly, there must be a logical explanation for why the imaginary friend I invented years ago… is now taking a bubble bath in our tub!' },
      { time: '1:23', speaker: 'Narrator', text: 'Crenshaw by Katherine Applegate, Newbery Medal-winning author of The One and Only Ivan.' }
    ]
  },
  {
    id: 'trailer-vacancy',
    title: 'Vacancy',
    author: 'K.R. Alexander',
    authorAccolade: 'Bestselling Author of The Collector',
    publisher: 'Scholastic',
    clientBadge: 'Scholastic',
    genre: 'YA & Middle Grade Horror / Supernatural Mystery',
    durationSeconds: 43,
    durationFormatted: '0:43',
    aspectRatio: '16:9 Widescreen',
    formatDescription: 'Cinematic Live-Action Location Grading & Spooky Motion Graphics',
    thumbnail: vacancyThumb,
    videoSrc: '/assets/aistudio/Vacancy___Official_Book_Trailer_33627e6a.mp4',
    youtubeId: 'XRP0qZOvjzs',
    embedUrl: 'https://www.youtube-nocookie.com/embed/XRP0qZOvjzs',
    watchUrl: 'https://www.youtube.com/watch?v=XRP0qZOvjzs',
    tagline: '“Not every guest can check out of this spooky hotel…”',
    synopsis:
      'The historic Carlisle Hotel has stood dark and boarded up since hundreds died under unexplained circumstances. Once a year, brave kids sneak inside on an annual dare—only to discover that the sinister forces lurking behind Room 311 never intend to let them check out.',
    productionDeliverables: [
      'Atmospheric color grading with distressed vintage archival film overlays',
      'Creepy ambient spatial sound design, ticking clocks, door creaks, and sudden jump-stings',
      'Custom 3D neon motel marquee title animation',
      'Broadcast-ready teaser package optimized for Scholastic digital channels'
    ],
    clientReview: {
      quote:
        'The Book Clique crafted a spine-tingling trailer that generated immediate pre-order momentum and record click-through rates across our middle-grade thriller promotions.',
      reviewer: 'Children’s Marketing Lead',
      affiliation: 'Scholastic Book Clubs'
    },
    keyScenes: [
      {
        time: '0:02',
        title: 'Carlisle Hotel Ruins',
        description: 'Ominous storm clouds roll over the shuttered historic hotel exterior.',
        narrationSnippet: '“The Carlisle Hotel. A long time ago, a lot of people died there under mysterious circumstances.”'
      },
      {
        time: '0:08',
        title: 'Newspaper Archive Flash',
        description: 'Vintage newspaper headline: “Dark night at Carlisle — Hundreds die, cause of death unknown.”',
        narrationSnippet: '“No one knows what happened for sure. Since then, the hotel has been closed.”'
      },
      {
        time: '0:18',
        title: 'The Annual Dare',
        description: 'Teenagers slipping through the locked doorway with trembling flashlights.',
        narrationSnippet: '“But once a year, kids sneak inside on a dare. Kids like me and my friends.”'
      },
      {
        time: '0:24',
        title: 'Room 311 & Antique Cobwebs',
        description: 'Haunting antique porcelain doll and spider webs in the abandoned suite.',
        narrationSnippet: '“They say the ghosts will try to keep you from leaving.”'
      },
      {
        time: '0:35',
        title: 'Mirror Shock & Title Reveal',
        description: 'Chilling reflection scream followed by glowing neon red VACANCY marquee sign.',
        narrationSnippet: '“Not every guest can check out of this spooky hotel… Vacancy by K.R. Alexander. Scholastic.”'
      }
    ],
    fullTranscript: [
      { time: '0:02', speaker: 'Narrator', text: 'The Carlisle Hotel. A long time ago, a lot of people died there under mysterious circumstances.' },
      { time: '0:11', speaker: 'Narrator', text: 'No one knows what happened for sure. Since then, the hotel has been closed.' },
      { time: '0:18', speaker: 'Narrator', text: 'But once a year, kids sneak inside on a dare. Kids like me and my friends.' },
      { time: '0:24', speaker: 'Narrator', text: 'They say the ghosts will try to keep you from leaving.' },
      { time: '0:28', speaker: 'Narrator', text: 'And if you can’t escape by morning, you’ll be trapped there… forever.' },
      { time: '0:33', speaker: 'Narrator', text: 'But that can’t be true… can it?' },
      { time: '0:39', speaker: 'Voiceover', text: 'Not every guest can check out of this spooky hotel… Vacancy by K.R. Alexander, author of The Collector. Scholastic.' }
    ]
  },
  {
    id: 'trailer-girls-storm-shadow',
    title: 'Girls of Storm and Shadow',
    author: 'Natasha Ngan',
    authorAccolade: 'New York Times Bestselling Author of Girls of Paper and Fire',
    publisher: 'James Patterson Presents / Little, Brown Books for Young Readers',
    clientBadge: 'James Patterson Presents',
    genre: 'Young Adult Epic Fantasy & Action Romance',
    durationSeconds: 80,
    durationFormatted: '1:20',
    aspectRatio: '2.39:1 CinemaScope',
    formatDescription: 'Epic Illustrated Graphic Motion, Dramatic Voice Acting & Orchestral Trailer',
    thumbnail: girlsThumb,
    videoSrc: '/assets/aistudio/Girls_of_Storm_and_Shadow_Book_Trailer_082dbbdb.mp4',
    youtubeId: 'LxlP_NarFeM',
    embedUrl: 'https://www.youtube-nocookie.com/embed/LxlP_NarFeM',
    watchUrl: 'https://www.youtube.com/watch?v=LxlP_NarFeM',
    tagline: '“Our love is strong enough to extinguish this evil forever.”',
    synopsis:
      'Seven years after her mother was stolen away, Lei—the girl with the golden eyes—is captured and brought to the tyrannical Bull King’s hidden palace. When she meets Wren, their deep bond sparks a fierce rebellion across kingdoms to unite rebel warrior clans against an encroaching dark magic.',
    productionDeliverables: [
      'High-impact graphic motion animation based on fantasy cover art and stylized battle scenes',
      'Sweeping cinematic orchestral score featuring traditional Asian woodwinds and thunderous percussion',
      'Professional dramatic character voiceover narration embodying Lei’s resolute journey',
      'Full flagship promotional package formatted for cinema pre-rolls and author tour announcements'
    ],
    clientReview: {
      quote:
        'An absolute triumph. The trailer brought Natasha Ngan’s lush, dangerous world to life with pulse-pounding intensity and reverence for the story’s romantic heart.',
      reviewer: 'Creative Director',
      affiliation: 'Little, Brown Books for Young Readers'
    },
    keyScenes: [
      {
        time: '0:05',
        title: 'The Prophecy Scroll',
        description: 'Two ceremonial robes unfold an ancient parchment scroll with an ornate royal dagger.',
        narrationSnippet: '“It began with the sound of horns, and then hooves… Seven years after he kidnapped my mother, the evil Bull King came for me.”'
      },
      {
        time: '0:12',
        title: 'The Girl with the Golden Eyes',
        description: 'Lei’s radiant golden gaze shines amidst red smoke as the demon warlord’s army approaches.',
        narrationSnippet: '“The girl with the golden eyes he had heard rumored throughout the kingdoms. I was chained in the hidden palace…”'
      },
      {
        time: '0:22',
        title: 'Meeting Wren & Dungeon Rescue',
        description: 'Wren slips into the palace dungeon to free Lei, igniting a powerful shared devotion.',
        narrationSnippet: '“There, I met Wren, who would change my life forever. She took care of me. We grew closer, and our love grew stronger.”'
      },
      {
        time: '0:41',
        title: 'Battle Against the Bull King',
        description: 'A furious sword strike brings down the demonic titan in a spray of animated sparks.',
        narrationSnippet: '“Together, we were triumphant. We defeated the Bull King. But our freedom has come at a terrible cost.”'
      },
      {
        time: '0:56',
        title: 'Uniting the Rebel Clans',
        description: 'Silhouette warriors stand unified under the crimson banner to confront the darkness.',
        narrationSnippet: '“Our only hope is to unite the kingdoms’ rebel clans. If we fail, dark magic will surely devour us all.”'
      },
      {
        time: '1:14',
        title: 'Lightning & Title Reveal',
        description: 'Thunderous lightning strikes illuminate the ornate fantasy book jacket with “On Sale Now!”.',
        narrationSnippet: '“Girls of Storm and Shadow by Natasha Ngan. James Patterson Presents. On sale now!”'
      }
    ],
    fullTranscript: [
      { time: '0:05', speaker: 'Lei', text: 'It began with the sound of horns, and then hooves…' },
      { time: '0:09', speaker: 'Lei', text: 'Seven years after he kidnapped my mother, the evil Bull King came for me.' },
      { time: '0:13', speaker: 'Lei', text: 'The girl with the golden eyes he had heard rumored throughout the kingdoms.' },
      { time: '0:17', speaker: 'Lei', text: 'I was chained in the hidden palace along with the King’s other paper girl concubines.' },
      { time: '0:21', speaker: 'Lei', text: 'There, I met Wren, who would change my life forever.' },
      { time: '0:25', speaker: 'Lei', text: 'The palace guards imprisoned me in the dungeon, but she came for me. She took care of me.' },
      { time: '0:30', speaker: 'Lei', text: 'We grew closer, and our love grew stronger. But our enemies would soon learn of us.' },
      { time: '0:35', speaker: 'Lei', text: 'The King’s wrath knew no limits. He burned our villages, slaughtered our families, and now he wanted us dead as well.' },
      { time: '0:41', speaker: 'Lei', text: 'But together, we were triumphant. We defeated the Bull King!' },
      { time: '0:45', speaker: 'Lei', text: 'Now Wren and I have escaped the hidden palace, but our freedom has come at a terrible cost.' },
      { time: '0:50', speaker: 'Lei', text: 'Evil ones lurk behind each corner, seeking to avenge their demon lord.' },
      { time: '0:54', speaker: 'Lei', text: 'Our only hope for eliminating the enemy forces is to unite the kingdoms’ rebel clans against them.' },
      { time: '1:00', speaker: 'Lei', text: 'If we fail, dark magic will surely devour us, and all the land.' },
      { time: '1:05', speaker: 'Lei', text: 'Our chances are slim. But our love? I believe our love is strong enough to extinguish this evil… forever.' },
      { time: '1:15', speaker: 'Voiceover', text: 'Girls of Storm and Shadow by Natasha Ngan. James Patterson Presents. On Sale Now!' }
    ]
  }
];
