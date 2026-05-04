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
    return currentCat.includes(cat)
      ? currentCat.filter((it) => it !== cat).join(',')
      : [...currentCat, cat].join(',');
  };

  const handleClick = (cat?: string) => {
    const value = nextValue(cat);
    router.replace(value ? `${pathname}?category=${value}` : pathname, { scroll: false });
  };

  return (
    <div className='flex gap-2.5 w-full flex-wrap justify-center'>
      {categories?.map((item, index) => {
        const isActive = categoryList.includes(item);
        return (
          <button
            key={index}
            onClick={() => handleClick(item)}
            className={`
              relative overflow-hidden rounded-full px-5 py-2 text-sm font-medium
              border transition-all duration-200 ease-out active:scale-95
              ${isActive
                ? 'bg-foreground text-background border-foreground shadow-sm'
                : 'bg-transparent text-foreground/60 border-foreground/15 hover:border-foreground/35 hover:text-foreground'
              }
            `}
          >
            {t(item)}
          </button>
        );
      })}
    </div>
  );
}

export default FilterCategorie;
