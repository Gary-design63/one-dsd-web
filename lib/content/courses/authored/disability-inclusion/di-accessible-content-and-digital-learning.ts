import type { CoursePack } from "../../source-types";

// Disability Inclusion · Practitioner, Module 3: Accessible Content and Digital Learning Design.
// Program-authored course for learning leaders, internal trainers, communications staff, accessibility coordinators and anyone who publishes to staff or the public.
const pack: CoursePack = {
  course: {
    id: "di-accessible-content-and-digital-learning",
    indexNumber: 1114,
    seriesLabel: "Disability Inclusion · Practitioner",
    title: "Accessible Content and Digital Learning Design",
    subtitle: "Build documents, slides, videos, forms and lessons that work with a keyboard, a screen reader and captions, then prove it with a test you can run yourself.",
    scope: "For accessibility coordinators, equity professionals, learning leaders, human resources partners, program managers, supervisors, policy analysts, internal trainers and inclusion champions who create or approve content. Four lessons on structure, alt text, links, contrast, keyboard operability, captions and transcripts, accessible slides and forms, plain language and a keyboard-only test, ending with an accessibility rationale for one piece of content you remediate. Participation in this program is voluntary and does not replace required training.",
    treatment: "Four short lessons with scenarios, a sorting activity, flashcards, a captioned-video plan, an accessibility rationale and knowledge checks",
    duration: "45–55 minutes",
    author: "One DHS — People, Access and Culture",
    coverImage: "/images/covers/neurodiversity.jpg",
    coverAlt: "A man works quietly at a cubicle with headphones.",
    introTranscript: "Almost everything a public agency says to its staff and the public now arrives as a document, a slide, a video, a form or a lesson. If those things cannot be read by a screen reader, operated by a keyboard or followed without sound, the agency has said nothing to the people who needed to hear it most. This course teaches the practical craft: meaningful headings, alt text that does a job, links that say where they go, contrast and color that do not carry meaning alone, keyboard operability, captions and transcripts, slides and forms built on real structure, and plain language that respects adults. You will finish by running a keyboard-only test and writing an accessibility rationale for something you have remediated.",
    kind: "course",
    contentType: "practice",
    learning: {
      objectives: [
        "Structure a document or page with a correct heading hierarchy, descriptive links and alt text that conveys purpose, and explain why each matters to a screen-reader user.",
        "Check color contrast against the common thresholds, remove color-only cues, and verify that every interaction works with a keyboard alone with a visible focus.",
        "Plan captions, a transcript and, where needed, audio description for a video, and distinguish what each one provides.",
        "Build slides and forms on real structure, with reading order, labels, instructions and error messages that assistive technology can present.",
        "Run a keyboard-only test and a screen-reader-informed check on a piece of content, and write an accessibility rationale that explains what changed and why.",
      ],
      evidence: [
        "Four knowledge checks that explain why a technique works for the people it is meant to serve.",
        "A sorting activity on alt text and link text that separates good practice from common mistakes.",
        "One remediated document, slide deck, form or lesson with a written accessibility rationale and the results of a keyboard-only test.",
      ],
      appliedNextStep: "Choose one document, slide deck, form or lesson you own that staff or the public rely on. Remediate it using this course, run the keyboard-only test, and write the rationale. Keep both with the file.",
    },
    governance: {
      contentOwner: "One DHS — People, Access and Culture",
      reviewers: ["Equity and Inclusion Operations Consultant"],
      evidenceDate: "Public sources checked at authoring",
      lastReviewed: "At authoring",
      nextReview: "At the agreed review point and whenever an update trigger occurs",
      updateTriggers: ["Change in web accessibility guidelines, Section 508 or the state accessibility standard", "Change in DHS document, video or learning platform standards", "Feedback from disabled staff or participants that a technique or example is inaccurate"],
      relatedDoor: "Defects in shared platforms, procurement questions and formal conformance reviews belong to the accessibility team and the system owner; this course teaches you to build and test your own content, it does not certify a system.",
      toolkitQuestion: "Can a person read this with a screen reader, operate it with a keyboard, follow it without sound, and understand it on the first pass?",
      status: "reviewed",
    },
    lessons: [
      {
        id: "accessible-content-and-digital-learning-1",
        number: 1,
        title: "Structure people can navigate: headings, links and alt text",
        summary: "Give a screen-reader user the same map of your document that a sighted reader gets at a glance.",
        minutes: 12,
        learning: {
          objective: "Apply a correct heading hierarchy, write descriptive link text and write alt text that conveys the purpose of an image, and explain how each is used by a screen reader.",
          takeaways: [
            "Screen-reader users navigate by pulling up lists of headings and links; if those lists say “Heading, Heading, click here, click here,” the document has no map.",
            "Alt text describes what the image is for in this place, not everything that is in it; decorative images are marked decorative so they are skipped.",
            "Structure is applied with the built-in styles and tools of your software, never with bold, larger type or spacing that only looks like structure.",
          ],
          evidence: "A completed sort of alt text and link text; a knowledge check on heading levels; one document of yours checked with the navigation pane.",
          appliedNextStep: "Open a document you send often. Turn on the navigation pane or heading list. If it is empty or out of order, fix it with real heading styles before you send it again.",
        },
        scenario: {
          context: "A DHS policy team is publishing a twelve-page provider bulletin. The author made section titles by selecting text and making it bold and larger. Every reference to the online manual reads “click here.” Three charts have no alt text, and the header has a decorative banner image.",
          prompt: "What do you tell the author?",
          options: [
            { label: "It looks fine; publish it and fix accessibility in the next version.", response: "A screen-reader user opening this bulletin will hear a single unstructured block with eight identical links and three silent charts. There is no next version for the person who needs it today." },
            { label: "Apply real heading styles in order, rewrite each link to say where it goes, write alt text that states what each chart shows, and mark the banner decorative, then check the navigation pane before publishing.", response: "This takes less time than it sounds, and it gives every reader the same map. Checking the navigation pane is the proof.", recommended: true },
            { label: "Attach a plain-text version for anyone who needs it.", response: "A separate version tends to be out of date, unannounced and second class. Fix the bulletin itself; a plain-text copy is a fallback, not a substitute." },
          ],
        },
        transfer: {
          prompt: "Which document you own would a screen-reader user find hardest to navigate right now?",
          options: ["Open it and read only the heading list and the link list", "Write down what a person would and would not learn from those lists alone", "Fix headings, links and alt text, and check again"],
        },
        blocks: [
          { type: "text", heading: "Hear the document the way a screen reader presents it", body: "<p>A sighted reader takes in a page as a picture: headings stand out, links are blue, a chart is obviously a chart. A screen reader presents the same page as a stream of text, one item at a time, unless the author has built in structure it can use. Screen-reader users do not read every word; they navigate. They pull up a list of headings to find the section they want, a list of links to see where they can go, and they jump by heading level. If the author made headings by enlarging text, that list is empty. If every link says “click here” or “read more,” the link list is eight identical entries with no destination. Structure is what turns a stream into a map.</p><p><strong>Headings</strong> are applied with the built-in heading styles, in order: one first-level heading for the title, second-level for sections, third-level for subsections. Skipping from first to fourth to make something look smaller breaks the outline. <strong>Links</strong> say where they go or what they do: “Read the Provider Manual, chapter 4” rather than “click here,” and a full web address only when the document is meant to be printed. <strong>Alt text</strong> answers the question “what would this reader need to know about this image, here?” A chart’s alt text states what the chart shows, for example “Bar chart: applications completed by phone rose from about one in ten to about one in four over the period,” and the underlying numbers go in a table or the text. A photograph on a flyer describes what matters about it in a sentence. A logo says the organization’s name. A purely decorative banner is marked decorative so the screen reader skips it. Alt text does not begin with “image of” or “picture of”; the screen reader already announces that it is an image.</p><p>Everything here applies to web pages, documents, slides and lesson pages alike. The tools have different names; the principle is the same. Real structure, applied with the built-in features, that assistive technology can read.</p>" },
          { type: "sorting", id: "accessible-content-and-digital-learning-1-sort", heading: "Good practice, or a common mistake?", categories: ["Good practice", "Common mistake"], items: [
            { text: "Alt text on a chart: “Line chart: interpreter requests by month, rising from about 40 to about 110 across the period; data table follows.”", category: "Good practice" },
            { text: "Alt text on a photograph: “Image of people.”", category: "Common mistake" },
            { text: "Link text: “Apply for the waiver program online.”", category: "Good practice" },
            { text: "Link text: “Click here.”", category: "Common mistake" },
            { text: "A decorative divider image marked as decorative so screen readers skip it.", category: "Good practice" },
            { text: "Section titles made by selecting text and choosing bold, 16-point type.", category: "Common mistake" },
          ] },
          { type: "accordion", heading: "Writing alt text that does a job", items: [
            { title: "A chart or graph", body: "<p>State the type and the message in one or two sentences, then put the data in a table or in the text. “Bar chart: on-time appointment rates by region; the northeast region is lowest at roughly half.” Do not try to describe every bar.</p>" },
            { title: "A photograph on a flyer or slide", body: "<p>Say what matters in context. On a flyer for a caregiver support group: “Three adults talk at a kitchen table over coffee.” If the photograph is only atmosphere, mark it decorative. If it carries information, such as a map or a sign, write out the information.</p>" },
            { title: "A screenshot in instructions", body: "<p>Describe what the reader is meant to notice: “The Submit button is at the bottom right of the form, below the signature field.” The alt text replaces the screenshot for someone who cannot see it, so it has to carry the instruction.</p>" },
            { title: "An image that contains text", body: "<p>Avoid it where you can; put the text in the document. Where you cannot, the alt text repeats the text in full. A flyer saved as a picture is invisible to a screen reader unless every word is in the alt text.</p>" },
            { title: "A logo or icon", body: "<p>The organization’s name, or the function of the icon: “Search,” “Download the form.” Never “logo” or “icon” alone.</p>" },
          ] },
          { type: "leaderMove", heading: "Check the outline before you approve", control: "You control whether documents leave your unit with a real outline, or with formatting that only looks like one.", failure: "Do not approve a document because it looks professional. Open the navigation pane; if it is empty, the document has no structure.", next: "Add “heading list checked, links descriptive, alt text present” to whatever approval step your unit already uses for published content." },
          { type: "flashcards", heading: "Three structures, three jobs", cards: [
            { front: "Heading hierarchy", back: "<p>Built-in heading styles applied in order. Lets a screen-reader user jump to the section they need and understand how the document is organized. Visual size is not structure.</p>" },
            { front: "Descriptive link", back: "<p>Link text that says where it goes or what it does, readable out of context. Screen-reader users pull up all the links on a page as a list.</p>" },
            { front: "Alt text", back: "<p>A short statement of what the image is for in this place. Charts state the message; instructions carry the step; decoration is marked decorative. No “image of.”</p>" },
            { front: "Reading order", back: "<p>The order a screen reader will present items, which may differ from where they sit on the page. Check it in slides, PDFs and anything with columns or text boxes.</p>" },
          ] },
          { type: "knowledgeCheck", id: "accessible-content-and-digital-learning-1-check", question: "A report has a title, four main sections and several subsections. Which heading structure is correct?", options: [
            { text: "Title as Heading 1, main sections as Heading 2, subsections as Heading 3.", correct: true },
            { text: "Title as Heading 1, main sections as Heading 3 because Heading 2 looks too large, subsections as Heading 4.", correct: false },
            { text: "All headings as bold 14-point text so the document looks consistent.", correct: false },
          ], feedbackCorrect: "Yes. Levels in order give a screen-reader user an outline they can navigate. Change how a heading looks by editing the style, not by skipping levels.", feedbackIncorrect: "Heading levels are structure, not size. Use them in order and adjust the appearance of the style itself. Bold text is not a heading to a screen reader." },
        ],
      },
      {
        id: "accessible-content-and-digital-learning-2",
        number: 2,
        title: "Color, contrast and the keyboard",
        summary: "Make sure meaning survives without color and every action can be done without a mouse.",
        minutes: 12,
        learning: {
          objective: "Check text and interface contrast against the common thresholds, remove color-only cues, and verify keyboard operability with visible focus and no traps.",
          takeaways: [
            "Normal text needs a contrast ratio of at least 4.5 to 1 against its background; large text and interface components need at least 3 to 1. A free contrast checker gives you the number.",
            "Color may emphasize meaning but never carry it alone: required fields, errors, status and chart series need a second cue such as text, an icon or a pattern.",
            "Every interaction must be reachable and operable with the Tab, Enter, Space and arrow keys, with a visible focus indicator and no place a keyboard user gets stuck. Drag-and-drop needs a keyboard alternative or it excludes people.",
          ],
          evidence: "A knowledge check on contrast and color cues; a keyboard walk of one form or lesson with notes on focus and traps.",
          appliedNextStep: "Take one form, slide deck or lesson you own. Check the three lowest-contrast text colors with a checker, find every place color carries meaning alone, and tab through it once without touching the mouse.",
        },
        scenario: {
          context: "A DHS learning team is proud of a new lesson: participants drag policy statements into “allowed” and “not allowed” columns, correct answers turn green, wrong answers turn red, and light gray hints appear on a white background. A staff member who is colorblind and another who uses a keyboard because of a repetitive strain injury both say they could not complete it.",
          prompt: "What has to change?",
          options: [
            { label: "Add a note that the lesson works best with a mouse and normal color vision.", response: "That note announces exclusion instead of removing it. Required learning that some staff cannot complete is a barrier the team owns." },
            { label: "Give the drag-and-drop a keyboard alternative such as selecting an item and choosing a column, add text or icons beside the green and red, and raise the hint contrast to meet the threshold.", response: "Each fix removes a specific barrier for a specific group and none of them makes the lesson worse for anyone else.", recommended: true },
            { label: "Replace the interactive lesson with a PDF of the policy.", response: "A static document may or may not be accessible either, and it throws away the practice that made the lesson useful. Fix the interaction; do not abandon it." },
          ],
        },
        transfer: {
          prompt: "Where does color carry meaning alone in something your unit publishes?",
          options: ["Find one status indicator, chart or form cue that depends on color", "Add a second cue: text, an icon, a pattern or a label", "Tab through the same item and note where focus disappears or gets stuck"],
        },
        blocks: [
          { type: "text", heading: "Meaning without color, action without a mouse", body: "<p>Contrast is the difference in luminance between text and its background, expressed as a ratio. The widely used web accessibility guidelines set a minimum of 4.5 to 1 for normal text and 3 to 1 for large text, meaning roughly 18-point regular or 14-point bold, and for interface components such as input borders and focus indicators. Light gray hint text on white, pale blue links, and white text on a light photograph all fail routinely. You do not have to guess: a free contrast checker takes two colors and gives you the ratio. Check it when you choose a palette, not after the flyer is printed.</p><p>Color is a fine way to emphasize meaning and a poor way to carry it. About one in twelve men and a smaller share of women have some form of color vision deficiency, screen readers do not announce color at all, and printed copies are often black and white. So a required field needs the word “required” or an asterisk that is explained; an error needs text that says what went wrong, next to the field; a status needs a label or an icon, not just red, amber and green; a chart needs patterns, direct labels or distinct shapes as well as color.</p><p>Keyboard operability is the test that catches the most serious interaction barriers. Many people cannot use a mouse: people who are blind, people with tremor, pain or limited hand mobility, people using a switch or voice control that sends key presses. Every control must be reachable with Tab, activated with Enter or Space, and, for groups such as radio buttons and menus, navigated with arrow keys. The <strong>focus indicator</strong>, the outline that shows which element is active, must be visible; removing it for a cleaner look removes the only map a keyboard user has. There must be no <strong>keyboard trap</strong>, a place where focus enters and cannot leave. And any interaction that depends on dragging, hovering or drawing needs an equivalent that uses key presses. Drag-and-drop sorting, image hotspots and sliders are the usual offenders in learning content; each can be built with a keyboard alternative or replaced with an equivalent activity.</p>" },
          { type: "tabs", heading: "Four checks you can do in five minutes", tabs: [
            { label: "Contrast", body: "<p>Pick the three faintest text colors and the focus indicator color. Put each against its background in a contrast checker. Normal text needs at least 4.5 to 1; large text and interface components at least 3 to 1. Fix anything below by darkening the text or lightening the background.</p>" },
            { label: "Color cues", body: "<p>Print the page in grayscale or view it with a grayscale filter. Anything whose meaning disappeared, required fields, errors, statuses, chart series, needs a second cue: a word, an icon, a pattern or a direct label.</p>" },
            { label: "Keyboard reach", body: "<p>Put the mouse out of reach. Press Tab from the top. Can you reach every link, button, field and control in a sensible order? Does the order match the visual order? Is anything skipped?</p>" },
            { label: "Focus and traps", body: "<p>As you tab, can you always see which element is active? Press Enter or Space on each control; does it work? Open any menu, dialog or embedded item and confirm you can Tab or Escape back out. If you get stuck, that is a trap and a serious defect.</p>" },
          ] },
          { type: "leaderMove", heading: "Never approve a mouse-only interaction", control: "You control whether learning and forms in your unit are approved only after someone has tabbed through them without a mouse.", failure: "Do not accept a drag-and-drop activity, an image hotspot or a slider without a keyboard alternative, no matter how engaging it looks. Engaging for some is exclusion for others.", next: "Make “completed with a keyboard alone” a condition of sign-off for any new lesson or form, and do the first one yourself." },
          { type: "flashcards", heading: "Contrast and keyboard, remembered", cards: [
            { front: "4.5 to 1", back: "<p>Minimum contrast ratio for normal text against its background under the common guidelines. Light gray on white almost never meets it.</p>" },
            { front: "3 to 1", back: "<p>Minimum contrast for large text and for interface components such as input borders and the focus indicator.</p>" },
            { front: "Color-only cue", back: "<p>Meaning carried by color with no second signal. Fails for people with color vision deficiency, screen-reader users and black-and-white print. Add text, an icon, a pattern or a label.</p>" },
            { front: "Focus indicator", back: "<p>The visible outline on the active element. The keyboard user’s only map. Never remove it; make it meet 3 to 1 contrast.</p>" },
            { front: "Keyboard trap", back: "<p>A place focus can enter but not leave with the keyboard. A serious defect. Test every dialog, menu and embedded item by tabbing and pressing Escape.</p>" },
            { front: "Keyboard alternative", back: "<p>An equivalent way to do a drag, hover or drawing interaction with key presses, such as select an item, then choose a destination. Required for any interactive learning that is required.</p>" },
          ] },
          { type: "statement", body: "If it cannot be done with a keyboard, it cannot be done by a meaningful share of your staff and the public. The keyboard test is not advanced practice; it is the first test." },
          { type: "knowledgeCheck", id: "accessible-content-and-digital-learning-2-check", question: "A form marks required fields by turning the label red and shows errors by outlining the field in red. Which change makes it accessible?", options: [
            { text: "Use a brighter red so it is easier to see.", correct: false },
            { text: "Add the word “required” to required labels, and place a text error message next to each field that says what needs to change, in addition to the red.", correct: true },
            { text: "Remove the red so the form looks cleaner.", correct: false },
          ], feedbackCorrect: "Yes. Color can stay as emphasis, but the meaning now travels in text that screen readers announce and everyone can see.", feedbackIncorrect: "The problem is not the shade of red. It is that the meaning exists only in color. Add text so required fields and errors are announced and readable by everyone." },
        ],
      },
      {
        id: "accessible-content-and-digital-learning-3",
        number: 3,
        title: "Video, slides and forms",
        summary: "Plan captions, transcripts and audio description, build slides on real layouts, and make forms that tell people what they need to do.",
        minutes: 12,
        learning: {
          objective: "Plan an accessible video with captions, a transcript and audio description where needed, and build slides and forms on real structure with reading order, labels, instructions and error messages.",
          takeaways: [
            "Captions serve people who cannot hear the audio; transcripts serve people who cannot see or play the video and people who want to search or skim; audio description serves people who cannot see what is shown. They are three different things.",
            "Slides are accessible when they use the built-in layouts and placeholders, have one clear heading each, carry alt text, keep text as text, and have a checked reading order.",
            "Forms are accessible when every field has a programmatic label, instructions come before the field, errors say what to fix and where, and no time limit exists without a way to extend it.",
          ],
          evidence: "A completed captioned-video plan; a knowledge check on captions versus transcripts; one slide deck or form of yours checked against the list.",
          appliedNextStep: "Take the next video, slide deck or form your unit will publish. Complete the plan or checklist from this lesson before it goes out, and note who verified each item.",
        },
        scenario: {
          context: "A DHS training unit recorded a ten-minute video walking through a new MnCHOICES screen. The narrator says “click here, then here” while the cursor moves, the automatic captions were left unedited and read “Mn choices” as “men choices” throughout, and there is no transcript.",
          prompt: "What does an accessible version of this video require?",
          options: [
            { label: "Fix the automatic captions and publish.", response: "Accurate captions are necessary, but a blind staff member still hears “click here, then here” with no idea where “here” is, and nobody can search or skim the content without a transcript." },
            { label: "Edit the captions for accuracy, write a transcript that includes the on-screen actions, and either re-record the narration so it names what is clicked or add audio description that does.", response: "Now the video works without hearing, without sight and without playing it at all, and the fix to the narration improves it for everyone.", recommended: true },
            { label: "Replace the video with a written guide and remove it.", response: "A written guide is a good companion and may be the transcript. Removing the video takes away a format many people learn best from. Make it accessible; keep it." },
          ],
        },
        transfer: {
          prompt: "Which video, slide deck or form does your unit rely on most?",
          options: ["Check whether its captions were edited and whether a transcript exists", "Open the slide deck’s outline view and reading order, or tab through the form", "Assign one person to fix what you found and one to verify it"],
        },
        blocks: [
          { type: "text", heading: "Three things people mean by “accessible video”", body: "<p><strong>Captions</strong> are text of the spoken words and meaningful sounds, synchronized with the video. They serve people who are Deaf or hard of hearing, people in noisy or quiet places, and people processing a second language. Automatic captions are a draft, not a finished product; they miss names, acronyms, program terms and anything said quickly, and they rarely punctuate. Edit them, and include speaker changes and sounds that matter, such as “[phone rings].” <strong>Transcripts</strong> are a complete text version of the video that can be read without playing it. For a screen-reader user, a transcript is often faster than the video; for everyone, it is searchable and skimmable. A transcript for a demonstration video includes what happens on screen, not only what is said. <strong>Audio description</strong> is narration of visual content that matters and is not spoken aloud: what is on the slide, where the cursor goes, who entered the room. The simplest form of audio description is a narrator who says what they are doing, which is why re-recording “click here” as “select Save, at the bottom right of the assessment” often removes the need for a separate description track.</p><p><strong>Slides</strong> fail in predictable ways: text typed into free-floating boxes instead of the layout placeholders, so a screen reader has no title and no order; images with no alt text; text pasted in as a picture; tiny type and low contrast because the slide was built for the presenter’s screen. Build on the built-in layouts, give every slide one unique title, check the reading order in the selection or outline pane, keep text as text with alt text on images, and use the accessibility checker your slide software provides as a first pass, not a final word. Send the deck ahead of the meeting as an accessible file, because slides on a screen are not readable by everyone in the room.</p><p><strong>Forms</strong> are where people are most often stopped. Every field needs a label that is programmatically attached, not just visually nearby, so a screen reader announces “Date of birth, edit” rather than “edit.” Instructions and format examples come before the field, not after. Required fields are marked in text. Error messages appear next to the field, say what went wrong and what to do, and move focus to the problem. Grouped controls, such as a set of choices, share a group label. There is no time limit without a warning and a way to extend, and progress can be saved. A PDF form has all of this only if it was built as a tagged, fillable form with labeled fields; a scanned or flattened PDF is an image and needs a web form or an accessible alternative beside it.</p>" },
          { type: "artifact", kind: "captioned-video", label: "Practical artifact", title: "Plan for an accessible training video", summary: "Complete this before recording, not after. The example is a ten-minute demonstration of a new screen in a case management system.", fields: [
            { label: "Narration says what is shown", value: "The script names every action and location: “Select Save, at the bottom right of the assessment,” never “click here.” The narrator reads any text that appears on screen that matters." },
            { label: "Captions", value: "Automatic captions are edited for accuracy, including program names and acronyms, with punctuation, speaker changes and meaningful sounds. Verified by a second person watching with sound off." },
            { label: "Transcript", value: "A full text version posted with the video, including on-screen actions and any text shown, structured with headings for each step so it doubles as a written guide." },
            { label: "Audio description and player", value: "Where the narration cannot carry the visual content, a described version is provided. The video player is keyboard operable with visible focus, and captions can be turned on and sized." },
          ], action: "Attach the completed plan to the video request, and do not publish until the caption check and the transcript are done." },
          { type: "accordion", heading: "Slides and forms, checked", items: [
            { title: "Slides: before you present", body: "<ul><li>Every slide uses a built-in layout and has one unique title in the title placeholder.</li><li>Reading order checked in the selection or outline pane; it matches the visual order.</li><li>Every image has alt text or is marked decorative; no text is pasted as a picture.</li><li>Text is at least 18 point for a room; contrast meets 4.5 to 1; color never carries meaning alone.</li><li>Tables are simple, with a header row; no merged cells.</li><li>The deck is sent ahead as an accessible file, and you read the slide aloud rather than saying “as you can see.”</li></ul>" },
            { title: "Forms: before you publish", body: "<ul><li>Every field has a programmatically attached label; groups of choices have a group label.</li><li>Instructions and format examples come before the field.</li><li>Required fields are marked in text; errors appear next to the field, say what to fix, and receive focus.</li><li>No time limit without warning and extension; progress can be saved and resumed.</li><li>The whole form can be completed with a keyboard alone with visible focus.</li><li>If it is a PDF, it is a tagged, fillable form with labeled fields; otherwise an accessible web form or alternative is offered alongside it.</li></ul>" },
            { title: "Lessons: before you launch", body: "<ul><li>Every interaction has a keyboard alternative; nothing requires dragging, hovering or a mouse.</li><li>Headings, links, alt text, contrast and captions meet the same standards as any other content.</li><li>Feedback on answers is in text, not color alone, and is announced to a screen reader.</li><li>A person can leave and come back without losing progress, and no step is timed without extension.</li></ul>" },
          ] },
          { type: "list", heading: "What each video element gives, and to whom", items: ["Captions: the spoken words and meaningful sounds, in time with the picture, for people who cannot hear the audio or are somewhere they cannot play it.", "Transcript: the whole video as text, including what happens on screen, for people who cannot see or play it and for anyone who wants to search or skim.", "Audio description: the visual content that matters, spoken, for people who cannot see the screen. Narration that names what it does is the simplest form.", "Accessible player: keyboard controls, visible focus, captions that can be turned on and resized."] },
          { type: "leaderMove", heading: "Automatic captions are a draft", control: "You control whether your unit publishes automatic captions as they come, or edits and verifies them before release.", failure: "Do not let a video go out with unedited automatic captions because the platform produced them. Program names, acronyms and fast speech are exactly what they get wrong.", next: "Assign caption editing and a sound-off verification to a named person for every video, and put the check in the release step." },
          { type: "flashcards", heading: "Video, slides and forms, one card each", cards: [
            { front: "Captions", back: "<p>Synchronized text of speech and meaningful sounds. Edited for accuracy, never left automatic. Serves people who cannot hear the audio.</p>" },
            { front: "Transcript", back: "<p>The whole video in text, including on-screen actions. Serves people who cannot see or play the video, and everyone who searches or skims.</p>" },
            { front: "Audio description", back: "<p>Spoken narration of visual content that matters. Often unnecessary if the narrator says what is on screen and what they are doing.</p>" },
            { front: "Slide structure", back: "<p>Built-in layouts, one unique title per slide, checked reading order, alt text, text as text, readable size and contrast, sent ahead as an accessible file.</p>" },
            { front: "Form label", back: "<p>A label programmatically attached to its field so a screen reader announces what the field is. Visual proximity is not attachment.</p>" },
          ] },
          { type: "knowledgeCheck", id: "accessible-content-and-digital-learning-3-check", question: "A staff member who is blind wants to learn the content of a recorded demonstration video. Which element serves her most directly?", options: [
            { text: "Accurate captions.", correct: false },
            { text: "A transcript that includes the on-screen actions, or narration that names what is shown.", correct: true },
            { text: "A higher-resolution video file.", correct: false },
          ], feedbackCorrect: "Yes. Captions are text she cannot see on the screen. A transcript with the visual actions, or narration that describes them, gives her the content directly.", feedbackIncorrect: "Captions serve people who cannot hear. A person who cannot see the video needs the visual content in text or in the narration: a transcript that includes on-screen actions, or described narration." },
        ],
      },
      {
        id: "accessible-content-and-digital-learning-4",
        number: 4,
        title: "Plain language, the keyboard-only test and the rationale",
        summary: "Write for adults without talking down, test your content the way a keyboard user meets it, and record what you changed and why.",
        minutes: 12,
        learning: {
          objective: "Apply plain-language principles while preserving accuracy and respect, run a keyboard-only test and a screen-reader-informed check on a piece of content, and write an accessibility rationale.",
          takeaways: [
            "Plain language means the reader can find what they need, understand it the first time and use it; it removes needless difficulty, not necessary meaning or the reader’s dignity.",
            "The keyboard-only test is a fixed sequence anyone can run; its results are observations, not opinions.",
            "An accessibility rationale records what was inaccessible, who it affected, what changed and how it was verified, so the next editor does not undo it.",
          ],
          evidence: "One piece of content remediated, a completed keyboard-only test and a written accessibility rationale.",
          appliedNextStep: "Choose one document, slide deck, form or lesson you own. Remediate it, run the keyboard-only test, write the rationale and keep both with the file.",
        },
        scenario: {
          context: "A DHS communications team rewrites a benefit notice into plain language. The new version is short and friendly. It also drops the appeal deadline into a footnote, replaces the program’s legal name with a nickname, and adds “Don’t worry, we’re here to help!” A disability advocate reviewing it says it reads as if written for children and hides the one thing people most need to know.",
          prompt: "What should the team take from that feedback?",
          options: [
            { label: "The advocate prefers the old version; keep the new one because it scores better on readability.", response: "A readability score measures sentence and word length, not whether the reader can act. Burying the deadline and using a nickname for the program failed the reader in ways the score cannot see." },
            { label: "Plain language done well keeps the exact program name, puts the deadline and the action in the first lines, uses short sentences and familiar words, and drops the cheerful filler; revise again with the advocate.", response: "This is the standard: find it, understand it, use it, and be treated as a capable adult. The advocate’s time should be paid and the revision reviewed again.", recommended: true },
            { label: "Return to the original legal text to be safe.", response: "The original was hard to read, and difficulty is also a barrier. The answer is plain language that keeps the meaning, not a retreat from clarity." },
          ],
        },
        transfer: {
          prompt: "What will you remediate first, and who will run the keyboard-only test on it?",
          options: ["Name the file and the barriers you already suspect", "Run the eight-step keyboard test and write down every observation", "Draft the rationale and store it with the file"],
        },
        blocks: [
          { type: "text", heading: "Plain language respects the reader", body: "<p>Plain language is content the intended reader can find, understand the first time and use. It is a legal expectation for much federal public communication and a professional standard in Minnesota state government. It matters for people with cognitive and learning disabilities, people reading in a second language, people under stress, and everyone reading on a phone in a waiting room. It is not simplification for its own sake, and it is not a tone. The failures in the scenario are common: dropping essential information because it is complex, replacing exact names because they are long, and adding cheer because the writer confuses warmth with informality.</p><p>The techniques are well established. Lead with what the reader needs to do and by when. Use short sentences and familiar words, but keep exact program, benefit and office names, because the reader will need to say them to someone. Use headings that answer the reader’s questions. Put one idea in each paragraph. Prefer active sentences that say who does what. Explain a necessary term the first time instead of avoiding it. Give examples. And treat the reader as a capable adult who can handle complexity when it is organized; complexity is not the enemy, confusion is.</p><p>Then test. A readability score is a diagnostic. The tests that matter are whether a person unfamiliar with the program can say what the notice is asking them to do, and whether the content passes a keyboard-only walk and a screen-reader-informed check. The test below is written so that anyone on your team can run it and record what they observed, not what they thought.</p>" },
          { type: "list", heading: "The keyboard-only test", ordered: true, items: ["Put the mouse out of reach. Open the content where a person would start: the link in the email, the page in the site, the file as sent.", "Press Tab repeatedly from the top. Confirm that every link, button, field, menu and control receives focus, in an order that matches the visual order, and that nothing is skipped.", "At every stop, confirm a visible focus indicator. Note any element where you cannot tell where you are.", "Activate each control with Enter or Space. Use arrow keys inside groups of choices, menus and tabs. Note anything that does not respond.", "Open every dialog, menu, embedded video or expandable section, then leave it with Tab or Escape. Note any place you cannot get out of.", "Complete the whole task, submit the form, finish the lesson or reach the end of the document, using only the keyboard. Record how long it took and where you hesitated.", "Turn on the screen reader built into your computer and read the heading list and link list. Note any heading that is missing or out of order and any link that does not make sense alone.", "Read the page in grayscale or with sound off, as appropriate. Note anything whose meaning disappeared. Write every observation as location, what happened, and what it prevented."] },
          { type: "artifact", kind: "tagged-document", label: "Practical artifact", title: "Accessibility rationale", summary: "A short record kept with any content you remediate. It explains the changes to the next editor and shows what was verified. The example is a provider bulletin.", fields: [
            { label: "What was inaccessible, and who it affected", value: "Headings were visual only, so screen-reader users had no outline; eight links read “click here”; three charts had no alt text; hint text was light gray on white below the contrast threshold; the linked form had a fifteen-minute time limit with no extension." },
            { label: "What changed", value: "Applied heading styles in order; rewrote each link to name its destination; wrote alt text stating each chart’s message and added data tables; darkened hint text to meet 4.5 to 1; asked the form owner to add a warning and extension, and offered a phone and paper route in the bulletin until that is done." },
            { label: "How it was verified", value: "Navigation pane shows a complete outline; link list reads sensibly out of context; keyboard-only test completed in one pass with visible focus throughout and no traps; screen-reader heading and link lists reviewed; contrast measured with a checker. Verified by a second person on a stated date and kept with the file." },
            { label: "What remains and who owns it", value: "The time limit on the linked form is not yet fixed; owner is the form’s system owner, with the accessibility team advising, decision requested within 30 days. Interim route is named in the bulletin." },
          ], action: "Save the rationale with the file and its version, so the next editor can see what was done and what is still open." },
          { type: "leaderMove", heading: "Test with the mouse out of reach", control: "You control whether the content your unit publishes has been walked with a keyboard and a screen reader by someone before release, and whether the observations are recorded.", failure: "Do not sign off on “it looks fine to me.” Looking is the one test that does not catch these barriers.", next: "Run the keyboard-only test yourself on the next item your unit publishes, and attach the observations to the approval." },
          { type: "flashcards", heading: "Finishing well", cards: [
            { front: "Plain language", back: "<p>Find it, understand it the first time, use it. Keep exact names and essential information; drop needless difficulty and filler; treat the reader as a capable adult.</p>" },
            { front: "Readability score", back: "<p>A diagnostic that measures sentence and word length. It cannot tell you whether the reader can act. Test with a person and with the keyboard.</p>" },
            { front: "Keyboard-only test", back: "<p>A fixed sequence: reach, focus, activate, escape, complete, then read the heading and link lists with a screen reader. Record observations, not opinions.</p>" },
            { front: "Accessibility rationale", back: "<p>What was inaccessible and for whom, what changed, how it was verified, what remains and who owns it. Kept with the file.</p>" },
            { front: "Screen-reader-informed check", back: "<p>Not a full expert review; a look at the heading list, the link list, alt text and reading order with the built-in screen reader, done by the author before the accessibility team ever sees it.</p>" },
          ] },
          { type: "quote", text: "The new letter was easier to read. It also lost the deadline. Easy to read and useful to me are two different things, and I need both.", cite: "Composite participant perspective, illustrative" },
          { type: "knowledgeCheck", id: "accessible-content-and-digital-learning-4-check", question: "Which sentence belongs in an accessibility rationale?", options: [
            { text: "“The document was made accessible.”", correct: false },
            { text: "“Headings were visual only, so screen-reader users had no outline; heading styles were applied in order and the navigation pane now shows the full structure, verified by a second person.”", correct: true },
            { text: "“Accessibility was considered throughout the design process.”", correct: false },
          ], feedbackCorrect: "Yes. Barrier, who it affected, what changed and how it was verified. The next editor can see exactly what to preserve.", feedbackIncorrect: "A rationale is specific: what was inaccessible and for whom, what changed, and how it was checked. General assurances do not help the next editor or the reader." },
          { type: "text", heading: "Take it to your work", body: "<p>Before you publish or send, run your own work through the <a href=\"/practice/gp-13\">three-pass check</a>: access and plain language, what you assumed people know, and tone. For a notice or letter that changes a process, the <a href=\"/practice/gp-2\">form and notice path</a> adds the burden questions.</p>" },
        ],
      },
    ],
  },
  jobAid: {
    title: "Before you publish",
    subtitle: "A one-page check for documents, slides, videos, forms and lessons",
    quote: "Real headings. Links that say where they go. Alt text that does a job. Meaning without color. Everything by keyboard. Captions edited, transcript posted.",
    use: {
      purpose: "Catch the most common barriers in your own content before it reaches staff or the public, and leave a record of what you checked.",
      remember: ["Structure is applied with built-in styles and layouts, never with bold and size.", "4.5 to 1 for normal text, 3 to 1 for large text and controls; color never carries meaning alone.", "If it cannot be done with a keyboard, it cannot be done by many people.", "Automatic captions are a draft; a transcript includes what happens on screen."],
      doNext: "Run the keyboard-only test on the next thing you publish and keep the rationale with the file.",
    },
    sections: [
      { heading: "Documents and pages", items: ["Heading styles in order; the navigation pane shows a full outline.", "Every link says where it goes, readable alone.", "Alt text states the image’s purpose; charts state the message; decoration is marked decorative.", "Contrast checked; no text as pictures; tables simple with a header row."] },
      { heading: "Slides, video and forms", items: ["Slides on built-in layouts, one unique title each, reading order checked, sent ahead as an accessible file.", "Captions edited and verified with sound off; transcript posted with on-screen actions; narration names what it shows.", "Every field has an attached label; instructions before the field; errors in text next to the field; no time limit without extension.", "PDF forms are tagged and fillable, or a web form or alternative is offered."] },
      { heading: "Test and record", items: ["Mouse out of reach: Tab through everything, visible focus, no traps, task completed.", "Built-in screen reader: heading list and link list make sense.", "Plain language: the reader can say what to do and by when; exact names kept; no filler.", "Accessibility rationale saved with the file: barrier, who it affected, change, verification, what remains."] },
      { heading: "Documents, PDF files and email", items: ["Build the document with real styles first; a PDF made from a styled document keeps its structure. A scanned page is a picture until text recognition runs and someone checks the result.", "In the PDF: alternative text on every image, header rows marked in every table, a label on every form field, then the built-in accessibility check with its report kept alongside the file.", "If a PDF cannot be repaired, provide the same content as an accessible document rather than distributing the picture.", "Email: plain text for routine messages. If you format, use real headings and lists, describe any image, and never let color carry the meaning alone.", "A subject line that says what the message is and what to do by when; attachments checked before sending, and never a picture-only file without an accessible version."] },
    ],
  },
  sources: [
    { title: "W3C Web Accessibility Initiative, Accessibility Fundamentals", href: "https://www.w3.org/WAI/fundamentals/", note: "Introduction to how people with disabilities use digital content and the principles behind the web accessibility guidelines." },
    { title: "W3C Web Accessibility Initiative, Images Tutorial", href: "https://www.w3.org/WAI/tutorials/images/", note: "Guidance on informative, decorative, functional and complex images, and how to write text alternatives for each." },
    { title: "W3C Web Accessibility Initiative, Writing for Web Accessibility", href: "https://www.w3.org/WAI/tips/writing/", note: "Practical tips on headings, link text, alt text and plain writing for content authors." },
    { title: "Section508.gov, Create Accessible Digital Products", href: "https://www.section508.gov/create/", note: "Federal how-to guidance for accessible documents, presentations, PDFs, forms and video." },
    { title: "Plain Language Action and Information Network, plainlanguage.gov", href: "https://www.plainlanguage.gov/", note: "Federal plain-language guidelines and examples for public communication." },
    { title: "U.S. Access Board", href: "https://www.access-board.gov/", note: "The federal standards for information and communication technology that Section 508 and comparable state standards draw on." },
  ],
};

export default pack;
