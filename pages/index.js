import mongoose from "mongoose";
import {StaffTag, User, UserStatistic} from "../lib/db";
import {useEffect, useState} from "react";

export default function Home({users, usersCount, userStatisticsCount, staffTagsCount}) {
  const [stats, setStats] = useState(JSON.parse(users))

  return (
    <div className="container mx-auto min-h-screen py-6">
      <h3 className="text-3xl font-semibold">SonOyuncu eski sıralama - ilk 300</h3>
      <ul className="flex gap-6 font-mono text-sm font-semibold text-gray-400 list-disc">
        <li>Toplam kayıtlı kullanıcı: {usersCount}</li>
        <li>Kayıtlı kullanıcı istatiği {userStatisticsCount}</li>
        <li>Yetkili etiketleme istatistiği: {staffTagsCount}</li>
      </ul>
      <ul className="mt-4 flex flex-col gap-2">
        {stats.map((u, i) => {
          return (
            <li key={u.userId}
                className="border border-gray-300 rounded-md px-4 py-2 flex justify-between items-center hover:font-semibold hover:border-orange-400">
              <p className="flex-[1]">
                <strong className="text-lg text-gray-400">#{i+1}</strong> {u.username}
              </p>
              <span className="text-xs text-gray-400 flex-[1]">
                ID: {u.userId}
              </span>
              <p className="font-mono text-sm">İlk mesaj: {u.firstMessage} - Toplam: {u.total}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export async function getServerSideProps() {
  await mongoose.connect(process.env.MONGO_CONNECT)

  const userStatistics = await UserStatistic.find().limit(300).sort({total: 'desc'})
  const usersCount = await User.count({})
  const userStatisticsCount = await UserStatistic.count({})
  const staffTagsCount = await StaffTag.count({})
  const userWithStatistics = []

  await Promise.all(
    userStatistics.map(async (u) => {
      const user = await User.find({userId: u.userId})

      userWithStatistics.push({...user[0]._doc, total: u.total})
    })
  )

  await Promise.all(
    userWithStatistics.sort(function(a, b){
      return b.total - a.total
    })
  )


  return {
    props: {
      users: JSON.stringify(userWithStatistics),
      usersCount,
      userStatisticsCount,
      staffTagsCount
    }
  }
}
