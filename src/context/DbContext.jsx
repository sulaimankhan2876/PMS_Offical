import { createContext, useContext, useState, useEffect } from 'react'
import {
  STUDENTS,
  TEACHERS,
  SUBJECTS,
  FEE_RECORDS,
  EXAM_RESULTS,
  ANNOUNCEMENTS,
  BOOKS,
  HOMEWORK,
  LMS_COURSES,
  EXPENSES,
  CLASSES_DATA,
  TIMETABLE_DATA,
} from '../utils/data.js'

const DbContext = createContext()

export function DbProvider({ children }) {
  // Helpers to get from localStorage or fallback
  const getLocal = (key, fallback) => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : fallback
    } catch (e) {
      return fallback
    }
  }

  // State definitions
  const [students, setStudents] = useState(() =>
    getLocal('pms_v2_students', STUDENTS)
  )
  const [teachers, setTeachers] = useState(() =>
    getLocal('pms_v2_teachers', TEACHERS)
  )
  const [subjects, setSubjects] = useState(() =>
    getLocal('pms_v2_subjects', SUBJECTS)
  )
  const [classes, setClasses] = useState(() =>
    getLocal('pms_v2_classes', CLASSES_DATA)
  )
  const [timetable, setTimetable] = useState(() => {
    const data = getLocal('pms_v2_timetable', TIMETABLE_DATA)
    if (!data.classSlots) {
      data.classSlots = {}
      // Optional migration: move old slots to a default class if they existed
      if (data.slots) {
        data.classSlots['Class 5'] = data.slots
        delete data.slots
      }
    }
    return data
  })
  const [feeRecords, setFeeRecords] = useState(() =>
    getLocal('pms_v2_fee_records', FEE_RECORDS)
  )
  const [examResults, setExamResults] = useState(() =>
    getLocal('pms_v2_exam_results', EXAM_RESULTS)
  )
  const [announcements, setAnnouncements] = useState(() =>
    getLocal('pms_v2_announcements', ANNOUNCEMENTS)
  )
  const [books, setBooks] = useState(() => getLocal('pms_v2_books', BOOKS))
  const [homework, setHomework] = useState(() =>
    getLocal('pms_v2_homework', HOMEWORK)
  )
  const [lmsCourses, setLmsCourses] = useState(() => {
    const data = getLocal('pms_v2_lms_courses', null)
    if (!data || data.length === 0) return LMS_COURSES
    return data
  })
  const [expenses, setExpenses] = useState(() =>
    getLocal('pms_v2_expenses', EXPENSES)
  )
  const [examConfig, setExamConfig] = useState(() => {
    const data = getLocal('pms_v2_exam_config', null)
    if (data && data['Mid-Term']) return data // Already migrated

    const legacyConfig =
      data && data.subjects
        ? data.subjects
        : [
            { name: 'Mathematics', max: 100 },
            { name: 'English', max: 100 },
            { name: 'Urdu', max: 100 },
            { name: 'Science', max: 100 },
            { name: 'Islamic Studies', max: 100 },
          ]

    return {
      'Mid-Term': { subjects: legacyConfig },
      'Final Exam': { subjects: legacyConfig },
      'Monthly Test': { subjects: [{ name: 'Test Subject', max: 20 }] },
      'Weekly Quiz': { subjects: [{ name: 'Quiz', max: 10 }] },
    }
  })

  // New modules: Complaints, Visitors, Online payments, System Logs
  const [complaints, setComplaints] = useState(() =>
    getLocal('pms_v2_complaints', [])
  )
  const [visitors, setVisitors] = useState(() =>
    getLocal('pms_v2_visitors', [])
  )
  const [onlinePayments, setOnlinePayments] = useState(() =>
    getLocal('pms_v2_online_payments', [])
  )

  const [attendance, setAttendance] = useState(() =>
    getLocal('pms_v2_attendance', {})
  ) // date -> studentId -> status

  // System Audit Logs
  const [auditLogs, setAuditLogs] = useState(() =>
    getLocal('pms_v2_audit_logs', [])
  )
  const [announcedResults, setAnnouncedResults] = useState(() =>
    getLocal('pms_v2_announced_results', [])
  )

  const [liveClasses, setLiveClasses] = useState(() =>
    getLocal('pms_v2_live_classes', [])
  )

  // Active Role and Profile
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentRole, setCurrentRole] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // --- LOCAL DATABASE SYNC SYSTEM ---
  const [dbLoaded, setDbLoaded] = useState(false)

  // 1. Initial Load from Local File DB
  useEffect(() => {
    fetch('/api/load')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          if (data.students) setStudents(data.students)
          if (data.teachers) setTeachers(data.teachers)
          if (data.subjects) setSubjects(data.subjects)
          if (data.classes) setClasses(data.classes)
          if (data.timetable) setTimetable(data.timetable)
          if (data.feeRecords) setFeeRecords(data.feeRecords)
          if (data.examResults) setExamResults(data.examResults)
          if (data.announcements) setAnnouncements(data.announcements)
          if (data.books) setBooks(data.books)
          if (data.homework) setHomework(data.homework)
          if (data.lmsCourses) setLmsCourses(data.lmsCourses)
          if (data.expenses) setExpenses(data.expenses)
          if (data.examConfig) setExamConfig(data.examConfig)
          if (data.complaints) setComplaints(data.complaints)
          if (data.visitors) setVisitors(data.visitors)
          if (data.onlinePayments) setOnlinePayments(data.onlinePayments)
          if (data.attendance) setAttendance(data.attendance)
          if (data.auditLogs) setAuditLogs(data.auditLogs)
          if (data.announcedResults) setAnnouncedResults(data.announcedResults)
          if (data.liveClasses) setLiveClasses(data.liveClasses)
          console.log('Database successfully loaded from physical file!')
        } else {
          console.log('No physical database found. Using defaults.')
        }
      })
      .catch((err) =>
        console.log(
          'Physical database sync skipped (Dev Server Plugin not running or fetch failed).'
        )
      )
      .finally(() => setDbLoaded(true))
  }, [])

  // 2. Continuous Sync to Local File DB
  useEffect(() => {
    if (!dbLoaded) return // Prevent overwriting DB before initial load

    const fullDbState = {
      students,
      teachers,
      subjects,
      classes,
      timetable,
      feeRecords,
      examResults,
      announcements,
      books,
      homework,
      lmsCourses,
      expenses,
      examConfig,
      complaints,
      visitors,
      onlinePayments,
      attendance,
      auditLogs,
      announcedResults,
      liveClasses,
    }

    // Save to Local physical file (database.json)
    fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullDbState),
    }).catch((e) =>
      console.log('Local API save failed, but localStorage is still active.')
    )

    // Maintain LocalStorage as a dual-fallback layer
    localStorage.setItem('pms_v2_students', JSON.stringify(students))
    localStorage.setItem('pms_v2_teachers', JSON.stringify(teachers))
    localStorage.setItem('pms_v2_subjects', JSON.stringify(subjects))
    localStorage.setItem('pms_v2_classes', JSON.stringify(classes))
    localStorage.setItem('pms_v2_timetable', JSON.stringify(timetable))
    localStorage.setItem('pms_v2_fee_records', JSON.stringify(feeRecords))
    localStorage.setItem('pms_v2_exam_results', JSON.stringify(examResults))
    localStorage.setItem('pms_v2_announcements', JSON.stringify(announcements))
    localStorage.setItem('pms_v2_books', JSON.stringify(books))
    localStorage.setItem('pms_v2_homework', JSON.stringify(homework))
    localStorage.setItem('pms_v2_lms_courses', JSON.stringify(lmsCourses))
    localStorage.setItem('pms_v2_expenses', JSON.stringify(expenses))
    localStorage.setItem('pms_v2_exam_config', JSON.stringify(examConfig))
    localStorage.setItem('pms_v2_complaints', JSON.stringify(complaints))
    localStorage.setItem('pms_v2_visitors', JSON.stringify(visitors))
    localStorage.setItem(
      'pms_v2_online_payments',
      JSON.stringify(onlinePayments)
    )
    localStorage.setItem('pms_v2_attendance', JSON.stringify(attendance))
    localStorage.setItem('pms_v2_audit_logs', JSON.stringify(auditLogs))
    localStorage.setItem(
      'pms_v2_announced_results',
      JSON.stringify(announcedResults)
    )
    localStorage.setItem('pms_v2_live_classes', JSON.stringify(liveClasses))
  }, [
    students,
    teachers,
    subjects,
    classes,
    timetable,
    feeRecords,
    examResults,
    announcements,
    books,
    homework,
    lmsCourses,
    expenses,
    examConfig,
    complaints,
    visitors,
    onlinePayments,
    attendance,
    auditLogs,
    announcedResults,
    liveClasses,
    dbLoaded,
  ])

  // Logging function
  const addLog = (user, action) => {
    const time = new Date().toLocaleString()
    const newLog = { time, user, action, ip: '192.168.1.1' }
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 99)])
  }

  // Switch role and dynamically update the active user context profile
  const switchRole = (role) => {
    setCurrentRole(role)
    if (role === 'Super Admin' || role === 'Principal') {
      setCurrentUser({
        id: 'ADMIN-1',
        name: 'Muhammad Daud Khan',
        email: 'sulaimanpms855@gmail.com',
      })
    } else if (role === 'Teacher') {
      setCurrentUser(
        teachers[0] || {
          id: 'T-001',
          name: 'Prof. Nasir Khan',
          subject: 'Mathematics',
        }
      )
    } else if (role === 'Student') {
      setCurrentUser(
        students[0] || {
          id: 'PMS-2026-001',
          name: 'Ahmad Zaman Khan',
          class: 'Class 5',
          section: 'A',
        }
      )
    } else if (role === 'Parent') {
      setCurrentUser({
        id: 'P-001',
        name: 'Zaman Gul',
        childId: 'PMS-2026-001',
        childName: 'Ahmad Zaman Khan',
      })
    } else if (role === 'Accountant') {
      setCurrentUser({
        id: 'ACC-001',
        name: 'Sajid Mahmood',
        role: 'School Accountant',
      })
    } else if (role === 'Librarian') {
      setCurrentUser({
        id: 'LIB-001',
        name: 'Qari Hameedullah',
        role: 'School Librarian',
      })
    }
    addLog('System', `Switched active role to: ${role}`)
  }

  const login = (username, password) => {
    if (username === 'Pms1998' && password === 'Daud$1971') {
      setCurrentRole('Super Admin')
      setCurrentUser({
        id: 'ADMIN-1',
        name: 'Muhammad Daud Khan',
        email: 'sulaimanpms855@gmail.com',
      })
      setIsAuthenticated(true)
      addLog('System', 'Admin logged in')
      return true
    }
    const student = students.find(
      (s) => s.username === username && s.password === password
    )
    if (student) {
      if (student.accessStatus === 'Revoked') {
        alert('Your access has been revoked by the administrator.')
        return false
      }
      setCurrentRole('Student')
      setCurrentUser({
        id: student.id,
        name: student.name,
        class: student.class,
        section: student.section,
      })
      setIsAuthenticated(true)
      addLog('System', `Student ${student.name} logged in`)
      return true
    }
    const teacher = teachers.find(
      (t) => t.username === username && t.password === password
    )
    if (teacher) {
      if (teacher.accessStatus === 'Revoked') {
        alert('Your access has been revoked by the administrator.')
        return false
      }
      setCurrentRole('Teacher')
      setCurrentUser({
        id: teacher.id,
        name: teacher.name,
        subject: teacher.subject,
      })
      setIsAuthenticated(true)
      addLog('System', `Teacher ${teacher.name} logged in`)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setCurrentRole('')
    addLog('System', 'User logged out')
  }

  // ── STUDENT DBMS FUNCTIONS ──
  const addStudent = (st) => {
    const newId = `PMS-2026-${String(students.length + 1).padStart(3, '0')}`
    const username = `student${newId.split('-')[2]}`
    const password = `pass${Math.floor(1000 + Math.random() * 9000)}`
    const newStudent = {
      ...st,
      id: newId,
      username,
      password,
      fee: 'Pending',
      att: 100,
      grade: 'A',
      admDate: new Date().toISOString().split('T')[0],
      accessStatus: 'Active',
    }
    setStudents((prev) => [...prev, newStudent])
    addLog(currentRole, `Enrolled student ${newStudent.name} (${newId})`)
    return newStudent
  }

  const toggleStudentAccess = (id) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = s.accessStatus === 'Revoked' ? 'Active' : 'Revoked'
          addLog(
            currentRole,
            `${newStatus === 'Revoked' ? 'Revoked' : 'Granted'} access for student ${s.id}`
          )
          return { ...s, accessStatus: newStatus }
        }
        return s
      })
    )
  }

  const updateStudent = (id, fields) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...fields } : s))
    )
    addLog(currentRole, `Updated student profile ${id}`)
  }

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
    addLog(currentRole, `Deleted student ${id}`)
  }

  const promoteStudent = (id, targetClass, targetSection) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, class: targetClass, section: targetSection } : s
      )
    )
    addLog(
      currentRole,
      `Promoted student ${id} to ${targetClass}-${targetSection}`
    )
  }

  // ── TEACHER DBMS FUNCTIONS ──
  const addTeacher = (tc) => {
    const newId = `T-${String(teachers.length + 1).padStart(3, '0')}`
    const username = `teacher${newId.split('-')[1]}`
    const password = `pass${Math.floor(1000 + Math.random() * 9000)}`
    const newTeacher = {
      ...tc,
      id: newId,
      username,
      password,
      status: 'Active',
      accessStatus: 'Active',
      classes: ['Class 6', 'Class 7'],
    }
    setTeachers((prev) => [...prev, newTeacher])
    addLog(currentRole, `Registered teacher ${newTeacher.name} (${newId})`)
    return newTeacher
  }

  const toggleTeacherAccess = (id) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.accessStatus === 'Revoked' ? 'Active' : 'Revoked'
          addLog(
            currentRole,
            `${newStatus === 'Revoked' ? 'Revoked' : 'Granted'} access for teacher ${t.id}`
          )
          return { ...t, accessStatus: newStatus }
        }
        return t
      })
    )
  }

  const updateTeacher = (id, fields) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...fields } : t))
    )
    addLog(currentRole, `Updated teacher credentials ${id}`)
  }

  const deleteTeacher = (id) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id))
    addLog(currentRole, `Removed teacher ${id}`)
  }

  // ── CLASS & SUBJECTS FUNCTIONS ──
  const addClass = (cl) => {
    setClasses((prev) => [...prev, cl])
    addLog(currentRole, `Created new class: ${cl.name}`)
  }

  const addSubject = (sub) => {
    const newId = `S-${String(subjects.length + 1).padStart(2, '0')}`
    setSubjects((prev) => [...prev, { ...sub, id: newId }])
    addLog(currentRole, `Added new subject: ${sub.name}`)
  }

  const updateSubject = (id, fields) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...fields } : s))
    )
  }

  const deleteSubject = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id))
  }

  // ── ATTENDANCE DBMS FUNCTIONS ──
  const recordAttendance = (date, classId, records) => {
    setAttendance((prev) => {
      const dayRecords = prev[date] ? { ...prev[date] } : {}
      Object.keys(records).forEach((sid) => {
        dayRecords[sid] = records[sid]
      })
      return { ...prev, [date]: dayRecords }
    })
    // Dynamically calculate attendance percentage for students
    setStudents((prev) =>
      prev.map((s) => {
        if (records[s.id]) {
          // Recalculate attendance rate (mock dynamic shift)
          const newAtt =
            records[s.id] === 'Present'
              ? Math.min(100, s.att + 1)
              : Math.max(50, s.att - 2)
          return { ...s, att: Math.round(newAtt) }
        }
        return s
      })
    )
    addLog(currentRole, `Recorded attendance for ${classId} on ${date}`)
  }

  // ── EXAMS & MARKS DBMS FUNCTIONS ──
  const saveExamMarks = (marksList) => {
    // marksList: Array of objects { studentId, name, class, subjects: [], total, max, grade }
    setExamResults((prev) => {
      let updated = [...prev]
      marksList.forEach((m) => {
        const idx = updated.findIndex(
          (r) => r.id === m.studentId && (r.term || 'Mid-Term') === m.term && r.class === m.class
        )
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], ...m }
        } else {
          updated.push({
            student: m.name,
            id: m.studentId,
            class: m.class,
            subjects: m.subjects || [],
            total: m.total,
            max: m.max,
            grade: m.grade,
            term: m.term,
            pos: 1, // Recalculated position later
          })
        }
      })

      // Recalculate Positions per Class and Term
      const classTermGroups = [
        ...new Set(updated.map((u) => `${u.class}_${u.term || 'Mid-Term'}`)),
      ]
      classTermGroups.forEach((grp) => {
        const [cls, term] = grp.split('_')
        const classResults = updated
          .filter((u) => u.class === cls && (u.term || 'Mid-Term') === term)
          .sort((a, b) => b.total - a.total)
        classResults.forEach((cr, index) => {
          const mainIdx = updated.findIndex(
            (u) => u.id === cr.id && (u.term || 'Mid-Term') === term && u.class === cls
          )
          if (mainIdx !== -1) {
            updated[mainIdx].pos = index + 1
          }
        })
      })

      return updated
    })
    addLog(currentRole, `Saved exam marks for ${marksList.length} students`)
  }

  const announceClassResults = (className, term) => {
    const key = `${className}_${term}`
    if (announcedResults.includes(key)) {
      addLog(currentRole, `Results for ${className} - ${term} were already announced.`)
      return
    }

    setAnnouncedResults((prev) => [...prev, key])

    if (term.includes('Final')) {
      const classOrder = [
        'Nursery',
        'Prep',
        'KG',
        'Class 1',
        'Class 2',
        'Class 3',
        'Class 4',
        'Class 5',
        'Class 6',
        'Class 7',
        'Class 8',
        'Class 9',
        'Class 10',
      ]
      const currentIndex = classOrder.indexOf(className)
      const nextClass =
        currentIndex !== -1 && currentIndex < classOrder.length - 1
          ? classOrder[currentIndex + 1]
          : 'Graduated'

      setStudents((prev) =>
        prev.map((s) =>
          s.class === className ? { ...s, class: nextClass } : s
        )
      )
      addLog(
        currentRole,
        `Students in ${className} have been promoted to ${nextClass} following Final Exam.`
      )
    } else {
      addLog(currentRole, `Announced ${term} results for ${className}`)
    }
  }

  // ── HOMEWORK LMS FUNCTIONS ──
  const assignHomework = (hwObj) => {
    const newId = `HW-${String(homework.length + 1).padStart(3, '0')}`
    const newHw = {
      ...hwObj,
      id: newId,
      submitted: 0,
      total:
        students.filter(
          (s) => s.class === hwObj.class || hwObj.class.startsWith(s.class)
        ).length || 30,
      status: 'Active',
      submissions: [],
    }
    setHomework((prev) => [newHw, ...prev])
    addLog(currentRole, `Assigned homework for ${hwObj.class}: ${hwObj.title}`)
  }

  const submitHomework = (hwId, studentId, textContent, files = []) => {
    setHomework((prev) =>
      prev.map((h) => {
        if (h.id === hwId) {
          const subs = h.submissions ? [...h.submissions] : []
          const existIdx = subs.findIndex((s) => s.studentId === studentId)
          const subData = {
            studentId,
            text: textContent,
            files,
            date: new Date().toLocaleDateString(),
            grade: 'Pending',
            feedback: '',
          }
          if (existIdx !== -1) {
            subs[existIdx] = subData
          } else {
            subs.push(subData)
          }
          return { ...h, submissions: subs, submitted: subs.length }
        }
        return h
      })
    )
    addLog('Student', `Submitted homework for assignment ${hwId}`)
  }

  const gradeHomework = (hwId, studentId, grade, feedback) => {
    setHomework((prev) =>
      prev.map((h) => {
        if (h.id === hwId) {
          const subs = h.submissions
            ? h.submissions.map((s) =>
                s.studentId === studentId ? { ...s, grade, feedback } : s
              )
            : []
          return { ...h, submissions: subs }
        }
        return h
      })
    )
    addLog('Teacher', `Graded homework submission of ${studentId} for ${hwId}`)
  }

  // ── LMS RESOURCE FUNCTIONS ──
  const addLmsCourse = (course) => {
    setLmsCourses((prev) => [...prev, course])
    addLog('Admin', `Created new LMS course: ${course.subject}`)
  }

  const addLmsChapter = (courseId, chapter) => {
    setLmsCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return { ...c, chapters: [...c.chapters, chapter] }
        }
        return c
      })
    )
    addLog(
      'Teacher',
      `Added new chapter ${chapter.title} to course ${courseId}`
    )
  }

  const uploadLmsResource = (courseId, chapterTitle, resource) => {
    // resource: { title, type: 'PDF Notes' | 'Video Lecture' | 'Presentation', date }
    setLmsCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedChapters = c.chapters.map((ch) => {
            if (ch.title === chapterTitle) {
              const currentResources = ch.resources || []
              return {
                ...ch,
                resources: [...currentResources, resource],
                progress: Math.min(100, ch.progress + 10),
              }
            }
            return ch
          })
          return { ...c, chapters: updatedChapters }
        }
        return c
      })
    )
    addLog(
      'Teacher',
      `Uploaded ${resource.type} resource to chapter ${chapterTitle}`
    )
  }

  // ── FEE DBMS MANAGEMENT ──
  const generateFeesBulk = (month, feeCategories) => {
    // feeCategories: Array of { name, amount, selected }
    const activeFees = feeCategories.filter((fc) => fc.selected)
    const totalFeeAmt = activeFees.reduce((sum, f) => sum + f.amount, 0)

    const newRecords = students.map((st, i) => {
      const receiptId = `RCP-${String(feeRecords.length + i + 1).padStart(3, '0')}`

      let amountForStudent = totalFeeAmt
      // If student has a custom fee and Tuition is selected, replace standard tuition with custom
      if (
        st.customFee &&
        activeFees.find((f) => f.name === 'Monthly Tuition Fee')
      ) {
        const tuitionFeeItem = activeFees.find(
          (f) => f.name === 'Monthly Tuition Fee'
        )
        amountForStudent =
          totalFeeAmt - tuitionFeeItem.amount + Number(st.customFee)
      }

      return {
        id: `FR-${String(feeRecords.length + i + 1).padStart(3, '0')}`,
        studentId: st.id,
        name: st.name,
        class: st.class,
        month,
        amount: amountForStudent,
        status: 'Pending',
        date: '—',
        method: '—',
        receipt: receiptId,
      }
    })

    setFeeRecords((prev) => [...newRecords, ...prev])
    // Set matching student fee status to Pending
    setStudents((prev) => prev.map((s) => ({ ...s, fee: 'Pending' })))
    addLog(
      currentRole,
      `Bulk generated monthly fees for ${month} (${newRecords.length} invoices)`
    )
  }

  const payFeeRecord = (id, method) => {
    setFeeRecords((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: 'Paid',
              date: new Date().toLocaleDateString(),
              method,
            }
          : f
      )
    )
    // Find the record to update the student fee status as paid
    const record = feeRecords.find((f) => f.id === id)
    if (record) {
      setStudents((prev) =>
        prev.map((s) => (s.id === record.studentId ? { ...s, fee: 'Paid' } : s))
      )
      addLog(currentRole, `Marked fee record ${id} as Paid`)
    }
  }

  const undoFeeRecord = (id) => {
    const record = feeRecords.find((f) => f.id === id)
    if (record && record.status === 'Paid') {
      setFeeRecords((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: 'Pending', date: '', method: '' } : f
        )
      )
      setStudents((prev) =>
        prev.map((s) =>
          s.id === record.studentId ? { ...s, fee: 'Pending' } : s
        )
      )
      addLog(currentRole, `Undid fee payment for record ${id}`)
    }
  }

  const uploadEasypaisaReceipt = (
    studentId,
    name,
    amount,
    month,
    txId,
    screenshot
  ) => {
    const newPayment = {
      id: onlinePayments.length + 1,
      studentId,
      name,
      amount: Number(amount),
      txId,
      method: 'Easypaisa',
      screenshot,
      status: 'Pending',
      month,
      date: new Date().toLocaleDateString(),
    }
    setOnlinePayments((prev) => [newPayment, ...prev])
    addLog(
      'Parent/Student',
      `Submitted online payment verification request for ${name} (${txId})`
    )
  }

  const verifyOnlinePayment = (opId) => {
    const payment = onlinePayments.find((p) => p.id === opId)
    if (payment) {
      setOnlinePayments((prev) =>
        prev.map((p) => (p.id === opId ? { ...p, status: 'Approved' } : p))
      )

      // Update feeRecords match
      setFeeRecords((prev) =>
        prev.map((f) =>
          f.studentId === payment.studentId && f.month === payment.month
            ? {
                ...f,
                status: 'Paid',
                date: new Date().toLocaleDateString(),
                method: payment.method,
              }
            : f
        )
      )
      setStudents((prev) =>
        prev.map((s) =>
          s.id === payment.studentId ? { ...s, fee: 'Paid' } : s
        )
      )

      addLog('Accountant', `Approved payment transaction ID: ${payment.txId}`)
    }
  }

  const undoOnlinePayment = (opId) => {
    const payment = onlinePayments.find((p) => p.id === opId)
    if (payment && payment.status === 'Approved') {
      setOnlinePayments((prev) =>
        prev.map((p) => (p.id === opId ? { ...p, status: 'Pending' } : p))
      )

      // Revert feeRecords match
      setFeeRecords((prev) =>
        prev.map((f) =>
          f.studentId === payment.studentId && f.month === payment.month
            ? { ...f, status: 'Pending', date: '', method: '' }
            : f
        )
      )
      setStudents((prev) =>
        prev.map((s) =>
          s.id === payment.studentId ? { ...s, fee: 'Pending' } : s
        )
      )

      addLog(
        'Accountant',
        `Undid online payment approval for TXID: ${payment.txId}`
      )
    }
  }

  // ── EXPENSE FUNCTIONS ──
  const addExpenseItem = (exp) => {
    setExpenses((prev) => {
      const idx = prev.findIndex((e) => e.category === exp.category)
      if (idx !== -1) {
        return prev.map((e, i) =>
          i === idx ? { ...e, amount: e.amount + Number(exp.amount) } : e
        )
      } else {
        return [
          ...prev,
          {
            category: exp.category,
            amount: Number(exp.amount),
            icon: '📦',
            color: '#94A3B8',
          },
        ]
      }
    })
    addLog(
      currentRole,
      `Logged operational expense: PKR ${exp.amount} for ${exp.category}`
    )
  }

  // ── ANNOUNCEMENTS FUNCTIONS ──
  const addAnnouncementItem = (ann) => {
    const newId = announcements.length + 1
    const newAnn = {
      id: newId,
      title: ann.title,
      body: ann.body,
      type: ann.priority,
      date: new Date().toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      channels:
        ann.channels === 'All Channels'
          ? ['Dashboard', 'WhatsApp', 'SMS', 'Email']
          : [ann.channels],
    }
    setAnnouncements((prev) => [newAnn, ...prev])
    addLog(currentRole, `Published announcement: ${ann.title}`)
  }

  // ── LIBRARY DBMS FUNCTIONS ──
  const checkoutBookItem = (bookId, studentId, studentName, dueDate) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const checkouts = b.checkouts ? [...b.checkouts] : []
          checkouts.push({
            id: checkouts.length + 1,
            studentId,
            studentName,
            issueDate: new Date().toLocaleDateString(),
            dueDate,
            status: 'Issued',
          })
          return { ...b, issued: b.issued + 1, checkouts }
        }
        return b
      })
    )
    addLog('Librarian', `Checked out book ${bookId} to ${studentName}`)
  }

  const returnBookItem = (bookId, checkoutId, fineAmount = 0) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const checkouts = b.checkouts
            ? b.checkouts.map((c) =>
                c.id === checkoutId
                  ? {
                      ...c,
                      status: 'Returned',
                      returnDate: new Date().toLocaleDateString(),
                      fine: fineAmount,
                    }
                  : c
              )
            : []
          return { ...b, issued: Math.max(0, b.issued - 1), checkouts }
        }
        return b
      })
    )
    if (fineAmount > 0) {
      // Add to expenses / income (fine is cash collected)
      addLog(
        'Librarian',
        `Returned book ${bookId} and collected fine of PKR ${fineAmount}`
      )
    } else {
      addLog('Librarian', `Returned book ${bookId} in good condition`)
    }
  }

  const addLibraryBook = (bk) => {
    const newId = `BK-${String(books.length + 1).padStart(3, '0')}`
    setBooks((prev) => [
      ...prev,
      {
        id: newId,
        title: bk.title,
        author: bk.author,
        isbn: bk.isbn,
        qty: Number(bk.qty),
        issued: 0,
        checkouts: [],
      },
    ])
    addLog('Librarian', `Added book to catalog: ${bk.title}`)
  }

  // ── ADVANCED COMPLAINT PORTAL ──
  const logComplaint = (comp) => {
    const newId = complaints.length + 1
    setComplaints((prev) => [
      {
        id: newId,
        ...comp,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ])
    addLog(
      currentRole,
      `Logged complaint regarding: ${comp.body.slice(0, 30)}...`
    )
  }

  const resolveComplaint = (id) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Resolved' } : c))
    )
    addLog(currentRole, `Resolved complaint ID ${id}`)
  }

  // ── VISITOR MANAGEMENT ──
  const logVisitorEntry = (vis) => {
    const newId = visitors.length + 1
    setVisitors((prev) => [
      {
        id: newId,
        ...vis,
        inTime: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        outTime: '—',
        date: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ])
    addLog(currentRole, `Logged visitor entry: ${vis.name}`)
  }

  const logVisitorExit = (id) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              outTime: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : v
      )
    )
    addLog(currentRole, `Logged visitor checkout ID ${id}`)
  }

  // ── LIVE CLASSES ──
  const startLiveClass = (courseData) => {
    const roomId = `PMS-Live-${Date.now()}`
    const newClass = { ...courseData, roomId, startTime: new Date().toISOString() }
    setLiveClasses((prev) => [...prev, newClass])
    addLog(currentRole, `Started live class for ${courseData.class} - ${courseData.subject}`)
    return roomId
  }

  const endLiveClass = (roomId) => {
    setLiveClasses((prev) => prev.filter(c => c.roomId !== roomId))
    addLog(currentRole, `Ended live class session ${roomId}`)
  }

  // ── BACKUP & SECURITY JSON OPERATIONS ──
  const getBackupPayload = () => {
    return JSON.stringify({
      students,
      teachers,
      subjects,
      classes,
      timetable,
      feeRecords,
      examResults,
      announcements,
      books,
      homework,
      lmsCourses,
      expenses,
      complaints,
      visitors,
      onlinePayments,
      attendance,
      auditLogs,
      examConfig,
      announcedResults,
      liveClasses,
    })
  }

  const restoreFromPayload = (jsonString) => {
    try {
      const data = JSON.parse(jsonString)
      if (data.students) setStudents(data.students)
      if (data.teachers) setTeachers(data.teachers)
      if (data.subjects) setSubjects(data.subjects)
      if (data.classes) setClasses(data.classes)
      if (data.timetable) setTimetable(data.timetable)
      if (data.feeRecords) setFeeRecords(data.feeRecords)
      if (data.examResults) setExamResults(data.examResults)
      if (data.announcements) setAnnouncements(data.announcements)
      if (data.books) setBooks(data.books)
      if (data.homework) setHomework(data.homework)
      if (data.lmsCourses) setLmsCourses(data.lmsCourses)
      if (data.expenses) setExpenses(data.expenses)
      if (data.complaints) setComplaints(data.complaints)
      if (data.visitors) setVisitors(data.visitors)
      if (data.onlinePayments) setOnlinePayments(data.onlinePayments)
      if (data.attendance) setAttendance(data.attendance)
      if (data.auditLogs) setAuditLogs(data.auditLogs)
      if (data.announcedResults) setAnnouncedResults(data.announcedResults)
      if (data.liveClasses) setLiveClasses(data.liveClasses)

      addLog('System', 'Database restored successfully from backup.')
      return { success: true }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }

  return (
    <DbContext.Provider
      value={{
        dbLoaded,
        currentUser,
        currentRole,
        login,
        logout,
        switchRole,
        isAuthenticated,
        students,
        addStudent,
        toggleStudentAccess,
        updateStudent,
        deleteStudent,
        teachers,
        addTeacher,
        deleteTeacher,
        subjects,
        addSubject,
        classes,
        addClass,
        timetable,
        feeRecords,
        generateFeesBulk,
        payFeeRecord,
        undoFeeRecord,
        uploadEasypaisaReceipt,
        verifyOnlinePayment,
        undoOnlinePayment,
        onlinePayments,
        examResults,
        saveExamMarks,
        announcements,
        addAnnouncementItem,
        books,
        checkoutBookItem,
        returnBookItem,
        addLibraryBook,
        homework,
        assignHomework,
        submitHomework,
        gradeHomework,
        lmsCourses,
        addLmsCourse,
        addLmsChapter,
        uploadLmsResource,
        expenses,
        addExpenseItem,
        complaints,
        logComplaint,
        resolveComplaint,
        visitors,
        logVisitorEntry,
        logVisitorExit,
        attendance,
        recordAttendance,
        auditLogs,
        addLog,
        getBackupPayload,
        restoreFromPayload,
        examConfig,
        setExamConfig,
        announcedResults,
        announceClassResults,
        liveClasses,
        startLiveClass,
        endLiveClass,
      }}
    >
      {children}
    </DbContext.Provider>
  )
}

export function useDb() {
  const context = useContext(DbContext)
  if (!context) throw new Error('useDb must be used within a DbProvider')
  return context
}
