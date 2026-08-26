const fs = require('fs');
const urls = `
https://streamtape.com/v/3qoo18oAjWHdWxo/04_-_Marking_Criteria_Errors_and_Proofreading.ts
https://streamtape.com/v/P3WjpALdDGhbyg/05_-_Simple_and_Complex_Sentences.ts
https://streamtape.com/v/gRVXV3OypoUqMMj/03_-_Understand_the_Purpose_of_IELTS.ts
https://streamtape.com/v/akAmRlJRVQHxrZj/06_-_Subject_Verb_Agreement.ts
https://streamtape.com/v/DeJWGQqm4aHk9jb/02_-_Focus_on_What_Matters.ts
https://streamtape.com/v/0zokXWAJ06FbbLO/07_-_Tenses.ts
https://streamtape.com/v/grD0y3kAqDIq7MG/08_-_Passive_and_Active_Voice.ts
https://streamtape.com/v/7qZ4QBRlAYIAOR6/09_-_Articles.ts
https://streamtape.com/v/p8V89WpPr2HrZgR/10_-_Improve_Your_Grammar.ts
https://streamtape.com/v/zpzJYejMgRTYrbr/01_-_Use_Your_Time_Wisely.ts
https://streamtape.com/v/lwM6vmeVZMTZeD/13_-_Paraphrasing.ts
https://streamtape.com/v/AqL8Kp6vWwUXr6b/14_-_Higher_Level_Vocabulary.ts
https://streamtape.com/v/O1BV6YVPRaSZ2Pv/16_-_Collocations.ts
https://streamtape.com/v/kL7djez3OzcOJbL/18_-_Keep_It_Simple.ts
https://streamtape.com/v/O64rk0keqBFZjRQ/21_-_Pronounce_Each_Sound_Correctly.ts
https://streamtape.com/v/G24djPYAd4IY7Y/20_-_Individual_English_Sounds.ts
https://streamtape.com/v/9bzLW97qWwcaXBG/23_-_Grammatical_Intonation.ts
https://streamtape.com/v/MjklLWJLKjHmOWb/24_-_Maintain_Improvements_and_Test_Day.ts
https://streamtape.com/v/ewPreRq6DeHk7B/25_-_Master_IELTS_Listening_Strategies.ts
https://streamtape.com/v/aPQl1DgY3otxXev/26_-_Learn_from_Listening_Mistakes.ts
https://streamtape.com/v/MZMgG4RbLWimvQX/22_-_Sentence_Pronunciation_Features.ts
https://streamtape.com/v/ayzKWlLQQVU03R/19_-_Common_Mistakes_and_Resources.ts
https://streamtape.com/v/AqpRLqRe0aFXRQQ/30_-_Matching_Information.ts
https://streamtape.com/v/yrQ87rQ4Wbf1YQG/27_-_Summary_Completion.ts
https://streamtape.com/v/06vQ7D69XZUAJa/29_-_Sentence_Completion.ts
https://streamtape.com/v/aj1aQXXvjxIWzW/28_-_Multiple_Choice.ts
https://streamtape.com/v/Vmxovmbam3tKMJG/32_-_Forms_and_Notes_Completion.ts
https://streamtape.com/v/MrJk66BXx1smRM2/33_-_Prediction_Skills.ts
https://streamtape.com/v/4DG6PVL9v6hV3Z/34_-_Synonyms_and_Paraphrasing.ts
https://streamtape.com/v/OX2oa7rLalc6lm/31_-_Maps_and_Plans.ts
https://streamtape.com/v/YKyvZW9ZmvhvDgj/38_-_Learn_from_Reading_Mistakes.ts
https://streamtape.com/v/XoGZ3LVo7GIZe3/37_-_Master_IELTS_Reading_Strategies.ts
https://streamtape.com/v/kkoWxBBGxKiDYm/39_-_Matching_Headings.ts
https://streamtape.com/v/MyaLgWLwRwFwka/36_-_Band_8-9_Listening.ts
https://streamtape.com/v/owRgv1Bb2XfOQ2/43_-_Summary_Completion.ts
https://streamtape.com/v/BaKj3B9qmPTQ1x/41_-_Matching_Information.ts
https://streamtape.com/v/dP2z0pyo6kUkp69/42_-_Yes_No_Not_Given.ts
https://streamtape.com/v/6w4xpgWrvJH914q/40_-_True_False_Not_Given.ts
https://streamtape.com/v/4wvO6dJo2ptK38X/45_-_Reading_Test_Readiness.ts
https://streamtape.com/v/9B3jx88B08IBww/46_-_Skimming_and_Scanning.ts
https://streamtape.com/v/9414AewyPOfa4e6/48_-_Task_2_-_Analyse_Any_Question.ts
https://streamtape.com/v/zleazB44eXsk99/49_-_Task_2_-_Think_Like_an_Examiner.ts
https://streamtape.com/v/OoPvjjLm0msZbLL/47_-_Raise_Your_Reading_Score.ts
https://streamtape.com/v/bGpjQRGbXVIDmk/53_-_Task_2_-_Conclusions_and_Review.ts
https://streamtape.com/v/1WDDxD9ygqfeYeY/50_-_Task_2_-_Ideas_and_Fewer_Language_Errors.ts
https://streamtape.com/v/YB631vLbR3CvbPv/51_-_Task_2_-_Effective_Introductions.ts
https://streamtape.com/v/OJ4Q6v83BDTZO6D/52_-_Task_2_-_Main_Body_Paragraphs.ts
https://streamtape.com/v/wxVyoMRdLjSJ2aw/55_-_Task_2_-_Opinion_Essays_II.ts
https://streamtape.com/v/aVy6y908R1uxvyv/56_-_Task_2_-_Causes_and_Solutions.ts
https://streamtape.com/v/y2JPMJMjwYt18KX/57_-_Task_2_-_Advantages_and_Disadvantages_I.ts
https://streamtape.com/v/X2zvx81PQ9uDkjL/54_-_Task_2_-_Opinion_Essays_I.ts
https://streamtape.com/v/aqRLP9ggzJCM1Y/59_-_Task_1_Academic_-_Questions_and_Marking.ts
https://streamtape.com/v/DX0VYoayX3tk9jV/61_-_Task_1_Academic_-_Planning_Structure_and_Key_Features.ts
https://streamtape.com/v/jjyBpQjOvVuz9Lw/62_-_Task_1_Academic_-_Introductions_and_Overviews.ts
https://streamtape.com/v/vzYbqpLakwS4qX8/58_-_Task_2_-_Advantages_and_Disadvantages_II.ts
https://streamtape.com/v/LkkKDwRqyOSvxP/64_-_Task_1_Academic_-_Line_Graphs_and_Bar_Charts.ts
https://streamtape.com/v/kojLWVm9VJt8aV/63_-_Task_1_Academic_-_Details_Paragraphs.ts
https://streamtape.com/v/V6kX43DvAAuKpPA/66_-_Task_1_Academic_-_Multiple_Graphs.ts
https://streamtape.com/v/k9RLABaJabuPWg/65_-_Task_1_Academic_-_Pie_Charts_and_Tables.ts
https://streamtape.com/v/lQ17PKqe9aT71BD/67_-_Task_1_Academic_-_Grammar_and_Vocabulary.ts
https://streamtape.com/v/Jb04xlx7QaTjv3p/68_-_Task_1_Academic_-_Process_Diagrams.ts
https://streamtape.com/v/kzeAYZDm9xS8MQ/69_-_Task_1_Academic_-_Maps.ts
https://streamtape.com/v/jj3V8pOAwzHzZ8B/71_-_Speaking_Part_1.ts
https://streamtape.com/v/KeYjQ2XXQDu0VpL/70_-_Think_Like_an_Examiner.ts
https://streamtape.com/v/qjV8V6wAyDHKZQ/73_-_Speaking_Part_3.ts
https://streamtape.com/v/qZQPpP2V11haqq/74_-_Speaking_Vocabulary.ts
https://streamtape.com/v/0zd7JLwdjqibJ1A/75_-_Speaking_Grammar.ts
https://streamtape.com/v/1bZj3XewbKFee8Z/76_-_Speaking_Pronunciation.ts
https://streamtape.com/v/vQY6mDOQmBu49Jq/77_-_Fluency_and_Coherence.ts
https://streamtape.com/v/2OQ3O3PMKXCZ77V/78_-_Practice_and_Test_Day.ts
https://streamtape.com/v/V0x9Y9O196Cy38/11_-_Vocabulary_Improvement_Plan.ts
https://streamtape.com/v/wawZBqgOJDUJb6x/35_-_Practice_Listening_Effectively.ts
https://streamtape.com/v/lgjg2yAo6KC73e3/17_-_Synonyms.ts
https://streamtape.com/v/xPQqxP4JAYSk4ke/15_-_Accuracy.ts
https://streamtape.com/v/1JP6vgk0PXie4pR/44_-_Sentence_Completion.ts
https://streamtape.com/v/Qa69jYRPaRC01de/72_-_Speaking_Part_2_Strategy.ts
https://streamtape.com/v/a2aLpepPGeUWBy/60_-_Task_1_Academic_-_Analyse_Graphs_Charts_and_Tables.ts
https://streamtape.com/v/8DDJjzY3xXFoprj/12_-_Build_a_Vocabulary_Habit.ts
`.trim().split('\n');

