import Image from 'next/image'
import Link from 'next/link'

import ynIcon from '@/../public/yn-icon.svg'

export default function Footer() {

  return (
    <footer className='flex flex-col items-center justify-center w-full mt-14 mb-4'>
      <div className='flex justify-between w-5/6 py-8'>
        <div className='flex flex-col items-center text-xs'>
          <Link className='my-auto' href='/'>
            <Image className='w-12 h-12' alt='logo' src={ynIcon} />
          </Link>
          <p>© 2023 YieldNest</p>
        </div>
        <div className='flex gap-4'>
          <div className='flex flex-col'>
            <h2 className='pb-2 text-primary'>Community</h2>
            <Link href='https://discord.gg/ayAZuQgFaE' rel="noopener noreferrer" target="_blank">
              <p>Discord</p>
            </Link>
            <Link href='https://twitter.com/YieldNestFi' rel="noopener noreferrer" target="_blank">
              <p>Twitter</p>
            </Link>
            <Link href='https://t.me/YieldNest' rel="noopener noreferrer" target="_blank">
              <p>Telegram</p>
            </Link>
          </div>
          <div className='flex flex-col'>
            <h2 className='pb-2 text-primary'>Resources</h2>
            <Link href='https://docs.yieldnest.finance/' rel="noopener noreferrer" target="_blank">
              <p>Docs</p>
            </Link>
            <Link href='https://github.com/orgs/yieldnest/repositories' rel="noopener noreferrer" target="_blank">
              <p>Github</p>
            </Link>
            <Link href='https://yieldnest.substack.com/' rel="noopener noreferrer" target="_blank">
              <p>Blog</p>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
