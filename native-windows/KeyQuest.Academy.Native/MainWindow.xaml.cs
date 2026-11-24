using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;
using System.Linq;

namespace KeyQuest.Academy.Native
{
    public partial class MainWindow : Window
    {
        private readonly Stopwatch practiceClock = new Stopwatch();
        private readonly DispatcherTimer practiceTimer = new DispatcherTimer();
        private string activeTarget = String.Empty;
        private bool exerciseCompleted;
        private readonly ProgressStore progressStore = new ProgressStore();

        public MainWindow()
        {
            InitializeComponent();
            progressStore.Load();
            LessonList.ItemsSource = LessonCatalog.All;
            if (LessonCatalog.All.Count > 0) LessonList.SelectedIndex = 0;
            practiceTimer.Interval = TimeSpan.FromSeconds(1);
            practiceTimer.Tick += PracticeTimer_Tick;
        }

        private void ShowHome()
        {
            practiceTimer.Stop();
            HomePanel.Visibility = Visibility.Visible;
            LessonPanel.Visibility = Visibility.Collapsed;
            PracticePanel.Visibility = Visibility.Collapsed;
            InfoPanel.Visibility = Visibility.Collapsed;
        }

        private void Home_Click(object sender, RoutedEventArgs e) { ShowHome(); }

        private void Lessons_Click(object sender, RoutedEventArgs e)
        {
            HomePanel.Visibility = Visibility.Collapsed;
            PracticePanel.Visibility = Visibility.Collapsed;
            InfoPanel.Visibility = Visibility.Collapsed;
            LessonPanel.Visibility = Visibility.Visible;
            if (LessonList.SelectedIndex < 0 && LessonCatalog.All.Count > 0) LessonList.SelectedIndex = 0;
        }

        private void LessonList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            TypingLesson lesson = LessonList.SelectedItem as TypingLesson;
            if (lesson == null) return;
            SelectedLevel.Text = lesson.Level.ToUpperInvariant();
            SelectedLessonTitle.Text = lesson.Title;
            SelectedLessonDescription.Text = lesson.Description;
            SelectedLessonTime.Text = lesson.EstimatedMinutes + " minute estimate  •  " + lesson.Exercises.Count + " exercises";
            ExerciseList.ItemsSource = lesson.Exercises;
            if (lesson.Exercises.Count > 0) ExerciseList.SelectedIndex = 0;
        }

