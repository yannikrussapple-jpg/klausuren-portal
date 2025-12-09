// Mock In-Memory Database (statt MongoDB für lokale Entwicklung)

interface MockClass {
  _id: string
  name: string
}

interface MockTeacher {
  _id: string
  name: string
  classId: string
}

interface MockExam {
  _id: string
  title: string
  classId: string
  teacherId: string
  number: number
  fileUrl: string
  price: number
  isPaid: boolean
}

let classes: MockClass[] = []
let teachers: MockTeacher[] = []
let exams: MockExam[] = []
let initialized = false

function generateId() {
  return Math.random().toString(36).substring(7)
}

export function initMockDB() {
  if (initialized) return
  initialized = true

  // Create classes
  const classNames = ['10.', '11.', '12.', '13.']
  classes = classNames.map(name => ({ _id: generateId(), name }))

  // Create teachers for each class
  const teacherNames = ['Herr Bär', 'Herr Schuster', 'Herr Uka']
  teachers = []
  classes.forEach(c => {
    teacherNames.forEach(name => {
      teachers.push({ _id: generateId(), name, classId: c._id })
    })
  })

  // Create exams
  const subjects = ['Mathematik', 'Englisch', 'Deutsch', 'Biologie', 'Physik', 'Geschichte', 'Chemie', 'Informatik']
  const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  
  exams = []
  teachers.forEach(t => {
    for (let i = 1; i <= 2; i++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)]
      exams.push({
        _id: generateId(),
        title: `${subject} Klausur`,
        classId: t.classId,
        teacherId: t._id,
        number: i,
        fileUrl: pdfUrl,
        price: 0,
        isPaid: true, // Keine Zahlpflicht
      })
    }
  })
}

export function getClasses(): MockClass[] {
  initMockDB()
  return classes
}

export function getTeachers(classId?: string): MockTeacher[] {
  initMockDB()
  if (classId) {
    return teachers.filter(t => t.classId === classId)
  }
  return teachers
}

export function getExams(classId?: string, teacherId?: string): any[] {
  initMockDB()
  let filtered = exams
  if (classId) {
    filtered = filtered.filter(e => e.classId === classId)
  }
  if (teacherId) {
    filtered = filtered.filter(e => e.teacherId === teacherId)
  }
  // Populate teacher info
  return filtered.map(e => ({
    ...e,
    teacherId: teachers.find(t => t._id === e.teacherId),
  }))
}

export function createExam(data: any): MockExam {
  initMockDB()
  const exam: MockExam = {
    _id: generateId(),
    title: data.title,
    classId: data.classId,
    teacherId: data.teacherId,
    number: data.number || 1,
    fileUrl: data.fileUrl,
    price: data.price || 0,
    isPaid: false,
  }
  exams.push(exam)
  return exam
}
