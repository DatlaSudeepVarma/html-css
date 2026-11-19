/**
 * Single source of truth for all invitation content.
 * Every user-facing string is stored in both Telugu (`te`) and English (`en`).
 */

export type Lang = "te" | "en";
export type Localized = Record<Lang, string>;

export const DEFAULT_LANG: Lang = "te";
export const LANGS: readonly Lang[] = ["te", "en"] as const;

export interface Person {
  honorific: Localized;
  name: Localized;
  parents: Localized;
  relation: Localized;
}

export interface WeddingEvent {
  id: string;
  title: Localized;
  /** ISO 8601 with IST offset — used for countdowns and calendar links. */
  dateTime: string;
  numericDate: string;
  displayDate: Localized;
  displayDay: Localized;
  displayTime: Localized;
  /** Long-form lines used on the event's own section. */
  dayLine: Localized;
  timeLine: Localized;
  /** Calendar entry length. */
  durationMinutes: number;
}

export interface Venue {
  label: Localized;
  name: Localized;
  addressLines: Localized[];
  mapsUrl: string;
  mapsEmbedUrl: string;
}

export interface WeddingData {
  invocation: Localized;
  blessing: Localized;
  title: Localized;
  bride: Person;
  groom: Person;
  events: {
    muhurtham: WeddingEvent;
    vindhu: WeddingEvent;
  };
  venue: Venue;
  invitedBy: {
    label: Localized;
    names: Localized;
    closingBlessing: Localized;
  };
  saveTheDate: {
    title: Localized;
    subtitle: Localized;
  };
  scratch: {
    title: Localized;
    subtitle: Localized;
    hint: Localized;
    tap: Localized;
  };
  couple: {
    title: Localized;
    /** "❤" is rendered as an animated heart. */
    union: Localized;
  };
  countdown: {
    title: Localized;
    arrived: Localized;
    arrivedSub: Localized;
  };
  vindhuNote: Localized;
  calendar: {
    /** Prefixed to each event title, e.g. "Sree Satya ❤ Akshay Vijay — Muhurtham". */
    eventPrefix: Localized;
    description: Localized;
  };
  share: {
    /** The site link is appended on its own line. */
    message: Localized;
  };
  rsvp: {
    title: Localized;
    subtitle: Localized;
    thanks: Localized;
    thanksAttending: Localized;
    thanksDeclined: Localized;
  };
}

const VENUE_QUERY = "Ahvan Convention, Pipula Road, Singh Nagar, Vijayawada";

