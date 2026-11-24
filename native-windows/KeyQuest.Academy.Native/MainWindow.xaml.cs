using System.Windows;
namespace KeyQuest.Academy.Native
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void Home_Click(object sender, RoutedEventArgs e)
        {
            PageEyebrow.Text = "WELCOME"; PageTitle.Text = "Learn to type with confidence.";
            PageDescription.Text = "Build accuracy, develop speed, and make progress one lesson at a time.";
            StatusText.Text = "Home — native interface scaffold.";
        }
        private void Lessons_Click(object sender, RoutedEventArgs e)
        {
            PageEyebrow.Text = "LESSON LIBRARY"; PageTitle.Text = "Your typing lessons";
            PageDescription.Text = "The native lesson catalogue and full 21-lesson curriculum will be implemented in the next development stage.";
            StatusText.Text = "Lesson catalogue is not connected yet.";
        }
        private void Practice_Click(object sender, RoutedEventArgs e)
        {
            PageEyebrow.Text = "TYPING PRACTICE"; PageTitle.Text = "Practice with purpose";
            PageDescription.Text = "The native typing engine, keyboard guide, accuracy scoring and lesson exercises are planned next.";
            StatusText.Text = "Typing engine is not connected yet.";
        }
        private void Progress_Click(object sender, RoutedEventArgs e)
        {
            PageEyebrow.Text = "YOUR PROGRESS"; PageTitle.Text = "Every keystroke counts";
            PageDescription.Text = "Local progress storage, completed lessons and typing statistics will be implemented after the lesson and practice modules.";
            StatusText.Text = "Progress storage is not connected yet.";
        }
    }
}
