import mongoose from "mongoose"
import { User, UserStatistic } from "../../../lib/db"
import rateLimit from "../../../utils/rate-limit"

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500
})

export default async function handler(req, res){
    try {
        await limiter.check(res, 10, 'CACHE_TOKEN')
        const query = req.query
        const {id} = query

        if(!id) return res.status(400).json({
            ok: false,
            message: 'ID must be provided'
        })

        await mongoose.connect(process.env.MONGO_CONNECT)
        const userStatistic = await UserStatistic.find({
            userId: id
        })
        const user = await User.find({userId: id})

        if(!user[0]) return res.status(200).json({ok: true})

        return res.status(200).json({
            ok: true,
            user: {...userStatistic, ...user}
        })
    } catch {
        return res.status(429).json({ok: false, message: 'Rate limit exceeded'})
    }
    
}