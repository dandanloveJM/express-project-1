const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Errors = require('../../errors')
const logger = require('../../utils/logger').logger
const { ObjectId } = Schema.Types

const CourseSchema = Schema({
  userId: { type: ObjectId, index: 1 },
  course: { type: String },
  teacher: { type: String }

})

const CourseModel = mongoose.model('course', CourseSchema)

async function addCourse(params) {
  const newCourse = new CourseModel({
    userId: params.userId,
    course: params.course,
    teacher: params.teacher,
  })

  return await newCourse.save()
    .catch(e => {
      throw new Error(`error ${params.userId} adding course `)
    })
}

async function findStuByFuzzyCourseName(keyword) {
  let regex = new RegExp(escapeRegex(keyword), 'gi')
  let flow = CourseModel.find({ course: regex })
  flow.select({ "course": 1,"userId":1, "_id": 0 })

  return await flow
    .catch(e => {
      const errorMsg = 'error finding user'
      logger.error(errorMsg, { err: e.stack || e })
      throw new Errors.InternalError(errorMsg)
    })
  
}


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

async function findStuByCourseName(courseName) {
  const course = await CourseModel.find({ course: courseName })
    .select({ "userId": 1, "_id": 0 })
    .catch(e => {
      const errorMsg = 'error finding user'
      logger.error(errorMsg, { err: e.stack || e })
      throw new Errors.InternalError(errorMsg)
    })

  return course
}

async function getCourseByuserId(userId) {
  let flow = CourseModel.find({ userId: userId })
  flow.select({ "course": 1,"teacher":1, "_id": 0 })

  return await flow
    .catch(e => {
      console.log(e)
      throw new Error('error getting course from db')
    })
}
async function getCourses(params = { page: 0, pageSize: 10 }) {
  let flow = CourseModel.find({})
  flow.skip(params.page * params.pageSize)
  flow.limit(params.pageSize)
  return await flow
      .catch(e => {
          console.log(e)
          throw new Error('error getting users from db')
      })
}
module.exports = {
  CourseModel,
  addCourse,
  findStuByCourseName,
  getCourseByuserId,
  getCourses,
  findStuByFuzzyCourseName
}