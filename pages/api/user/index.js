import mongoose from 'mongoose'
import { User, UserStatistic } from '../../../lib/db'
import rateLimit from '../../../utils/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})

export default async function handler(req, res) {
  try {
    await limiter.check(res, 30, 'CACHE_TOKEN')
    const query = req.query
    const { limit } = query

    if (!limit)
      return res
        .status(404)
        .json({ ok: false, message: 'Limit must be provided' })
    if (limit > 1000)
      return res
        .status(400)
        .json({ ok: false, message: 'Limit must be 〜1000' })

    await mongoose.connect(process.env.MONGO_CONNECT)
    const userStatistics = await UserStatistic.find()
      .limit(limit)
      .sort({ total: 'desc' })
    const userWithStatistics = []
    await Promise.all(
      userStatistics.map(async (u) => {
        const user = await User.find({ userId: u.userId })
        userWithStatistics.push({ ...user[0]._doc, total: u.total })
      }),
    )

    await Promise.all(
      userWithStatistics.sort((a, b) => {
        return b.total - a.total
      }),
    )

    return res
      .status(200)
      .json({ ok: true, message: 'Succesful', data: userWithStatistics })
  } catch {
    return res.status(429).json({ ok: false, message: 'Rate limit exceeded' })
  }
}
