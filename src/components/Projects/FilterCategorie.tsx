"use client";
import { useCategories } from '@/hooks/useCategories';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function FilterCategorie() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const pathname = usePathname();
  const t = useTranslations('categories');
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || '';
  const categoryList = category.split(',').filter(Boolean);

  const nextValue = (cat?: string) => {
    if (!cat) return "";
    const currentCat = searchParams.get('category')?.split(',').filter(Boolean) || [];
    return currentCat.includes(cat) ? currentCat.filter((it) => it !== cat).join(',') : [...currentCat, cat].join(',');
  };

  const handleClick = (cat?: string) => {
    const value = nextValue(cat);
    router.replace(value ? `${pathname}?category=${value}` : pathname, { scroll: false });
  };

  return (
    <div className='flex gap-3.5 w-full flex-wrap justify-center'>
      {categories?.map((item, index) => {
        const isActive = categoryList.includes(item);
        return (
          <button
            key={index}
            onClick={() => handleClick(item)}
            className={`group relative overflow-hidden rounded-full px-5 py-2.5 border transition-all duration-300 ease-out transform active:scale-95 ${isActive ? 'border-foreground text-foreground shadow-md shadow-black/10 -translate-y-0.5' : 'border-black/10 hover:border-foreground/40 hover:-translate-y-0.5'}`}
          >
            <span className={`absolute inset-0 transition-transform duration-300 ease-out ${isActive ? 'bg-foreground/10 scale-100' : 'bg-black/5 scale-0 group-hover:scale-100'}`} />
            <span className='relative z-[2]'>{t(item)}</span>
          </button>
        );
      })}
    </div>
  );
}

export default FilterCategorie;
