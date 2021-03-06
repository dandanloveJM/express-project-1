const User = require('../models/mongo/user')
const Topic = require('../models/mongo/topic')
const PointsOp = require('../models/mongo/point')
const Like = require('../models/mongo/like')
const {ObjectId} = require('mongoose').Types
const PointService = require('./point_service')

//userId user who likes  attachedId: user whose topic is liked.
async function likeTopic (userId, attachedId) {
  await Like.like(ObjectId(userId), ObjectId(attachedId), Like.LIKE_TYPES.TOPIC)
  await Topic.likeATopic(attachedId)
  let topicCreator = await Topic.getTopicCreator(attachedId)
  await PointService.incrUserPoints(topicCreator, 10, PointsOp.POINTS_OP_TYPES.LIKE)
  return true
}

async function likeReply (userId, attachedId) {
  await Like.like(ObjectId(userId), ObjectId(attachedId), Like.LIKE_TYPES.REPLY)
  await Topic.likeAReply(attachedId)
  let replyCreator = await Topic.getReplyCreator(attachedId)
  await PointService.incrUserPoints(replyCreator, 10, PointsOp.POINTS_OP_TYPES.LIKE)
 
  return true
}

async function dislikeTopic (userId, attachedId) {
  await Like.dislike(userId, attachedId)
  await Topic.dislikeATopic(attachedId)
  await PointService.incrUserPoints(ObjectId(userId), -10, PointsOp.POINTS_OP_TYPES.DISLIKE)
  return true
}

async function dislikeReply (userId, attachedId) {
  await Like.dislike(userId, attachedId)
  await Topic.dislikeAReply(attachedId)
  await PointService.incrUserPoints(ObjectId(userId), -10, PointsOp.POINTS_OP_TYPES.DISLIKE)
  return true
}

module.exports = {
  likeReply,
  likeTopic,
  dislikeTopic,
  dislikeReply,
}