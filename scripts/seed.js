const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/klausuren_db'
  await mongoose.connect(MONGODB_URI)

  const Class = require('../models/Class').default
  const Teacher = require('../models/Teacher').default
  const Exam = require('../models/Exam').default

  await Class.deleteMany({})
  await Teacher.deleteMany({})
  await Exam.deleteMany({})

  // Create classes 10., 11., 12., 13.
  const c10 = await Class.create({ name: '10.' })
  const c11 = await Class.create({ name: '11.' })
  const c12 = await Class.create({ name: '12.' })
  const c13 = await Class.create({ name: '13.' })

  // Create teachers for each class
  const teachers = {}
  for (const cls of [c10, c11, c12, c13]) {
    teachers[cls._id] = {
      baer: await Teacher.create({ name: 'Herr Bär', classId: cls._id }),
      schuster: await Teacher.create({ name: 'Herr Schuster', classId: cls._id }),
      uka: await Teacher.create({ name: 'Herr Uka', classId: cls._id }),
    }
  }

  // Create sample exams for each teacher in each class
  const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  const subjects = ['Mathematik', 'Englisch', 'Deutsch', 'Biologie', 'Physik', 'Geschichte']
  let examNum = 1
  
  for (const cls of [c10, c11, c12, c13]) {
    for (const teacherId of Object.values(teachers[cls._id]).map((t: any) => t._id)) {
      for (let i = 1; i <= 2; i++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)]
        await Exam.create({
          title: `${subject} Klausur`,
          classId: cls._id,
          teacherId,
          number: i,
          fileUrl: pdfUrl,
          price: 0,
        })
      }
    }
  }

  console.log('Seed finished')
  process.exit()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
