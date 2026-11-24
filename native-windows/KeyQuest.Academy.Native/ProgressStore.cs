using System;
using System.Collections.Generic;
using System.IO;
using System.Xml.Serialization;

namespace KeyQuest.Academy.Native
{
    [XmlRoot("KeyQuestProgress")]
    public sealed class ProgressData
    {
        [XmlArray("Completions")]
        [XmlArrayItem("Exercise")]
        public List<ProgressRecord> Records { get; set; }
        public ProgressData() { Records = new List<ProgressRecord>(); }
    }

    public sealed class ProgressRecord
    {
        public string LessonId { get; set; }
        public string LessonTitle { get; set; }
        public string ExerciseTitle { get; set; }
        public int BestWpm { get; set; }
        public double BestAccuracy { get; set; }
        public DateTime CompletedAt { get; set; }
        public ProgressRecord() { }
    }

    public sealed class ProgressStore
    {
        private readonly string folder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "KeyQuest Academy");
        private string FilePath { get { return Path.Combine(folder, "progress.xml"); } }
        private readonly ProgressData data = new ProgressData();
        public IList<ProgressRecord> Records { get { return data.Records.AsReadOnly(); } }

        public void Load()
        {
            try
            {
                if (!File.Exists(FilePath)) return;
                XmlSerializer serializer = new XmlSerializer(typeof(ProgressData));
                using (FileStream stream = File.OpenRead(FilePath))
                {
                    ProgressData loaded = serializer.Deserialize(stream) as ProgressData;
                    if (loaded != null && loaded.Records != null)
                    {
                        data.Records.Clear();
                        data.Records.AddRange(loaded.Records);
                    }
                }
            }
            catch { }
        }

        public void RecordCompletion(string lessonId, string lessonTitle, string exerciseTitle, int wpm, double accuracy)
        {
            ProgressRecord existing = data.Records.Find(r => r.LessonId == lessonId && r.ExerciseTitle == exerciseTitle);
            if (existing == null)
            {
                existing = new ProgressRecord { LessonId = lessonId, LessonTitle = lessonTitle, ExerciseTitle = exerciseTitle };
                data.Records.Add(existing);
            }
            existing.BestWpm = Math.Max(existing.BestWpm, wpm);
            existing.BestAccuracy = Math.Max(existing.BestAccuracy, accuracy);
            existing.CompletedAt = DateTime.Now;
        }

        public void Save()
        {
            try
            {
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
                XmlSerializer serializer = new XmlSerializer(typeof(ProgressData));
                using (FileStream stream = File.Create(FilePath)) serializer.Serialize(stream, data);
            }
            catch { }
        }
    }
}
