using System.Windows;
using System.Windows.Controls;

namespace KeyQuest.Academy.Native
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            LessonList.ItemsSource = LessonCatalog.All;
            if (LessonCatalog.All.Count > 0) LessonList.SelectedIndex = 0;
        }

        private void ShowHome()
        {
            HomePanel.Visibility = Visibility.Visible;
            LessonPanel.Visibility = Visibility.Collapsed;
            InfoPanel.Visibility = Visibility.Collapsed;
        }

        private void Home_Click(object sender, RoutedEventArgs e) { ShowHome(); }

        private void Lessons_Click(object sender, RoutedEventArgs e)
        {
            HomePanel.Visibility = Visibility.Collapsed;
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

        private void Practice_Click(object sender, RoutedEventArgs e)
        {
            HomePanel.Visibility = Visibility.Collapsed;
            LessonPanel.Visibility = Visibility.Collapsed;
            InfoPanel.Visibility = Visibility.Visible;
            InfoEyebrow.Text = "TYPING PRACTICE";
            InfoTitle.Text = "Practice engine is next";
            InfoDescription.Text = "The complete native lesson catalogue is now connected. Next we will build the typing input, live accuracy scoring, keyboard guide and lesson completion workflow.";
        }

        private void Progress_Click(object sender, RoutedEventArgs e)
        {
            HomePanel.Visibility = Visibility.Collapsed;
            LessonPanel.Visibility = Visibility.Collapsed;
            InfoPanel.Visibility = Visibility.Visible;
            InfoEyebrow.Text = "YOUR PROGRESS";
            InfoTitle.Text = "Progress tracking is planned next";
            InfoDescription.Text = "Local progress storage, completed lessons and typing statistics will be added after the native typing practice engine.";
        }
    }
}