const getSection = (lessonNumber) => {
  if (lessonNumber >= 1 && lessonNumber <= 3) return "Start and Study Mindset";
  if (lessonNumber >= 4 && lessonNumber <= 10) return "Grammar Foundation";
  if (lessonNumber >= 11 && lessonNumber <= 18) return "Vocabulary Foundation";
  if (lessonNumber >= 19 && lessonNumber <= 24) return "Pronunciation Foundation";
  if (lessonNumber >= 25 && lessonNumber <= 36) return "Listening";
  if (lessonNumber >= 37 && lessonNumber <= 47) return "Reading";
  if (lessonNumber >= 48 && lessonNumber <= 69) return "Writing: Academic IELTS";
  if (lessonNumber >= 70 && lessonNumber <= 78) return "Speaking";
  return "Other";
};

const videos = urls.map(url => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const videoId = parts[parts.length - 2];
  
  // Extract number and title
  const match = filename.match(/^(\d{2})_-_(.+)\.ts$/);
  if (!match) throw new Error("Format mismatch: " + filename);
  const lessonNumber = parseInt(match[1], 10);
  const title = match[2].replace(/_/g, ' ');
  
  return {
    id: videoId,
    lessonNumber,
    title,
    originalLink: url,
    embeddedLink: `https://streamtape.com/e/${videoId}/`,
    section: getSection(lessonNumber)
  };
});

videos.sort((a, b) => a.lessonNumber - b.lessonNumber);

fs.writeFileSync('src/data/videos.ts', `export const COURSE_SECTIONS = [
  "Start and Study Mindset",
  "Grammar Foundation",
  "Vocabulary Foundation",
  "Pronunciation Foundation",
  "Listening",
  "Reading",
  "Writing: Academic IELTS",
  "Speaking"
];

export interface Video {
  id: string;
  lessonNumber: number;
  title: string;
  originalLink: string;
  embeddedLink: string;
  section: string;
}

export const VIDEOS: Video[] = ${JSON.stringify(videos, null, 2)};
`);
console.log('Generated src/data/videos.ts');
