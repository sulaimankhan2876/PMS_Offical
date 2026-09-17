export const STUDENTS = []
export const TEACHERS = []
export const SUBJECTS = []
export const FEE_RECORDS = []
export const EXAM_RESULTS = []
export const ANNOUNCEMENTS = []
export const BOOKS = []
export const HOMEWORK = []
export const LMS_COURSES = [
  {
    id: 'lms_phys10',
    subject: 'Physics 10th',
    icon: '⚛️',
    color: '#3b82f6',
    chapters: [
      {
        title: 'Ch 10: Simple Harmonic Motion',
        progress: 80,
        quiz: true,
        resources: [
          {
            type: 'PDF Notes',
            title: 'SHM Formulas Cheat Sheet',
            date: 'Oct 12',
          },
          {
            type: 'Video Lecture',
            title: 'Pendulum Derivation',
            date: 'Oct 15',
          },
        ],
      },
      {
        title: 'Ch 11: Sound',
        progress: 30,
        quiz: false,
        resources: [
          { type: 'Presentation', title: 'Sound Waves Intro', date: 'Oct 20' },
        ],
      },
    ],
  },
]
export const EXPENSES = []
export const CLASSES_DATA = []

export const TIMETABLE_DATA = {
  times: [
    '8:00–8:45',
    '8:45–9:30',
    '9:30–10:15',
    '10:15–11:00',
    '11:00–11:20',
    '11:20–12:05',
    '12:05–12:50',
  ],
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  classSlots: {}, // Map of class name to 2D array of slots
}