export const wedding: WeddingData = {
  invocation: {
    te: "|| శ్రీరస్తు || శుభమస్తు || అవిఘ్నమస్తు ||",
    en: "|| Srirastu || Subhamastu || Avighnamastu ||",
  },
  blessing: {
    te: "శ్రీ వేంకటేశ్వర స్వామి పద్మావతి అమ్మవార్ల కృపా కటాక్షములతో",
    en: "With the divine blessings of Lord Venkateswara and Goddess Padmavathi",
  },
  title: {
    te: "దాట్ల వారి పెండ్లి పిలుపు",
    en: "Datla Vari Pendli Pilupu",
  },

  bride: {
    honorific: { te: "చి||ల||సౌ||", en: "Chi. La. Sow." },
    name: { te: "శ్రీసత్య", en: "Sree Satya" },
    parents: {
      te: "శ్రీ\u00A0దాట్ల శ్రీనివాసరాజు & శ్రీమతి\u00A0పద్మావతి",
      en: "Sri\u00A0Datla Srinivasa Raju & Smt.\u00A0Padmavathi",
    },
    relation: {
      te: "దంపతుల ఏకైక కుమార్తె",
      en: "Only daughter of",
    },
  },

  groom: {
    honorific: { te: "చి||", en: "Chi." },
    name: { te: "అక్షయ్ విజయ్", en: "Akshay Vijay" },
    parents: {
      te: "శ్రీ\u00A0జక్కరిగారి బాలరాజు & శ్రీమతి\u00A0శీతల్‌మై",
      en: "Sri\u00A0Jakkarigari Balaraju & Smt.\u00A0Sheetalmai",
    },
    relation: {
      te: "గార్ల కనిష్ఠ పుత్రుడు",
      en: "Youngest son of",
    },
  },

  events: {
    muhurtham: {
      id: "muhurtham",
      title: { te: "సుముహూర్తం", en: "Muhurtham" },
      dateTime: "2026-12-03T21:06:00+05:30",
      numericDate: "3-12-2026",
      displayDate: { te: "3-12-2026", en: "3\u00A0December 2026" },
      displayDay: { te: "గురువారం", en: "Thursday" },
      displayTime: { te: "రాత్రి 9:06\u00A0గంటలకు", en: "9:06\u00A0PM" },
      dayLine: { te: "అనగా గురువారం", en: "Thursday" },
      timeLine: { te: "రాత్రి గం||\u00A009:06\u00A0ని||లకు", en: "at 09:06\u00A0PM (IST)" },
      durationMinutes: 120,
    },
    vindhu: {
      id: "vindhu",
      title: { te: "విందు", en: "Vindhu" },
      dateTime: "2026-12-03T19:00:00+05:30",
      numericDate: "3-12-2026",
      displayDate: { te: "3-12-2026", en: "3\u00A0December 2026" },
      displayDay: { te: "గురువారం", en: "Thursday" },
      displayTime: { te: "రాత్రి 7:00\u00A0గంటల నుండి", en: "From 7:00\u00A0PM" },
      dayLine: { te: "గురువారం", en: "Thursday" },
      timeLine: { te: "రాత్రి 7:00\u00A0గంటల నుండి", en: "From 7:00\u00A0PM onwards" },
      durationMinutes: 240,
    },
  },

  venue: {
    label: { te: "కళ్యాణ వేదిక", en: "Kalyana Vedika" },
    name: { te: "ఆహ్వాన్ కన్వెన్షన్", en: "Ahvan Convention" },
    addressLines: [
      { te: "పైపులరోడ్ జంక్షన్", en: "Pipula Road Junction" },
      { te: "ఎస్.బి.ఐ ఎదురుగా", en: "Opposite SBI" },
      { te: "సింగనగర్, విజయవాడ", en: "Singh Nagar, Vijayawada" },
    ],
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_QUERY)}`,
    mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(VENUE_QUERY)}&output=embed`,
  },

  invitedBy: {
    label: { te: "ఆహ్వానించువారు", en: "Invited By" },
    names: {
      te: "శ్రీ\u00A0దాట్ల శ్రీనివాసరాజు & శ్రీమతి\u00A0పద్మావతి",
      en: "Sri\u00A0Datla Srinivasa Raju & Smt.\u00A0Padmavathi",
    },
    closingBlessing: {
      te: "మీ రాకయే మాకు ఆనందం — మీ ఆశీస్సులే నూతన వధూవరులకు శ్రీరామరక్ష",
      en: "Your presence is our joy — your blessings, the couple's greatest gift",
    },
  },

  saveTheDate: {
    title: { te: "Save The Date", en: "Save The Date" },
    subtitle: {
      te: "మా ఇంట జరిగే శుభకార్యానికి మీకు ఇదే మా ఆత్మీయ ఆహ్వానం",
      en: "Our heartfelt invitation to an auspicious celebration in our family",
    },
  },

  scratch: {
    title: { te: "గీసి చూడండి", en: "Scratch to reveal" },
    subtitle: {
      te: "బంగారు పొరను గీసి వధూవరులను చూడండి",
      en: "Brush away the gold leaf to reveal the couple",
    },
    hint: { te: "వేలితో గీయండి", en: "Scratch with your finger" },
    tap: { te: "తెరవడానికి నొక్కండి", en: "Tap to reveal" },
  },

  couple: {
    title: { te: "వధువు & వరుడు", en: "The Bride & Groom" },
    union: {
      te: "శ్రీసత్య ❤ అక్షయ్ విజయ్ ల పరిణయం",
      en: "The wedding of Sree Satya ❤ Akshay Vijay",
    },
  },

  countdown: {
    title: { te: "శుభ ముహూర్తానికి", en: "Counting down to the Muhurtham" },
    arrived: { te: "కళ్యాణ శుభదినం వచ్చేసింది!", en: "Wedding Day is here!" },
    arrivedSub: { te: "నూతన వధూవరులను ఆశీర్వదించండి", en: "Come, bless the couple" },
  },

  vindhuNote: {
    te: "కళ్యాణ విందుకు సకుటుంబ సపరివార సమేతంగా విచ్చేయ ప్రార్థన",
    en: "You and your family are warmly invited to the wedding dinner",
  },

  calendar: {
    eventPrefix: { te: "శ్రీసత్య ❤ అక్షయ్ విజయ్", en: "Sree Satya ❤ Akshay Vijay" },
    description: {
      te: "దాట్ల వారి పెండ్లి పిలుపు — మీ రాకయే మాకు ఆనందం.",
      en: "Datla Vari Pendli Pilupu — your presence is our joy.",
    },
  },

  share: {
    message: {
      te: "🙏 శ్రీసత్య ❤ అక్షయ్ విజయ్ ల పరిణయ మహోత్సవానికి మీకు ఇదే మా ఆత్మీయ ఆహ్వానం.\n\n📅 3-12-2026, గురువారం — సుముహూర్తం రాత్రి 9:06 గంటలకు\n🍃 విందు రాత్రి 7:00 గంటల నుండి\n📍 ఆహ్వాన్ కన్వెన్షన్, సింగనగర్, విజయవాడ\n\nపూర్తి ఆహ్వాన పత్రిక:",
      en: "🙏 You are warmly invited to the wedding of Sree Satya ❤ Akshay Vijay.\n\n📅 Thursday, 3 Dec 2026 — Muhurtham at 9:06 PM\n🍃 Dinner from 7:00 PM\n📍 Ahvan Convention, Singh Nagar, Vijayawada\n\nView the invitation:",
    },
  },

  rsvp: {
    title: { te: "మీ రాకను తెలియజేయండి", en: "Kindly RSVP" },
    subtitle: {
      te: "మీ రాక గురించి ముందుగా తెలిపితే ఏర్పాట్లకు సులువుగా ఉంటుంది",
      en: "Letting us know in advance helps us prepare to welcome you",
    },
    thanks: { te: "ధన్యవాదాలు 🙏", en: "Thank you 🙏" },
    thanksAttending: { te: "మీ కోసం ఎదురుచూస్తుంటాం!", en: "We can't wait to celebrate with you!" },
    thanksDeclined: { te: "మీ ఆశీస్సులు మాకు ఎంతో విలువైనవి.", en: "Your blessings mean the world to us." },
  },
};

