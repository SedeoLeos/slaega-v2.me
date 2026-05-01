import Link from 'next/link';

const stats = [
  { label: '1434 DESIGNED COMPLETED', bg: 'bg-red-400', w: 'w-[384px]' },
  { label: '17 CLIENTS EVERY MONTH', bg: 'bg-green-app', w: 'w-[310px]' },
  { label: '2 BILLION LINES OF CODE', bg: 'bg-orange-300', w: 'w-[280px]' },
  { label: '1200+ CLIENTS', bg: 'bg-red-950', w: 'w-[173px]' },
];

function Banner() {
  return (
    <div className='self-center w-full max-w-content justify-between sm:flex-col flex py-10 lg:px-20 flex-wrap lg:flex-row gap-10 lg:gap-0 flex-col lg:flex-nowrap'>

      <div className='text-white uppercase -space-y-2'>
        {stats.map((s) => (
          <div key={s.label} className={`${s.w} ${s.bg} py-2 px-2 text-sm font-semibold`}>
            {s.label}
          </div>
        ))}
      </div>

      <div className='w-full sm:w-md flex bg-white self-end lg:self-center lg:absolute lg:right-0'>
        <div className='bg-black w-56' />
        <div className='p-3 sm:p-5'>
          <p className='text-sm font-medium leading-relaxed'>Full-Stack Engineer with a Passion for Robust &amp; Scalable Apps</p>
          <Link href='/about' className='text-sm font-semibold underline mt-2 inline-block'>learn more</Link>
        </div>
      </div>
    </div>
  );
}

export default Banner;
