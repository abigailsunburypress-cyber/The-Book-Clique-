export interface BookReview {
  id: string;
  manuscriptId: string;
  readerId: string;
  readerName: string;
  readerEmail?: string;
  country: string;
  countryFlag: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export const SEED_BOOK_REVIEWS: BookReview[] = [
  // United Kingdom 🇬🇧
  {
    id: 'rev-uk-01',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-01',
    readerName: 'Eleanor Whitmore',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 5,
    comment: 'I found myself completely drawn into the story. The writing kept me interested, and I genuinely wanted to know what would happen next.',
    createdAt: '2026-10-29T10:15:00.000Z'
  },
  {
    id: 'rev-uk-02',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-02',
    readerName: 'Oliver Bennett',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 4,
    comment: 'An enjoyable read with some really memorable moments. I particularly liked how the story developed and how the characters were presented.',
    createdAt: '2026-10-29T11:30:00.000Z'
  },
  // United States 🇺🇸
  {
    id: 'rev-us-03',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-03',
    readerName: 'Madison Clarke',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 5,
    comment: 'This book captured my attention from the beginning. There were moments that made me stop and think, and I loved the overall storytelling.',
    createdAt: '2026-10-29T13:45:00.000Z'
  },
  {
    id: 'rev-us-04',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-04',
    readerName: 'Ethan Brooks',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 3,
    comment: 'I enjoyed several parts of the book, especially the character interactions. Some sections moved a little slowly for me, but I still found it interesting.',
    createdAt: '2026-10-29T14:20:00.000Z'
  },
  // Canada 🇨🇦
  {
    id: 'rev-ca-05',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-05',
    readerName: 'Charlotte Mitchell',
    country: 'Canada',
    countryFlag: '🇨🇦',
    rating: 5,
    comment: 'What a lovely reading experience. The story has an engaging quality that made it easy to keep turning the pages. I would recommend giving it a read.',
    createdAt: '2026-10-29T15:10:00.000Z'
  },
  {
    id: 'rev-ca-06',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-06',
    readerName: 'Liam Anderson',
    country: 'Canada',
    countryFlag: '🇨🇦',
    rating: 4,
    comment: 'I appreciated the way the story unfolded. It gave me plenty to think about, and I enjoyed seeing how the different moments connected.',
    createdAt: '2026-10-29T16:05:00.000Z'
  },
  // Australia 🇦🇺
  {
    id: 'rev-au-07',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-07',
    readerName: 'Isla Thompson',
    country: 'Australia',
    countryFlag: '🇦🇺',
    rating: 4,
    comment: 'Really enjoyed this one! The story held my interest, and I found myself looking forward to picking it up again each day.',
    createdAt: '2026-10-29T17:00:00.000Z'
  },
  {
    id: 'rev-au-08',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-08',
    readerName: 'Jack Harrison',
    country: 'Australia',
    countryFlag: '🇦🇺',
    rating: 5,
    comment: 'A fantastic reading experience. The storytelling felt engaging, and there were several moments that stayed with me after reading.',
    createdAt: '2026-10-29T18:25:00.000Z'
  },
  // Ireland 🇮🇪
  {
    id: 'rev-ie-09',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-09',
    readerName: 'Aoife Gallagher',
    country: 'Ireland',
    countryFlag: '🇮🇪',
    rating: 5,
    comment: 'There is something quite special about a story that makes you forget the time while reading. I found this one engaging and thought-provoking.',
    createdAt: '2026-10-29T19:40:00.000Z'
  },
  {
    id: 'rev-ie-10',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-10',
    readerName: 'Cian Murphy',
    country: 'Ireland',
    countryFlag: '🇮🇪',
    rating: 4,
    comment: 'I liked the atmosphere and the way the characters were developed. It was an enjoyable book, and I would be interested in reading more from this author.',
    createdAt: '2026-10-29T20:15:00.000Z'
  },
  // New Zealand 🇳🇿
  {
    id: 'rev-nz-11',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-11',
    readerName: 'Amelia Fletcher',
    country: 'New Zealand',
    countryFlag: '🇳🇿',
    rating: 5,
    comment: 'I became invested in the story much sooner than I expected. The writing made the reading experience enjoyable, and I loved following its progress.',
    createdAt: '2026-10-29T21:00:00.000Z'
  },
  {
    id: 'rev-nz-12',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-12',
    readerName: 'Noah Williams',
    country: 'New Zealand',
    countryFlag: '🇳🇿',
    rating: 3,
    comment: 'An interesting book with some strong moments. I had a few different expectations about where the story would go, but I enjoyed reading it.',
    createdAt: '2026-10-29T22:30:00.000Z'
  },
  // South Africa 🇿🇦
  {
    id: 'rev-za-13',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-13',
    readerName: 'Naledi Jacobs',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    rating: 5,
    comment: 'I enjoyed the experience of reading this book with the community. It gave me plenty to reflect on, and I especially appreciated the storytelling.',
    createdAt: '2026-10-30T07:15:00.000Z'
  },
  {
    id: 'rev-za-14',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-14',
    readerName: 'Daniel van der Merwe',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    rating: 4,
    comment: 'A good read with interesting ideas and memorable scenes. I enjoyed the overall experience and would be happy to discuss it with other readers.',
    createdAt: '2026-10-30T08:00:00.000Z'
  },
  // United Kingdom 🇬🇧
  {
    id: 'rev-uk-15',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-15',
    readerName: 'Harriet Collins',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 5,
    comment: "I didn't expect to become so attached to the story, but it really pulled me in. I enjoyed the author's approach and the way everything came together.",
    createdAt: '2026-10-30T09:10:00.000Z'
  },
  {
    id: 'rev-uk-16',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-16',
    readerName: 'Theodore James',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 4,
    comment: 'An engaging book with a thoughtful storyline. I particularly enjoyed the way the author kept the story moving without losing its depth.',
    createdAt: '2026-10-30T09:45:00.000Z'
  },
  {
    id: 'rev-uk-17',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-17',
    readerName: 'Phoebe Lawrence',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 3,
    comment: 'Some parts were more engaging than others, but there were interesting ideas throughout. I would be curious to hear what other readers think.',
    createdAt: '2026-10-30T10:20:00.000Z'
  },
  // United States 🇺🇸
  {
    id: 'rev-us-18',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-18',
    readerName: 'Savannah Reed',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 5,
    comment: 'I love books that give you something to think about after you finish reading. This one certainly gave me plenty to reflect on.',
    createdAt: '2026-10-30T11:00:00.000Z'
  },
  {
    id: 'rev-us-19',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-19',
    readerName: 'Caleb Foster',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 4,
    comment: 'The story was enjoyable, and I liked the overall direction. A few moments surprised me, which made the reading experience even better.',
    createdAt: '2026-10-30T11:40:00.000Z'
  },
  {
    id: 'rev-us-20',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-20',
    readerName: 'Brooklyn Hayes',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 5,
    comment: 'I found the storytelling refreshing. It was easy to get immersed in the reading, and I enjoyed discovering where each chapter would lead.',
    createdAt: '2026-10-30T12:15:00.000Z'
  },
  // Canada 🇨🇦
  {
    id: 'rev-ca-21',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-21',
    readerName: 'Evelyn Parker',
    country: 'Canada',
    countryFlag: '🇨🇦',
    rating: 4,
    comment: 'I enjoyed the atmosphere of this book. It has a lovely way of drawing you into its world, and I found the reading experience rewarding.',
    createdAt: '2026-10-30T13:00:00.000Z'
  },
  {
    id: 'rev-ca-22',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-22',
    readerName: 'Nathaniel Scott',
    country: 'Canada',
    countryFlag: '🇨🇦',
    rating: 5,
    comment: 'One of those books that makes you appreciate the time spent reading. I enjoyed the progression and found several moments particularly memorable.',
    createdAt: '2026-10-30T13:50:00.000Z'
  },
  // Australia 🇦🇺
  {
    id: 'rev-au-23',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-23',
    readerName: 'Matilda Cooper',
    country: 'Australia',
    countryFlag: '🇦🇺',
    rating: 5,
    comment: "I've really enjoyed following this story. Each reading session left me curious about what was coming next. Looking forward to discussing it with everyone.",
    createdAt: '2026-10-30T14:30:00.000Z'
  },
  {
    id: 'rev-au-24',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-24',
    readerName: 'Lachlan Price',
    country: 'Australia',
    countryFlag: '🇦🇺',
    rating: 3,
    comment: 'An interesting read overall. There were a couple of sections I would have approached differently, but I appreciated the author\'s effort.',
    createdAt: '2026-10-30T15:10:00.000Z'
  },
  // Ireland 🇮🇪
  {
    id: 'rev-ie-25',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-25',
    readerName: 'Siobhan Kelly',
    country: 'Ireland',
    countryFlag: '🇮🇪',
    rating: 4,
    comment: 'I liked the way the story developed. It had some lovely moments, and I found myself thinking about certain parts long after putting the book down.',
    createdAt: '2026-10-30T16:00:00.000Z'
  },
  {
    id: 'rev-ie-26',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-26',
    readerName: 'Ronan Fitzgerald',
    country: 'Ireland',
    countryFlag: '🇮🇪',
    rating: 5,
    comment: 'Very enjoyable storytelling. I appreciate books that hold your attention while also giving you something meaningful to consider.',
    createdAt: '2026-10-30T16:45:00.000Z'
  },
  // New Zealand 🇳🇿
  {
    id: 'rev-nz-27',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-27',
    readerName: 'Sophie Bennett',
    country: 'New Zealand',
    countryFlag: '🇳🇿',
    rating: 5,
    comment: 'This has been a wonderful addition to my reading list. I enjoyed the writing and the experience of following the story alongside other readers.',
    createdAt: '2026-10-30T17:30:00.000Z'
  },
  {
    id: 'rev-nz-28',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-28',
    readerName: 'Oliver McKenzie',
    country: 'New Zealand',
    countryFlag: '🇳🇿',
    rating: 4,
    comment: 'I found the book engaging and easy to return to. There were some particularly strong moments that made it stand out for me.',
    createdAt: '2026-10-30T18:15:00.000Z'
  },
  // South Africa 🇿🇦
  {
    id: 'rev-za-29',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-29',
    readerName: 'Thandiwe Mokoena',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    rating: 5,
    comment: 'Reading this as part of a book community makes the experience even more enjoyable. I love being able to share thoughts and discover different interpretations.',
    createdAt: '2026-10-30T19:00:00.000Z'
  },
  {
    id: 'rev-za-30',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-30',
    readerName: 'Michael Naidoo',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    rating: 4,
    comment: 'A thoughtful and enjoyable read. I especially appreciate stories that encourage readers to look beyond the surface and consider different perspectives.',
    createdAt: '2026-10-30T19:45:00.000Z'
  },
  // United Kingdom 🇬🇧
  {
    id: 'rev-uk-31',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-31',
    readerName: 'Amelia Hartley',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 5,
    comment: 'Such an enjoyable read! I loved how the story kept my curiosity alive. I was always looking forward to the next chapter.',
    createdAt: '2026-10-31T08:30:00.000Z'
  },
  {
    id: 'rev-uk-32',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-32',
    readerName: 'Sebastian Clarke',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 4,
    comment: 'The author has done a wonderful job creating an engaging reading experience. I particularly enjoyed the pacing and the way the story developed.',
    createdAt: '2026-10-31T09:15:00.000Z'
  },
  {
    id: 'rev-uk-33',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-33',
    readerName: 'Grace Montgomery',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 3,
    comment: 'I found the book interesting, although a few parts took me longer to get through. There are some lovely ideas here.',
    createdAt: '2026-10-31T10:00:00.000Z'
  },
  // United States 🇺🇸
  {
    id: 'rev-us-34',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-34',
    readerName: 'Riley Morgan',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 5,
    comment: 'I started reading out of curiosity and ended up completely invested. Definitely a book that gave me plenty to think about.',
    createdAt: '2026-10-31T11:00:00.000Z'
  },
  {
    id: 'rev-us-35',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-35',
    readerName: 'Adrian Coleman',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 4,
    comment: 'Really enjoyed the writing style. The story had enough interesting moments to keep me engaged, and I liked the author\'s approach.',
    createdAt: '2026-10-31T11:45:00.000Z'
  },
  {
    id: 'rev-us-36',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-36',
    readerName: 'Chloe Richardson',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 5,
    comment: 'I love discovering books through reading communities. This has been a lovely experience, and I enjoyed sharing the journey with other readers.',
    createdAt: '2026-10-31T12:30:00.000Z'
  },
  // Canada 🇨🇦
  {
    id: 'rev-ca-37',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-37',
    readerName: 'Abigail Turner',
    country: 'Canada',
    countryFlag: '🇨🇦',
    rating: 5,
    comment: 'Beautifully engaging from my perspective. I enjoyed the way the story unfolded and how it encouraged me to keep reading.',
    createdAt: '2026-10-31T13:15:00.000Z'
  },
  {
    id: 'rev-ca-38',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-38',
    readerName: 'Gabriel Stewart',
    country: 'Canada',
    countryFlag: '🇨🇦',
    rating: 3,
    comment: 'An interesting concept with some memorable moments. I would have liked a little more development in certain areas, but overall it was worth reading.',
    createdAt: '2026-10-31T14:00:00.000Z'
  },
  // Australia 🇦🇺
  {
    id: 'rev-au-39',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-39',
    readerName: 'Evie Patterson',
    country: 'Australia',
    countryFlag: '🇦🇺',
    rating: 4,
    comment: "Picked this up for the Book Club and I'm glad I did. It has been a pleasant reading experience, with plenty to discuss.",
    createdAt: '2026-10-31T14:45:00.000Z'
  },
  {
    id: 'rev-au-40',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-40',
    readerName: 'Hudson Bailey',
    country: 'Australia',
    countryFlag: '🇦🇺',
    rating: 5,
    comment: 'I genuinely enjoyed this book. The story kept me interested, and I found myself wanting to read just one more chapter every time.',
    createdAt: '2026-10-31T15:30:00.000Z'
  },
  // Ireland 🇮🇪
  {
    id: 'rev-ie-41',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-41',
    readerName: "Niamh O'Connor",
    country: 'Ireland',
    countryFlag: '🇮🇪',
    rating: 5,
    comment: 'An enjoyable story that gave me several moments to pause and reflect. I particularly liked the feeling of discovering something new as I read.',
    createdAt: '2026-10-31T16:15:00.000Z'
  },
  {
    id: 'rev-ie-42',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-42',
    readerName: 'Declan Walsh',
    country: 'Ireland',
    countryFlag: '🇮🇪',
    rating: 4,
    comment: "I appreciated the author's storytelling and the way the narrative developed. A solid and enjoyable read.",
    createdAt: '2026-10-31T17:00:00.000Z'
  },
  // New Zealand 🇳🇿
  {
    id: 'rev-nz-43',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-43',
    readerName: 'Ruby Anderson',
    country: 'New Zealand',
    countryFlag: '🇳🇿',
    rating: 5,
    comment: 'This was a lovely book to read as part of a community challenge. I enjoyed the discussions and hearing different interpretations of the story.',
    createdAt: '2026-10-31T17:45:00.000Z'
  },
  {
    id: 'rev-nz-44',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-44',
    readerName: 'Finn Thompson',
    country: 'New Zealand',
    countryFlag: '🇳🇿',
    rating: 4,
    comment: 'An interesting read with a good sense of progression. I would happily recommend it to readers who enjoy exploring new books.',
    createdAt: '2026-10-31T18:30:00.000Z'
  },
  // South Africa 🇿🇦
  {
    id: 'rev-za-45',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-45',
    readerName: 'Zanele Dlamini',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    rating: 5,
    comment: 'I enjoy stories that bring people together, and this reading experience has been particularly rewarding. Looking forward to more Book Club selections.',
    createdAt: '2026-10-31T19:15:00.000Z'
  },
  {
    id: 'rev-za-46',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-46',
    readerName: 'Ethan Petersen',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    rating: 3,
    comment: 'I liked several aspects of the book, especially its central ideas. Some moments worked better for me than others, but it was an interesting experience.',
    createdAt: '2026-10-31T20:00:00.000Z'
  },
  // United Kingdom 🇬🇧
  {
    id: 'rev-uk-47',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-47',
    readerName: 'Imogen Fletcher',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 5,
    comment: 'I found the story wonderfully engaging. It is always a pleasure to discover a book that makes you eager to return to reading.',
    createdAt: '2026-11-01T08:00:00.000Z'
  },
  {
    id: 'rev-uk-48',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-48',
    readerName: 'Archie Williams',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 4,
    comment: 'An enjoyable experience from beginning to end. I liked the way the author introduced the different elements of the story.',
    createdAt: '2026-11-01T08:45:00.000Z'
  },
  {
    id: 'rev-uk-49',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-49',
    readerName: 'Millie Robertson',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 5,
    comment: "I've enjoyed every reading session so far. The story has kept me curious, and being part of the Book Club makes it even better.",
    createdAt: '2026-11-01T09:30:00.000Z'
  },
  // United States 🇺🇸
  {
    id: 'rev-us-50',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-50',
    readerName: 'Harper Sullivan',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 4,
    comment: 'The book has an interesting voice and a storyline that held my attention. I especially enjoyed the moments that made me reconsider my first impressions.',
    createdAt: '2026-11-01T10:15:00.000Z'
  },
  {
    id: 'rev-us-51',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-51',
    readerName: 'Mason Everett',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 3,
    comment: "I had mixed feelings about a few sections, but there were some genuinely interesting moments. I'd enjoy hearing other readers' opinions.",
    createdAt: '2026-11-01T11:00:00.000Z'
  },
  {
    id: 'rev-us-52',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-52',
    readerName: 'Natalie Brooks',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 5,
    comment: 'This was a refreshing discovery. I appreciate the opportunity to explore books I might not have found on my own.',
    createdAt: '2026-11-01T11:45:00.000Z'
  },
  // Canada 🇨🇦
  {
    id: 'rev-ca-53',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-53',
    readerName: 'Isabelle Laurent',
    country: 'Canada',
    countryFlag: '🇨🇦',
    rating: 5,
    comment: 'An enjoyable book that made my reading time feel worthwhile. I loved having something new to look forward to with each session.',
    createdAt: '2026-11-01T12:30:00.000Z'
  },
  {
    id: 'rev-ca-54',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-54',
    readerName: 'Owen Campbell',
    country: 'Canada',
    countryFlag: '🇨🇦',
    rating: 4,
    comment: 'I found the storytelling compelling, especially as the narrative progressed. A good choice for a community reading challenge.',
    createdAt: '2026-11-01T13:15:00.000Z'
  },
  // Australia 🇦🇺
  {
    id: 'rev-au-55',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-55',
    readerName: 'Poppy Mitchell',
    country: 'Australia',
    countryFlag: '🇦🇺',
    rating: 5,
    comment: "I wasn't sure what to expect when I started, but I quickly became interested. I really enjoyed the overall reading experience.",
    createdAt: '2026-11-01T14:00:00.000Z'
  },
  {
    id: 'rev-au-56',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-56',
    readerName: 'Cooper Wallace',
    country: 'Australia',
    countryFlag: '🇦🇺',
    rating: 3,
    comment: 'Some parts captured my attention more than others. Nevertheless, I appreciate the ideas behind the story and enjoyed taking part.',
    createdAt: '2026-11-01T14:45:00.000Z'
  },
  // Ireland 🇮🇪
  {
    id: 'rev-ie-57',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-57',
    readerName: 'Eimear Brennan',
    country: 'Ireland',
    countryFlag: '🇮🇪',
    rating: 4,
    comment: "I enjoyed the atmosphere and the author's style. There were a few passages I especially liked, and I would recommend giving it a chance.",
    createdAt: '2026-11-01T15:30:00.000Z'
  },
  {
    id: 'rev-ie-58',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-58',
    readerName: 'Patrick Doyle',
    country: 'Ireland',
    countryFlag: '🇮🇪',
    rating: 5,
    comment: 'A thoroughly enjoyable read. I particularly appreciate the way a good story can create conversation among people who might otherwise never meet.',
    createdAt: '2026-11-01T16:15:00.000Z'
  },
  // New Zealand 🇳🇿
  {
    id: 'rev-nz-59',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-59',
    readerName: 'Aria Collins',
    country: 'New Zealand',
    countryFlag: '🇳🇿',
    rating: 5,
    comment: 'One of my favourite things about this challenge is discovering stories alongside other readers. This book has made that experience even more enjoyable.',
    createdAt: '2026-11-01T17:00:00.000Z'
  },
  {
    id: 'rev-nz-60',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-60',
    readerName: 'Theo Harrison',
    country: 'New Zealand',
    countryFlag: '🇳🇿',
    rating: 4,
    comment: 'I liked the direction of the story and found it easy to stay interested. It gave me plenty of reasons to keep reading.',
    createdAt: '2026-11-01T17:45:00.000Z'
  },
  // South Africa 🇿🇦
  {
    id: 'rev-za-61',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-61',
    readerName: 'Lerato Nkosi',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    rating: 5,
    comment: "Books have a wonderful way of connecting people. I've enjoyed reading this selection and seeing how differently people respond to the same story.",
    createdAt: '2026-11-01T18:30:00.000Z'
  },
  {
    id: 'rev-za-62',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-62',
    readerName: 'Matthew Botha',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    rating: 4,
    comment: 'A worthwhile read with some interesting themes. I enjoyed following the story and would be interested in joining another reading challenge.',
    createdAt: '2026-11-01T19:15:00.000Z'
  },
  // United Kingdom 🇬🇧
  {
    id: 'rev-uk-63',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-63',
    readerName: 'Florence Ashford',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 5,
    comment: 'I love the way this story draws you into its world. It has been a pleasure following the chapters and discovering the story little by little.',
    createdAt: '2026-11-02T08:15:00.000Z'
  },
  {
    id: 'rev-uk-64',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-64',
    readerName: 'Miles Thornton',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 4,
    comment: "The book has an interesting direction, and I enjoyed the author's writing style. Definitely a worthwhile addition to the reading challenge.",
    createdAt: '2026-11-02T09:00:00.000Z'
  },
  {
    id: 'rev-uk-65',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-65',
    readerName: 'Daisy Wainwright',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 3,
    comment: 'I enjoyed the central idea, although I found some parts less engaging. Still, there is plenty here to appreciate.',
    createdAt: '2026-11-02T09:45:00.000Z'
  },
  // United States 🇺🇸
  {
    id: 'rev-us-66',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-66',
    readerName: 'Kennedy James',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 5,
    comment: 'This book gave me exactly what I enjoy about reading: curiosity, reflection and a reason to keep turning the pages.',
    createdAt: '2026-11-02T10:30:00.000Z'
  },
  {
    id: 'rev-us-67',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-67',
    readerName: 'Blake Harrison',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 4,
    comment: 'I liked the way the story developed. A few moments stood out more than others, but overall I had a great reading experience.',
    createdAt: '2026-11-02T11:15:00.000Z'
  },
  {
    id: 'rev-us-68',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-68',
    readerName: 'Autumn Hayes',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 5,
    comment: "I've been looking forward to each new reading session. It is wonderful to discover a book and share the experience with a community.",
    createdAt: '2026-11-02T12:00:00.000Z'
  },
  // Canada 🇨🇦
  {
    id: 'rev-ca-69',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-69',
    readerName: 'Claire Beaumont',
    country: 'Canada',
    countryFlag: '🇨🇦',
    rating: 4,
    comment: 'A thoughtful and engaging read. I especially enjoyed having time between chapters to consider what I had just read.',
    createdAt: '2026-11-02T12:45:00.000Z'
  },
  {
    id: 'rev-ca-70',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-70',
    readerName: 'Julian Fraser',
    country: 'Canada',
    countryFlag: '🇨🇦',
    rating: 5,
    comment: 'An excellent reading experience for me. I enjoyed the storytelling and the opportunity to exchange ideas with other book lovers.',
    createdAt: '2026-11-02T13:30:00.000Z'
  },
  // Australia 🇦🇺
  {
    id: 'rev-au-71',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-71',
    readerName: 'Sienna Brooks',
    country: 'Australia',
    countryFlag: '🇦🇺',
    rating: 5,
    comment: 'I found myself becoming more interested with every chapter. It has been a lovely way to spend my reading time.',
    createdAt: '2026-11-02T14:15:00.000Z'
  },
  {
    id: 'rev-au-72',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-72',
    readerName: 'Archer Bennett',
    country: 'Australia',
    countryFlag: '🇦🇺',
    rating: 3,
    comment: 'The book has some strong ideas, although not every section worked for me. I still enjoyed being part of the challenge.',
    createdAt: '2026-11-02T15:00:00.000Z'
  },
  // Ireland 🇮🇪
  {
    id: 'rev-ie-73',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-73',
    readerName: 'Clodagh Murphy',
    country: 'Ireland',
    countryFlag: '🇮🇪',
    rating: 5,
    comment: 'I appreciate books that leave room for discussion. This one has given me several things to think about, and I\'ve enjoyed reading it.',
    createdAt: '2026-11-02T15:45:00.000Z'
  },
  {
    id: 'rev-ie-74',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-74',
    readerName: "Seamus O'Brien",
    country: 'Ireland',
    countryFlag: '🇮🇪',
    rating: 4,
    comment: "An enjoyable story with some memorable passages. I particularly liked the author's approach to the subject.",
    createdAt: '2026-11-02T16:30:00.000Z'
  },
  // New Zealand 🇳🇿
  {
    id: 'rev-nz-75',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-75',
    readerName: 'Lily Montgomery',
    country: 'New Zealand',
    countryFlag: '🇳🇿',
    rating: 5,
    comment: 'Reading alongside others has made this experience special. I love seeing how different readers connect with a story in their own way.',
    createdAt: '2026-11-02T17:15:00.000Z'
  },
  {
    id: 'rev-nz-76',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-76',
    readerName: 'Benjamin Clarke',
    country: 'New Zealand',
    countryFlag: '🇳🇿',
    rating: 4,
    comment: 'I found it engaging and easy to follow. There were a few moments that really caught my attention, making it a satisfying read.',
    createdAt: '2026-11-02T18:00:00.000Z'
  },
  // South Africa 🇿🇦
  {
    id: 'rev-za-77',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-77',
    readerName: 'Amara Khumalo',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    rating: 5,
    comment: 'I enjoy the sense of community that comes with reading together. This selection has made me appreciate the value of sharing stories even more.',
    createdAt: '2026-11-02T18:45:00.000Z'
  },
  {
    id: 'rev-za-78',
    manuscriptId: 'ethans-presence',
    readerId: 'rdr-seed-78',
    readerName: 'Joshua Pillay',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    rating: 4,
    comment: 'A good book with interesting ideas. I enjoyed taking my time with the chapters and reflecting on the story as it progressed.',
    createdAt: '2026-11-02T19:30:00.000Z'
  }
];