/** Short UI labels (nav, buttons, toggles). */
export const ui = {
  weds: { te: "వరుడు • వధువు", en: "weds" },
  bride: { te: "వధువు", en: "Bride" },
  groom: { te: "వరుడు", en: "Groom" },
  days: { te: "రోజులు", en: "Days" },
  hours: { te: "గంటలు", en: "Hours" },
  minutes: { te: "నిమిషాలు", en: "Minutes" },
  seconds: { te: "సెకన్లు", en: "Seconds" },
  directions: { te: "దారి చూపు", en: "Get Directions" },
  mapInteract: { te: "మ్యాప్ చూడటానికి నొక్కండి", en: "Tap to explore the map" },
  addToCalendar: { te: "క్యాలెండర్‌లో చేర్చండి", en: "Add to Calendar" },
  openInvitation: { te: "ఆహ్వానం తెరవండి", en: "Open Invitation" },
  loading: { te: "ఆహ్వానం సిద్ధమవుతోంది…", en: "Preparing your invitation…" },
  scroll: { te: "క్రిందికి", en: "Scroll" },
  photoComingSoon: { te: "చిత్రం త్వరలో", en: "Photo coming soon" },
  langGroupAria: { te: "భాష ఎంచుకోండి", en: "Choose language" },
  musicPlay: { te: "సంగీతం ప్రారంభించండి", en: "Play music" },
  musicPause: { te: "సంగీతం ఆపండి", en: "Pause music" },
  shareWhatsApp: { te: "వాట్సాప్‌లో పంచుకోండి", en: "Share on WhatsApp" },
  rsvpName: { te: "మీ పేరు", en: "Your name" },
  rsvpAttending: { te: "మీరు వస్తున్నారా?", en: "Will you attend?" },
  rsvpYes: { te: "తప్పకుండా వస్తాం", en: "Joyfully accept" },
  rsvpNo: { te: "రాలేకపోతున్నాం", en: "Regretfully decline" },
  rsvpGuests: { te: "అతిథుల సంఖ్య", en: "Number of guests" },
  rsvpMessage: { te: "ఆశీర్వచన సందేశం (ఐచ్ఛికం)", en: "Blessing message (optional)" },
  rsvpSubmit: { te: "పంపండి", en: "Send RSVP" },
  rsvpSubmitting: { te: "పంపుతున్నాం…", en: "Sending…" },
  rsvpFailed: { te: "పంపడం కుదరలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.", en: "Couldn't send. Please try again." },
  rsvpAgain: { te: "మరొక స్పందన పంపండి", en: "Send another response" },
  errNameRequired: { te: "దయచేసి మీ పేరు రాయండి", en: "Please enter your name" },
  errNameLength: { te: "పేరు 2 నుండి 60 అక్షరాల మధ్య ఉండాలి", en: "Name must be 2–60 characters" },
  errAttending: { te: "దయచేసి ఒకటి ఎంచుకోండి", en: "Please choose one" },
  errGuests: { te: "అతిథుల సంఖ్య 1 నుండి 20 మధ్య ఉండాలి", en: "Guests must be between 1 and 20" },
  errMessage: { te: "సందేశం 500 అక్షరాల లోపు ఉండాలి", en: "Message must be under 500 characters" },
} satisfies Record<string, Localized>;

export const pick = (value: Localized, lang: Lang): string => value[lang];