        private void ExerciseList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            LessonExercise exercise = ExerciseList.SelectedItem as LessonExercise;
            if (exercise == null) return;
            ExerciseTitle.Text = exercise.Title;
            ExerciseTarget.Text = exercise.Target;
            ExerciseInstruction.Text = exercise.Instruction;
        }

        private void StartExercise_Click(object sender, RoutedEventArgs e)
        {
            LessonExercise exercise = ExerciseList.SelectedItem as LessonExercise;
            if (exercise == null) return;
            activeTarget = exercise.Target;
            exerciseCompleted = false;
            practiceClock.Reset();
            TypingInput.Clear();
            PracticeTitle.Text = exercise.Title;
            PracticeInstruction.Text = exercise.Instruction;
            PracticeTarget.Text = activeTarget;
            AccuracyValue.Text = "100%";
            SpeedValue.Text = "0 WPM";
            CharacterValue.Text = "0";
            PracticeStatus.Text = "Start typing when you are ready. You can use Backspace to correct mistakes.";
            LessonPanel.Visibility = Visibility.Collapsed;
            HomePanel.Visibility = Visibility.Collapsed;
            InfoPanel.Visibility = Visibility.Collapsed;
            PracticePanel.Visibility = Visibility.Visible;
            TypingInput.Focus();
        }

        private void TypingInput_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (String.IsNullOrEmpty(activeTarget)) return;
            string typed = TypingInput.Text ?? String.Empty;
            if (typed.Length > 0 && !practiceClock.IsRunning && !exerciseCompleted)
            {
                practiceClock.Start();
                practiceTimer.Start();
            }

            int correct = 0;
            int limit = Math.Min(typed.Length, activeTarget.Length);
            for (int i = 0; i < limit; i++)
                if (typed[i] == activeTarget[i]) correct++;

            double accuracy = typed.Length == 0 ? 100.0 : (double)correct / typed.Length * 100.0;
            AccuracyValue.Text = accuracy.ToString("0") + "%";
            CharacterValue.Text = typed.Length.ToString();
            UpdateSpeed(correct);

            if (!exerciseCompleted && String.Equals(typed, activeTarget, StringComparison.Ordinal))
            {
                exerciseCompleted = true;
                practiceClock.Stop();
                practiceTimer.Stop();
                UpdateSpeed(correct);
                PracticeStatus.Text = "Exercise completed. Accuracy: " + accuracy.ToString("0.0") + "%. Your result has been saved on this computer.";
                TypingLesson completedLesson = LessonList.SelectedItem as TypingLesson;
                LessonExercise completedExercise = ExerciseList.SelectedItem as LessonExercise;
                if (completedLesson != null && completedExercise != null)
                {
                    int finalWpm = Math.Max(0, (int)Math.Round((correct / 5.0) / Math.Max(practiceClock.Elapsed.TotalMinutes, 0.0001)));
                    progressStore.RecordCompletion(completedLesson.Id, completedLesson.Title, completedExercise.Title, finalWpm, accuracy);
                    progressStore.Save();
                }
            }
            else if (typed.Length > activeTarget.Length)
            {
                PracticeStatus.Text = "You have typed beyond the passage. Use Backspace to correct it.";
            }
            else if (typed.Length > 0)
            {
                PracticeStatus.Text = "Keep going. Correct characters: " + correct + " of " + typed.Length + ".";
            }
        }

        private void PracticeTimer_Tick(object sender, EventArgs e)
        {
            string typed = TypingInput.Text ?? String.Empty;
            int correct = 0;
            int limit = Math.Min(typed.Length, activeTarget.Length);
            for (int i = 0; i < limit; i++)
                if (typed[i] == activeTarget[i]) correct++;
            UpdateSpeed(correct);
        }

        private void UpdateSpeed(int correctCharacters)
        {
            double minutes = practiceClock.Elapsed.TotalMinutes;
            int wpm = minutes <= 0 ? 0 : (int)Math.Round((correctCharacters / 5.0) / minutes);
            SpeedValue.Text = Math.Max(0, wpm) + " WPM";
        }

        private void BackToLessons_Click(object sender, RoutedEventArgs e)
        {
            practiceTimer.Stop();
            PracticePanel.Visibility = Visibility.Collapsed;
            HomePanel.Visibility = Visibility.Collapsed;
            InfoPanel.Visibility = Visibility.Collapsed;
            LessonPanel.Visibility = Visibility.Visible;
        }

        private void Practice_Click(object sender, RoutedEventArgs e)
        {
            HomePanel.Visibility = Visibility.Collapsed;
            LessonPanel.Visibility = Visibility.Collapsed;
            PracticePanel.Visibility = Visibility.Collapsed;
            InfoPanel.Visibility = Visibility.Visible;
            InfoEyebrow.Text = "TYPING PRACTICE";
            InfoTitle.Text = "Choose a lesson to begin";
            InfoDescription.Text = "Open Lessons, select an exercise, and choose Start this exercise to use the native typing practice screen.";
        }

        private void Progress_Click(object sender, RoutedEventArgs e)
        {
            HomePanel.Visibility = Visibility.Collapsed;
            LessonPanel.Visibility = Visibility.Collapsed;
            PracticePanel.Visibility = Visibility.Collapsed;
            InfoPanel.Visibility = Visibility.Visible;
            InfoEyebrow.Text = "YOUR PROGRESS";
            int completed = progressStore.Records.Count;
            int bestWpm = progressStore.Records.Count == 0 ? 0 : progressStore.Records.Max(r => r.BestWpm);
            double bestAccuracy = progressStore.Records.Count == 0 ? 0 : progressStore.Records.Max(r => r.BestAccuracy);
            InfoTitle.Text = "Your learning progress";
            string recent = String.Join(Environment.NewLine, progressStore.Records.OrderByDescending(r => r.CompletedAt).Take(8)
                .Select(r => "• " + r.LessonTitle + " — " + r.ExerciseTitle + " (" + r.BestWpm + " WPM, " + r.BestAccuracy.ToString("0") + "%)"));
            InfoDescription.Text = "Completed exercises: " + completed
                + Environment.NewLine + "Best speed: " + bestWpm + " WPM"
                + Environment.NewLine + "Best accuracy: " + bestAccuracy.ToString("0") + "%"
                + Environment.NewLine + Environment.NewLine + "RECENT COMPLETIONS"
                + (String.IsNullOrEmpty(recent) ? Environment.NewLine + "No completed exercises yet. Finish an exercise to save your first result." : Environment.NewLine + recent)
                + Environment.NewLine + Environment.NewLine + "Progress is stored locally in your Windows user profile. It does not require an internet connection.";
        }
    }
}