import { Input } from '@/components/ui/input';
import { getImageUrl } from '@/lib/getImageUrl';
import { Upload, X } from 'lucide-react';

export const SeasonTagInput = ({
  value,
  onChange,
  onImageChange,
  index,
  seasonIndex,
  placeholder,
}) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    onImageChange(index, file);
  };

  const handleDescriptionChange = (e) => {
    onChange(index, {
      ...value,
      description: e.target.value,
    });
  };

  const removeImage = () => {
    onImageChange(index, null);
  };

  const inputId = `season-tag-image-${seasonIndex}-${index}`;

  return (
    <div className='flex items-center gap-3'>
      <div
        className='w-10 h-10 border-2 border-dashed border-muted-foreground/25 rounded-md flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors flex-shrink-0 bg-muted/20 relative'
        onClick={() => document.getElementById(inputId).click()}>
        {value.imagePreview ? (
          <>
            <img
              src={getImageUrl(value.imagePreview) || '/placeholder.svg'}
              alt={`Tag ${index + 1}`}
              className='w-full h-full object-cover rounded-md'
            />
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'>
              <X className='w-3 h-3' />
            </button>
          </>
        ) : (
          <Upload className='w-4 h-4 text-muted-foreground' />
        )}
        <input
          type='file'
          id={inputId}
          accept='image/*'
          className='hidden'
          onChange={handleImageChange}
        />
      </div>
      <Input
        type='text'
        placeholder={placeholder}
        value={value.description || ''}
        onChange={handleDescriptionChange}
        className='flex-1 border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground px-0'
      />
    </div>
  );
};
