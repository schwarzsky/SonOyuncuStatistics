import mongoose from 'mongoose'
import { StaffTag, User, UserStatistic } from '../lib/db'
import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function Home({
  usersCount,
  userStatisticsCount,
  staffTagsCount,
}) {
  const [stats, setStats] = useState([])
  const [limit, setLimit] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const data = await fetch(`/api/user?limit=${limit * 50}`).then((r) =>
      r.json(),
    )

    setStats(data.data)
    setLoading(false)
  }

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight

    if (bottom) {
      if (limit !== 20) setLimit(limit + 1)
      fetchData()
    }
  }

  return (
    <div className="container max-w-[720px] mx-auto min-h-screen py-6 lg:px-0 px-6">
      <Head>
        <title>sonoyuncu statistics</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="theme-color" content="#0f03fc" />
      </Head>
      <header className="flex items-center justify-between py-16">
        <img
          src="output.gif"
          width={50}
          height={50}
          className="hover:blur-[2px] transition-all cursor-pointer "
        />
        <h1 className="font-medium text-slate-500">sonoyuncu statistics</h1>
      </header>
      <section className="py-8">
        <h3 className="font-medium text-sm">API</h3>
        <a
          className="text-xs"
          href="https://sonoyuncu.korau.co/api/user/925383171741188106"
          target="_blank"
          rel="noreferrer">
          <code>https://sonoyuncu.korau.co/api/user/id</code> -&gt;
          <br />{' '}
          <code>https://sonoyuncu.korau.co/api/user/925383171741188106</code>
        </a>
      </section>
      <ul
        onScroll={handleScroll}
        className="max-h-[800px] overflow-auto mt-4 flex flex-col gap-2 [&>*:first-child]:text-transparent [&>*:first-child]:bg-clip-text [&>*:first-child]:bg-gradient-to-r [&>*:first-child]:from-blue-700 [&>*:first-child]:to-blue-900">
        {stats?.map((u, i) => {
          return (
            <li key={u.userId} className="flex justify-between">
              <p>
                {i + 1}.{u.username}
              </p>
              <span className="flex-[1] border-b border-b-gray-300 border-dotted self-end"></span>
              <p className="text-xs text-slate-500">{u.userId}</p>
            </li>
          )
        })}
        {loading && (
          <p className="text-center font-medium text-slate-500 w-full">
            loading
          </p>
        )}
      </ul>
      <ul className="flex gap-6 uppercase text-xs font-semibold text-gray-400 border-t my-4 py-2">
        <li>Registered Users: {usersCount}</li>
        <li className="flex-[1] flex justify-center">
          User Profiles: {userStatisticsCount}
        </li>
        <li className="self-end">Staff @: {staffTagsCount}</li>
      </ul>
    </div>
  )
}

export async function getServerSideProps() {
  await mongoose.connect(process.env.MONGO_CONNECT)
  const usersCount = await User.count({})
  const userStatisticsCount = await UserStatistic.count({})
  const staffTagsCount = await StaffTag.count({})

  return {
    props: {
      usersCount,
      userStatisticsCount,
      staffTagsCount,
    },
  }
}
