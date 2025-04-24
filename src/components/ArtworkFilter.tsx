
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface ArtworkFilterProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const ArtworkFilter = ({ selectedCategory, onCategoryChange }: ArtworkFilterProps) => {
  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: 'All Works' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'still-life', label: 'Still Life' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className={`font-serif ${
            selectedCategory === category.value ? '' : 'bg-white'
          }`}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default ArtworkFilter;
