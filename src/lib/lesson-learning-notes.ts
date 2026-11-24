export interface LessonLearningNotes {
  objective: string;
  keyIdeas: string[];
  commonMistakes: string[];
  selfCheck: string;
  successCriteria: string;
  transferTask: string;
}

export const LESSON_LEARNING_NOTES: Record<string, LessonLearningNotes> = {
  "home-row-basics": {
    objective: "Place all eight fingers on their home keys and return to that position after each reach.",
    keyIdeas: ["Use the raised marks on F and J to find your starting position.", "Keep your fingers curved and your wrists relaxed.", "Use your thumbs for the space bar."],
    commonMistakes: ["Looking down after every keystroke instead of using the F and J markers.", "Pressing keys hard or lifting the whole hand away from the home row.", "Mixing up the ring, middle and index fingers."],
    selfCheck: "Without looking down, can you place both index fingers on F and J, then type asdf jkl; with the assigned fingers?",
    successCriteria: "Locate F and J by touch, place all eight fingers correctly, and type the home-row pattern twice without looking down.",
    transferTask: "Reset both index fingers on F and J, then type “sad dad asks” while keeping your eyes on the screen."
  },
  "left-hand-home-row": {
    objective: "Build a reliable movement pattern for A, S, D and F using the left pinky, ring, middle and index fingers.",
    keyIdeas: ["Keep the right hand relaxed while practising the left.", "Return each finger to its home key after a reach.", "Use short patterns before moving on to words."],
    commonMistakes: ["Using the index finger for several left-hand keys.", "Sliding the entire hand sideways instead of moving one finger.", "Rushing the pattern before the fingers feel familiar."],
    selfCheck: "Can you type aaa sss ddd fff and then fad sad dad without looking at the keyboard?",
    successCriteria: "Produce A, S, D and F with their assigned fingers and return each finger to its starting key.",
    transferTask: "Type “fad sad dad” three times; pause to reset your hand if you lose the home position."
  },
  "right-hand-home-row": {
    objective: "Control J, K, L and semicolon with the correct right-hand fingers.",
    keyIdeas: ["Use the raised mark on J to orient the right index finger.", "Assign J to index, K to middle, L to ring and semicolon to pinky.", "Keep the left hand resting comfortably."],
    commonMistakes: ["Using the right index finger for both J and K.", "Reaching for semicolon with the ring finger.", "Losing the home position after typing a word."],
    selfCheck: "Can you type jkl; ;lkj jill; kill; while keeping each finger in its assigned zone?",
    successCriteria: "Use J, K, L and semicolon independently without borrowing the neighbouring finger.",
    transferTask: "Type “jill; ask;” slowly, checking that the right pinky reaches the semicolon."
  },
  "home-row-words": {
    objective: "Combine home-row keys into familiar words and short sentences while keeping a steady rhythm.",
    keyIdeas: ["Read a word before typing it rather than searching letter by letter.", "Use a thumb for each space.", "Prioritise clean words over a fast first attempt."],
    commonMistakes: ["Pausing completely between every letter.", "Forgetting spaces between words.", "Looking down when a familiar word feels difficult."],
    selfCheck: "Can you type 'a sad lad asks a lass' with clear spaces and without looking down?",
    successCriteria: "Combine home-row letters into readable words and include a deliberate space between each word.",
    transferTask: "Type “a sad lad asks” twice, then read the result and check every space."
  },
  "top-row-keys": {
    objective: "Reach from the home row to the top row with the correct finger, then return to the home position.",
    keyIdeas: ["Move the finger assigned to the key, not the whole hand.", "Return to the home row after each reach.", "Practise left and right top-row groups separately before combining them."],
    commonMistakes: ["Stretching the wrist or shifting the whole hand upward.", "Using the wrong finger for Q, W, E or R.", "Leaving fingers hovering far from their home keys."],
    selfCheck: "Can you type qwer uiop slowly and return each finger to its home key after the reach?",
    successCriteria: "Reach the top-row keys with the assigned fingers and return to the home row without shifting the whole hand.",
    transferTask: "Practise “red fur” and “our tip” slowly, noticing which finger moves for each top-row letter."
  },
  "bottom-row-keys": {
    objective: "Reach down to the bottom row accurately while keeping the other fingers relaxed near home row.",
    keyIdeas: ["Move one finger down at a time.", "Return to the home row after each key.", "Keep the wrists neutral and avoid pulling the hands toward the keyboard edge."],
    commonMistakes: ["Dropping the whole hand to reach Z or slash.", "Confusing the index-finger bottom-row keys V, B, N and M.", "Typing faster than you can reliably return to home position."],
    selfCheck: "Can you type zxcv and bnm, with the intended fingers and a controlled return to home row?",
    successCriteria: "Reach bottom-row letters with the correct fingers while keeping the rest of the hand relaxed.",
    transferTask: "Type “mix cab” and “van” slowly, then check that each bottom-row reach returns to its home position."
  },
  "mixed-rows": {
    objective: "Move between the top, home and bottom rows without losing finger placement.",
    keyIdeas: ["Use the home row as your reference between reaches.", "Read short groups ahead to prepare each movement.", "Keep the hand relaxed while individual fingers travel between rows."],
    commonMistakes: ["Moving the whole hand for every row change.", "Forgetting which finger owns a key after switching rows.", "Speeding up when the pattern becomes unfamiliar."],
    selfCheck: "Can you type 'we can make typing feel easy' while keeping your eyes on the screen?",
    successCriteria: "Move between all three letter rows while maintaining finger ownership and a stable home position.",
    transferTask: "Type “we can make typing feel easy” twice without looking down; note which row transition needs another drill."
  },
  "common-words": {
    objective: "Type frequently used words with fewer pauses and consistent spacing.",
    keyIdeas: ["Recognise common letter patterns as groups.", "Use a steady pace through longer words.", "Keep spaces deliberate so words remain readable."],
    commonMistakes: ["Guessing a word and skipping or swapping letters.", "Rushing the final letters of a longer word.", "Adding inconsistent spaces between words."],
    selfCheck: "Can you type 'people learn better when they practise' in one steady, accurate rhythm?",
    successCriteria: "Type familiar words as complete patterns while keeping letter order and spacing accurate.",
    transferTask: "Type “people learn better when they practise” once at a comfortable pace and inspect any word you hesitated over."
  },
  "capital-letters": {
    objective: "Produce uppercase letters by holding the Shift key with the hand opposite the letter being typed.",
    keyIdeas: ["Use left Shift for letters typed by the right hand.", "Use right Shift for letters typed by the left hand.", "Release Shift after the capital letter and return to normal typing."],
    commonMistakes: ["Using the same hand for Shift and the letter when it causes awkward reaching.", "Holding Caps Lock accidentally.", "Forgetting that names and place names need consistent capitalisation."],
    selfCheck: "Can you type 'Lagos Abuja Kano Nigeria' using the opposite Shift key for each capital?",
    successCriteria: "Produce capitals with the opposite Shift key and release Shift cleanly after each capital.",
    transferTask: "Type “Lagos, Abuja and Kano” and check each initial capital and comma."
  },
  "numbers-row": {
    objective: "Reach the number row with control and keep multi-digit groups accurate.",
    keyIdeas: ["Use the finger assigned to each number position.", "Return your fingers toward the home row after each reach.", "Read number groups carefully before typing."],
    commonMistakes: ["Transposing adjacent digits in a number.", "Losing the home-row reference after reaching upward.", "Treating spaces inside reference numbers as optional."],
    selfCheck: "Can you type '2026 1999 080 1234' and verify every digit and space?",
    successCriteria: "Enter short number groups without transposing digits or losing spaces.",
    transferTask: "Type “2026 1999 080 1234” once, then compare each digit and separator against the source."
  },
  "punctuation": {
    objective: "Enter common punctuation marks and the required spaces consistently.",
    keyIdeas: ["Notice whether a symbol requires Shift on your keyboard layout.", "In ordinary English text, place a space after commas and sentence-ending punctuation.", "Check the active keyboard layout if a symbol appears in an unexpected position."],
    commonMistakes: ["Omitting a comma or full stop while concentrating on letters.", "Adding a space before punctuation when it belongs to the previous word.", "Forgetting Shift for question marks or quotation marks."],
    selfCheck: "Can you type 'Hello, world. How are you?' with the punctuation and spacing in the right places?",
    successCriteria: "Type a short sentence with commas, full stops and question marks in the correct positions.",
    transferTask: "Copy “Hello, Ada. Are you ready?” and check punctuation placement and spaces."
  },
  "short-sentences": {
    objective: "Type complete sentences while maintaining a comfortable rhythm from the first word to the final punctuation mark.",
    keyIdeas: ["Read a short phrase ahead before typing it.", "Use a capital letter at the start and appropriate punctuation at the end.", "Keep spaces consistent between words."],
    commonMistakes: ["Typing one character at a time without reading ahead.", "Forgetting the initial capital or final punctuation.", "Rushing the last few words of a sentence."],
    selfCheck: "Can you type 'Practice every day and your typing will improve.' with its capital letter and full stop?",
    successCriteria: "Type a complete sentence with its initial capital, word spacing and final punctuation.",
    transferTask: "Copy one short sentence twice; on the second pass, read a few words ahead while preserving accuracy."
  },
  "paragraphs": {
    objective: "Maintain accuracy and attention across several connected sentences.",
    keyIdeas: ["Read ahead in small phrases while keeping your place.", "Keep a relaxed posture throughout the passage.", "Use punctuation as a guide to the sentence structure."],
    commonMistakes: ["Losing your place after a full stop.", "Increasing speed until accuracy drops near the end.", "Ignoring posture and tension during a longer passage."],
    selfCheck: "Can you type a two-sentence paragraph and then review it for missing words, spaces and punctuation?",
    successCriteria: "Maintain your place and consistent spacing across several connected sentences.",
    transferTask: "Type a three-sentence paragraph, then compare it line by line with the source for omissions and punctuation."
  },
  "accuracy-training": {
    objective: "Identify recurring errors and practise carefully enough to reduce them.",
    keyIdeas: ["Notice which letters or combinations cause repeated mistakes.", "Slow down until the movement is reliable.", "Compare several similar attempts rather than relying on one score."],
    commonMistakes: ["Trying to fix many different errors at once.", "Rushing to recover time after a mistake.", "Judging improvement from speed while ignoring accuracy."],
    selfCheck: "Can you type 'their there these those through' carefully and identify any word that repeatedly causes an error?",
    successCriteria: "Identify one recurring error pattern and practise it with fewer repeated mistakes across comparable attempts.",
    transferTask: "Choose the letter pair or word that caused the most errors, drill it slowly for one minute, then retest it in a sentence."
  },
  "speed-building": {
    objective: "Increase typing pace gradually while keeping keystrokes controlled and accurate.",
    keyIdeas: ["Start with a comfortable rhythm before attempting a faster burst.", "Increase pace in small steps.", "Return to a controlled speed if errors begin to rise."],
    commonMistakes: ["Typing in short bursts followed by long pauses.", "Chasing a WPM target at the cost of accuracy.", "Tensing the hands or shoulders when trying to go faster."],
    selfCheck: "Can you complete the same short passage twice, keeping the second attempt slightly faster without losing accuracy?",
    successCriteria: "Make a small, controlled increase in pace without a noticeable loss of accuracy or comfort.",
    transferTask: "Complete the same short passage twice; make the second attempt only slightly quicker and compare both accuracy results."
  },
  "long-form-typing": {
    objective: "Build comfortable stamina for longer passages and realistic writing tasks.",
    keyIdeas: ["Keep your posture relaxed and wrists neutral.", "Maintain a repeatable pace rather than sprinting at the beginning.", "Pause briefly if your hands become tense."],
    commonMistakes: ["Starting too quickly and slowing sharply near the end.", "Skipping punctuation or spaces in longer sentences.", "Continuing through discomfort instead of taking a break."],
    selfCheck: "Can you complete a full paragraph at a steady pace and review it without finding repeated spacing or punctuation errors?",
    successCriteria: "Complete a longer passage at a steady pace while maintaining posture, spacing and punctuation.",
    transferTask: "Type a full paragraph without sprinting at the start, then review the final lines for fatigue-related errors."
  },
  "timed-challenges": {
    objective: "Apply familiar typing skills under a time limit without treating speed as more important than correct text.",
    keyIdeas: ["Use the opening moments to settle into a rhythm.", "Keep reading ahead while typing.", "Treat the timer as a practice constraint, not a reason to panic."],
    commonMistakes: ["Rushing immediately when the timer starts.", "Ignoring errors to protect the clock.", "Changing finger placement when the pace increases."],
    selfCheck: "Can you finish a timed passage while keeping your rhythm steady and correcting mistakes calmly?",
    successCriteria: "Finish a timed passage with a settled rhythm and deliberate corrections rather than panic-driven bursts.",
    transferTask: "Take one 60-second test, note WPM and accuracy, rest briefly, then repeat under the same conditions for comparison."
  },
  "professional-typing": {
    objective: "Practise clear, accurate typing in workplace-style notes, updates and email messages.",
    keyIdeas: ["Use clear sentences and consistent punctuation.", "Pay attention to greetings, names and paragraph spacing.", "Proofread the message after typing."],
    commonMistakes: ["Missing capital letters in greetings or names.", "Leaving out punctuation in longer messages.", "Confusing typing speed with the clarity of the message."],
    selfCheck: "Can you type a short professional message with a greeting, a clear update and a polite closing?",
    successCriteria: "Produce a short workplace-style message with a greeting, clear information, readable paragraphs and a polite close.",
    transferTask: "Type a brief meeting update, then proofread names, dates, punctuation and the closing before considering it finished."
  },
  "speed-accuracy-mastery": {
    objective: "Combine a controlled pace, precise keystrokes and comfortable endurance in one session.",
    keyIdeas: ["Keep accuracy stable as you increase pace.", "Use a relaxed posture and consistent finger movement.", "Review the complete passage, not only the final WPM."],
    commonMistakes: ["Focusing only on the best speed result.", "Allowing accuracy to fall during longer passages.", "Using unnecessary hand tension to maintain a faster pace."],
    selfCheck: "Can you complete a longer passage at a consistent pace and explain whether your accuracy remained steady?",
    successCriteria: "Sustain a comfortable pace through a longer task and explain how accuracy changed as you typed.",
    transferTask: "Complete a two-minute passage and record what happened to your rhythm and accuracy in the final 30 seconds."
  },
  "editing-and-proofreading": {
    objective: "Type and review text with careful attention to punctuation, capitalisation, spacing and corrections.",
    keyIdeas: ["Read the sentence once for meaning and again for typing errors.", "Use the opposite Shift key for capitals.", "Correct a mistake calmly, then continue from the right position."],
    commonMistakes: ["Fixing a typo but leaving a duplicated space.", "Overlooking commas or full stops during a quick review.", "Reading what you intended to type instead of what is actually on screen."],
    selfCheck: "After typing 'Please review the note, then send your reply.', can you check every word, comma and full stop against the source?",
    successCriteria: "Compare typed text with its source and identify missing words, spacing, capitalisation and punctuation errors.",
    transferTask: "Copy a two-sentence note, then proofread it in a separate pass while looking only for one error category at a time."
  },
  "forms-and-data-entry": {
    objective: "Enter mixed letters, numbers, dates and decimal amounts accurately in structured sample records.",
    keyIdeas: ["Read each field before entering it.", "Keep reference numbers, dates and amounts in their correct groups.", "Double-check decimal points and spaces."],
    commonMistakes: ["Transposing digits in reference numbers.", "Replacing a decimal point with a comma or omitting it.", "Putting information in the wrong field because you did not pause between groups."],
    selfCheck: "Can you type 'Item A12 Quantity 4 Price NGN 2500.50' and verify the letters, digits and decimal point?",
    successCriteria: "Transfer mixed text, numbers and decimal amounts into the correct fields without changing their order or format.",
    transferTask: "Enter a sample record with an item code, quantity and decimal price, then verify each field character by character."
  }
};
