import Link from 'next/link';
import { ENTITIES } from '@/lib/nav';
import { SearchBox } from './SearchBox';

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0c10]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-1.5 font-black tracking-tight">
          <span className="text-xl text-accent">MH4U</span>
          <span className="text-xl text-white">DB</span>
        </Link>

        <nav className="order-3 flex w-full gap-1 overflow-x-auto text-sm sm:order-2 sm:w-auto">
          {ENTITIES.map((entity) => (
            <Link
              key={entity.href}
              href={entity.href}
              className="whitespace-nowrap rounded-md px-2.5 py-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {entity.label}
            </Link>
          ))}
        </nav>

        <div className="order-2 ml-auto sm:order-3">
          <SearchBox />
        </div>
      </div>
    </header>
  );
}
