import mongoose from 'mongoose'

const { Schema } = mongoose

const userStatisticSchema = new Schema({
  userId: String,
  total: Number,
})

const userSchema = new Schema({
  userId: String,
  username: String,
  avatarURL: String,
  firstMessage: String,
  total: { type: Number, required: false },
})

const staffTagsSchema = new Schema({
  userId: String,
  fullMessage: String,
})

export const StaffTag =
  mongoose.models.StaffTags || mongoose.model('StaffTags', staffTagsSchema)
export const User = mongoose.models.Users || mongoose.model('Users', userSchema)
export const UserStatistic =
  mongoose.models.UserStatistics ||
  mongoose.model('UserStatistics', userStatisticSchema)
