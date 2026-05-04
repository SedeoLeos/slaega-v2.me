import Link from 'next/link';

const stats = [
  { label: '1434 DESIGNS COMPLETED', bg: 'bg-red-400' },
  { label: '17 CLIENTS EVERY MONTH', bg: 'bg-green-app' },
  { label: '2 BILLION LINES OF CODE', bg: 'bg-orange-300' },
  { label: '1200+ HAPPY CLIENTS', bg: 'bg-red-950' },
];

function Banner() {
  return (
    <div className='self-center w-full max-w-content justify-between flex py-10 lg:px-20 flex-col lg:flex-row gap-10 lg:gap-0 lg:flex-nowrap relative'>
      {/* Stat strips */}
      <div className='text-white uppercase -space-y-0.5 flex-shrink-0'>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`${s.bg} py-2.5 px-4 text-xs font-bold tracking-widest`}
            style={{ width: `${370 - i * 50}px`, maxWidth: '100%' }}
          >
            {s.label}
          </div>
        ))}
      </div>

      {/* Info card */}
      <div className='flex bg-white self-end lg:self-center shadow-lg rounded-sm overflow-hidden lg:w-auto w-full sm:max-w-sm'>
        <div className='bg-foreground w-16 flex-shrink-0' />
        <div className='p-5 flex flex-col gap-2'>
          <p className='text-sm font-semibold leading-relaxed text-foreground'>
            Full-Stack Engineer with a Passion for Robust &amp; Scalable Apps
          </p>
          <Link
            href='/about'
            className='text-sm font-bold text-green-app hover:underline inline-flex items-center gap-1'
          >
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Banner;
