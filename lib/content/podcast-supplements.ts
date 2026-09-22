import type { PodcastReadingSupport } from "@/components/podcast-transcript-data";

/** Recording-derived machine transcripts; chapter topics reviewed against the text. */
export const PODCAST_SUPPLEMENTS: Partial<Record<string, PodcastReadingSupport>> = {
  "equity-toolkit": {
    "transcriptUrl": "/audio/transcripts/dhs-equity-policy-and-toolkit.json",
    "chapters": [
      {
        "start": 0.0,
        "title": "Policy purpose and who it applies to"
      },
      {
        "start": 154.9,
        "title": "Roles, tools and administration goals"
      },
      {
        "start": 567.84,
        "title": "Applying the policy in decisions and daily work"
      },
      {
        "start": 944.64,
        "title": "Shared terms: access, equity and engagement"
      },
      {
        "start": 1611.44,
        "title": "The equity analysis quick guide"
      },
      {
        "start": 1773.36,
        "title": "Steps 1–3: outcomes, data and engagement"
      },
      {
        "start": 2025.16,
        "title": "Steps 4–8: impacts, accountability and sustainability"
      },
      {
        "start": 2309.4,
        "title": "The equity scan"
      },
      {
        "start": 2507.72,
        "title": "Using the tools, collaborating and checking progress"
      }
    ]
  },
  "anti-racism-public-service": {
    "transcriptUrl": "/audio/transcripts/anti-racism-public-service.json",
    "chapters": [
      {
        "start": 0,
        "title": "What anti-racism means for public service"
      },
      {
        "start": 152.91,
        "title": "Racism, institutions, intent and impact"
      },
      {
        "start": 371.95,
        "title": "Anti-racism as a deliberate practice"
      },
      {
        "start": 508.57,
        "title": "Different claims, evidence and accountability"
      },
      {
        "start": 596.27,
        "title": "Examining common claims about DEI"
      },
      {
        "start": 880.81,
        "title": "History and present-day decisions"
      },
      {
        "start": 948.17,
        "title": "Government services and public responsibility"
      },
      {
        "start": 1123.87,
        "title": "Defining problems and evaluating change"
      },
      {
        "start": 1283.89,
        "title": "Taking concerns seriously and building trust"
      },
      {
        "start": 1413.43,
        "title": "Practical steps for everyday service"
      },
      {
        "start": 1500.53,
        "title": "Sustaining the work through ordinary decisions"
      }
    ]
  }
};
