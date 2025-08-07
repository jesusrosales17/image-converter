interface ImageDisplayProps {
  src?: string;
  alt: string;
  className?: string;
}

export const ImageDisplay = ({ src, alt, className = "" }: ImageDisplayProps) => {
  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className={`max-w-full max-h-full object-contain rounded ${className}`}
      onError={(e) => {
        e.currentTarget.src = "/placeholder.svg";
      }}
    />
  );
};
